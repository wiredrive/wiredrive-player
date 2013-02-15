//jquery is the only dependency and it's loaded syncronously.
//no need for a doc.ready function
(function ($) {
    "use strict";

        //in case we're in IE8, we're going to define a local var `console`
        //to clobber the global one inside this scope so that we can log
        //to our heart's content without IE8 complaining about its ingornace
    var console = (function () {
            var console = window.console;

            if (typeof console === 'object' && typeof console.log === 'function') {
                return console;
            }

            console = {};
            console.log = console.warn = console.error = function () {};

            return console;
        }()),

        WDP,

        /*
         * Player templates
         */
        IMAGE_TEMPLATE = [
            '<div class="wd-image-container">',
                '<div class="wd-paginate previous disabled"></div>',
                '<img class="wd-image" />',
                '<div class="wd-paginate next"></div>',
            '</div>'
        ].join(''),

        FLASH_TEMPLATE = [
            '<div class="wd-flash-container">',
                '<div class="wd-flash-replace">',
                    "You don't seem to have flash.",
                '</div>',
            '</div>'
        ].join(''),

        VIDEO_TEMPLATE = [
            '<video class="wd-video" preload="none" x-webkit-airplay="allow"></video>',
            '<div class="wd-play-button"></div>'
        ].join(''),

        VALID_PLAYER_TYPES = ['flash', 'video'],

        _uid = 1, //uid value. used for WDP.uniqueId()
        _players = {}, //"private" list of all player instances

        /*
         * Mixins for Player objects that connect it to the given media player
         */
        mixins = {
            video: {
                attachPlayer: function () {
                    var instance = this,
                        first = instance.items[0],
                        isVideo = first.mimetype === 'video',
                        $player, $playButton,
                        $tpl = $(VIDEO_TEMPLATE);

                    instance.$container.find('.wd-stage').prepend($tpl);

                    $playButton = instance.$container.find('.wd-play-button'),
                    $player = instance.$container.find('video');
                    $player.attr('height', WDP.options.height);
                    $player.attr('width', WDP.options.width);

                    if (isVideo) {
                        $player.attr('poster', first.poster);
                        $player.attr('src', first.url);

                        $playButton.one('click', function (e) {
                            $(e.target).remove();
                            $player.attr('controls', 'controls');
                            $player.removeAttr('poster');
                            instance.play();
                        });
                    } else {
                        $playButton.remove();
                        $player.attr('controls', 'controls');
                    }

                    instance.$player = $player;

                    $player.on('ended', function (e) {
                        instance.setSource(instance.current + 1)
                            && instance.getCurrentType() === 'video'
                            && instance.play();
                    });

                    instance.setReady();
                },

                _setPlayerSource: function (index) {
                    var asset = this.items[index],
                        $player = this.$player,
                        player = $player.get(0);

                    $player.attr('src', asset.url);
                    player.load();
                },

                play: function () {
                    this.$player.get(0).play();
                },
            },
            flash: {
                _setPlayerSource: function (index) {
                    var asset = this.items[index],
                        player = this.$player.get(0);

                    player.setSrc(asset.url);
                    player.load();
                },

                play: function () {
                    this.$player.get(0).play2();
                },

                attachPlayer: function () {
                    var instance = this,
                        $tpl = $(FLASH_TEMPLATE),
                        cbid = WDP.flashCallbackId(),
                        id = 'wd-flash' + WDP.uniqueId(),
                        flashvars, params, first = {};

                    $.each(instance.items, function (index, asset) {
                        if (asset.mimetype === 'video') {
                            first = instance.items[index];
                            return false;
                        }
                    });

                    flashvars = {
                        javascriptCallbackFunction: 'WDP._callbacks.' + cbid,

                        //for some reason these need to be URI encoded, but not
                        //when you're setting the source programmatically
                        src: encodeURIComponent(first.url),
                        poster: encodeURIComponent(first.poster),
                        backgroundColor: WDP.options.stage_color
                    },
                    params = {
                        allowFullScreen: 'true',
                        allowscriptaccess: 'always'
                    };

                    WDP._callbacks[cbid] = function (id, eventName, updatedProperties) {
                        if (!instance.$player) {
                            instance.$player = instance.$container.find('object');

                            // since flash needs this callback, we need to set
                            // ready on ourselves and tell the instance to load the first asset.
                            // We need to set the instance source to the first asset because
                            // what flash initialized with might not actually be the first
                            // asset (if it was an image), but rather the first _video_ asset
                            //
                            // TODO: this logic might change if it turns out that flash needs
                            // to be reembedded after every video due to the poster frame
                            // not being updateable
                            instance.setReady();
                            instance.setSource(0);
                        }

                        if (eventName === 'complete') {
                            instance.setSource(instance.current + 1)
                                && instance.getCurrentType() === 'video'
                                && instance.play();
                        }
                    };

                    $tpl.find('div.wd-flash-replace').attr('id', id);
                    instance.$container.find('.wd-stage').prepend($tpl);

                    window.swfobject.embedSWF(
                        WDP.options.pluginUrl + '/flash/StrobeMediaPlayback.swf',
                        id,
                        '100%',
                        '100%',
                        '10.1.0',
                        WDP.options.pluginUrl + '/flash/expressInstall.swf',
                        flashvars,
                        params
                    );
                }
            }
        };

    // Constructor function for a player instance. The old player couldn't manage multiple instances
    // of Wiredrive Players, so here we fix that with this Player object that knows how to manage
    // the content inside of its bounding box.
    //
    // NOTE: This is not a safe constructor (meaning if you forget to invoke this function via
    // the `new` keyword, it will modify the global scope)
    //
    // TODO: I don't remember if IE8 supports Object.create
    //  If it does, convert this to a safe constructor
    function Player(config) {
        if ($.inArray(config.type, VALID_PLAYER_TYPES) === -1) {
            console.error('WDP: unrecognized type', config.type, 'given to player', config.id);
        }

        this._READY = false;
        this._DATA_PARSED = false;
        this._HAS_VIDEO = false;
        this._HAS_IMAGE = false;

        this.$container = $('#' + config.id);
        this.id = config.id;
        this.$player = null;
        this.$image = null;
        this.items = [];
        this.type = config.type;
        this.jsonpUrl = config.jsonpUrl;
        this.current = 0;

        return this;
    }

    // Player prototype. If you don't know what this is, go learn how JavaScript works.
    Player.prototype = {
        // you really shouldn't need this property, since Player instances should be created
        // through WDP.registerPlayer, but there's no harm in piggybacking off ES5 conventions
        constructor: Player,

        getCurrentType: function () {
            return this.items[this.current].mimetype;
        },

        toggleViewer: function (type) {
            //keep in mind there might only be one player (image or video)
            //there is no assurance this instance will have both
            var $ic = this.$container.find('.wd-image-container'),
                $vc = this.$player;

            //TODO: this is ugly. Make fix.
            if (type === 'video') {
                if (this.type === 'flash') {
                    $vc && $vc.removeClass('wd-hidden-video');
                    this.$container.find('.wd-flash-container').removeClass('wd-hidden-video');
                } else {
                    $vc && $vc.removeClass('wd-hidden');
                }

                $ic.addClass('wd-hidden');
            } else {
                if (this.type === 'flash') {
                    $vc && $vc.addClass('wd-hidden-video');
                    this.$container.find('.wd-flash-container').addClass('wd-hidden-video');
                } else {
                    $vc && $vc.addClass('wd-hidden');
                }

                $ic.removeClass('wd-hidden');
            }
        },

        setSource: function (index) {
            if (index < 0 || index >= this.items.length) {
                return false;
            }

            var nextAsset = this.items[index],
                currentAsset = this.items[this.current];

            if (nextAsset.mimetype !== currentAsset.mimetype || nextAsset === currentAsset) {
                this.toggleViewer(nextAsset.mimetype);
            }

            if (nextAsset.mimetype === 'image') {
                this._setImageSource(index);
            } else {
                this._setPlayerSource(index);
            }

            this.current = index;

            return true;
        },

        attachImageViewer: function () {
            var instance = this,
                $imgContainer = $(IMAGE_TEMPLATE),
                $stage = this.$container.find('.wd-stage');

            $imgContainer.css({ 'background-color': WDP.options.stage_color });
            $stage.append($imgContainer);

            $imgContainer.css({
                height: WDP.options.height + 'px',
                width: WDP.options.width + 'px'
            });

            if (instance.items.length < 2) {
                $imgContainer.find('.next').addClass('disabled');
            }

            instance.$image = $imgContainer.find('img');

            $stage.delegate('.wd-paginate', 'click', function (e) {
                var $target = $(e.target),
                    direction, index;

                if ($target.hasClass('disabled')) {
                    return;
                }

                direction = $target.hasClass('next') ? 1 : -1;
                index = instance.current + direction;

                instance.setSource(index);
                instance.getCurrentType() === 'video' && instance.play();
            });

            !instance.hasVideo() && instance.setReady();
        },


        _setImageSource: function (index) {
            var asset = this.items[index],
                $image = this.$image,
                $next = this.$container.find('.next'),
                $previous = this.$container.find('.previous');

            $previous[index === 0 ? 'addClass' : 'removeClass']('disabled');
            $next[index === this.items.length - 1 ? 'addClass' : 'removeClass']('disabled');

            $image.attr('src', asset.url);
        },

        isReady: function () {
            return this._READY;
        },

        hasImages: function () {
            return this._HAS_IMAGE;
        },

        hasVideo: function () {
            return this._HAS_VIDEO;
        },

        // Returns a bool letting us know whether or not this instance's data
        // has been parsed and loaded
        isDataLoaded: function () {
            return this._DATA_PARSED;
        },

        setReady: function () {
            this._READY = true;
        },

        // Registers a callback and does an async script load to fetch this
        // Player's presentation data as jsonp
        fetchData: function () {
            var cbid = WDP.addCallback(this.id);
            $.getScript(this.jsonpUrl + '/callback/' + cbid);
        },

        parse: function (data) {
            var instance = this;

            // anybody else find it annoying that `$.each`'s callback argument order is
            // (`index`, `element`), but `$.map`'s order is reversed (`element`, `index`)?
            // jQuery's each doesn't conform to the native forEach signature, but map does.
            // I thought jQuery was supposed to be really good at being consistent :-/
            // Meh. It's probably a legacy thing :(
            $.each(data.list, function (index, asset) {
                var primary = asset.file.primary,
                    largeThumb = asset.file.large,
                    smallThumb = asset.file.small;

                switch (asset.mimeCategory) {
                    case 'video':
                    case 'image':
                        break;
                    default:
                        console.log('skipping', asset.mimeCategory);
                        return;
                }

                instance['_HAS_' + asset.mimeCategory.toUpperCase()] = true;

                instance.items.push({
                    title: asset.title,
                    height: primary.height,
                    width: primary.width,
                    url: primary.url,
                    mimetype: asset.mimeCategory,
                    thumbnail: smallThumb.url,
                    poster: largeThumb.url,
                    description: asset.description,
                    keywords: $.map(asset.keywords, function (item) { return item.label; }),
                    credits: $.map(asset.metadata, function (credit) {
                        return { credit: credit.label, tag: credit.tags[0].label };
                    })
                });
            });

            instance._DATA_PARSED = true;
        }
    };

    /**
     * The global object to manage all Wiredrive Player instances on this page
     */
    WDP = window.WDP = {
        // A globally accessible object to store all of the callbacks needed for
        // strobe and jsonp
        _callbacks: {},

        // Generates a key name for a callback to use for a strobe bridge request
        flashCallbackId: function () {
            return 'flash' + WDP.uniqueId();
        },

        // Generates a key name for a callback to use for a jsonp request
        jsonpCallbackId: function () {
            return 'jsonp' + WDP.uniqueId();
        },

        // Incredibly simple counter used to build unique ids
        uniqueId: function () {
            return _uid++;
        },

        // Retreive a player instance based on its id.
        // The id of a Player is the content id wordpress assigned to the shortcode
        // for this plugin. It is that same id that is assigned to the
        // container div.wd-player node's id attribute.
        getPlayer: function (playerId) {
            return _players[playerId];
        },

        // Creates a callback function to handle a Player's jsonp data request
        // and returns a string to the location of the callback function from global scope.
        //
        // Ex: `console.log(window[WDP.addCallback(playerId)]);` will log the
        //  callback function that this function creates.
        //
        // This function does not make any data requests, but sets it up so that
        // a jsonp data request can be made using the returned string path as
        // the callback querystring argument to the jsonp request
        addCallback: function (playerId) {
            var id = playerId,
                cbid = WDP.jsonpCallbackId();

            // dump the callback into the object
            this._callbacks[cbid] = function (data) {
                var player = _players[id],
                    $stage = $('#' + id + ' .wd-stage');

                player.parse(data);

                // mixin the correct player if this presentation has videos
                if (player.hasVideo()) {
                    $.extend(player, mixins[player.type]);
                    player.attachPlayer();
                }

                // bind image viewer if needed
                player.hasImages() && player.attachImageViewer();

                // flash depends on a callback, so it might not be ready yet.
                // video and image players will be ready by now, but flash will
                player.isReady() && player.setSource(0);

                // Callback is not needed anymore
                delete WDP._callbacks[cbid];
            };

            return 'WDP._callbacks.' + cbid;
        },

        // Registers a new Player instance and initializes it by triggering the request for its data
        registerPlayer: function (config) {
            var player = new Player(config);

            _players[player.id] = player;
            player.fetchData();
        },
    };
}(window.jQuery));
