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

        WDP, // our global object that will manage all player instances on the page

        /*
         * Player templates
         */
        IMAGE_TEMPLATE = [
            '<div class="wd-image-container">',
                '<img class="wd-image" />',
                '<img class="wd-image wd-next-image opaque" />',
                '<div class="wd-paginate previous-arrow disabled"></div>',
                '<div class="wd-paginate next-arrow"></div>',
            '</div>'
        ].join(''),

        FLASH_TEMPLATE = [
            '<div class="wd-flash-container">',
                '<div class="wd-flash-replace">',
                    "You don't seem to have flash.", //TODO: template
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
                    this.loop = false; //TODO hookup to config


                    $playButton = instance.$container.find('.wd-play-button'),
                    $player = instance.$container.find('video');
                    $player.attr('height', instance.height);
                    $player.attr('width', instance.width);

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
                        instance.setSource(instance.current + 1) && instance.play();
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

                _playVideo: function () {
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

                _playVideo: function () {
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

                        //these need to be uri encoded for flashvars because the
                        //flashvars value is basically a querystring, therefore
                        //if urls are not uri encoded, their querystrings will get
                        //lost in the flashvars
                        src: encodeURIComponent(first.url),
                        poster: encodeURIComponent(first.poster)
                    },
                    params = {
                        wmode: 'transparent',
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
                            instance.setSource(instance.current + 1) && instance.play();
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

    function _fitWithin(asset, maxWidth, maxHeight) {
        var ratio = 0,
            width = asset.width,
            height = asset.height,
            newHeight, newWidth;

        if (width > maxWidth) {
            ratio = maxWidth / width;
            newWidth = maxWidth;
            newHeight = height * ratio;
            height = height * ratio;
            width = width * ratio;
        }

        if (height > maxHeight) {
            ratio = maxHeight / height;
            newHeight = maxHeight;
            newWidth = width * ratio;
        }

        return {
            height: newHeight,
            width: newWidth
        };
    }

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
        this.$player = null;
        this.$image = null;

        this.height = parseInt(config.height, 10);
        this.width = parseInt(config.width, 10);
        this.slideshow = !!config.slideshow;
        this.autoplay = false; //TODO: hookup to config
        this.loop = false; //TODO hookup to config

        this.id = config.id;
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

        // Returns the mimetype of the currently selected asset (`video` or `image`)
        getCurrentType: function () {
            return this.items[this.current].mimetype;
        },

        // Swaps between the video player and the image player based on the given
        // `type` (`video` or `image`)
        toggleViewer: function (mimetype) {
            //keep in mind there might only be one player (image or video)
            //there is no assurance this instance will have both
            var $imageContainer = this.$container.find('.wd-image-container'),
                $flashContainer = this.$container.find('.wd-flash-container'),
                $video = this.$player;

            //NOTE: Flash will lose its handle on the DOM `object` element if any CSS
            //rules make the player invisible. To prevent the handle from being lost,
            //the flash player is not hidden, but rather resized to be a 1x1 pixel box,
            //which explains some of the wonky logic here. HTML5 video players don't seem
            //to have this problem and can therefore simply be hidden via `display: none;`
            //This may change if the Strobe poster image needs to change since that would
            //require a complete reembed of the strobe player whenever the video src changes
            if (mimetype === 'video') {
                this.type === 'flash' ?
                    $flashContainer.removeClass('wd-hidden-video') :
                    $video.removeClass('wd-hidden');

                $imageContainer.addClass('wd-hidden');
            } else {
                this.type === 'flash' ?
                    $flashContainer.addClass('wd-hidden-video') :
                    $video && $video.addClass('wd-hidden'); //there might not actually be a video container

                $imageContainer.removeClass('wd-hidden');
            }
        },

        // Sets the source of the player to be the asset at the given index and returns a boolean
        // letting us know whether or not it was successful (really just whether or not the index
        // supplied is valid)
        //
        // This function is responsible for figuring out the type of asset and setting
        // the source correctly, as well as toggling between video and image players
        setSource: function (index) {
            if (index < 0 || index >= this.items.length) {
                return false;
            }

            var nextAsset = this.items[index],
                currentAsset = this.items[this.current];

            // this is executed on init, when the next and current asset index is 0.
            // The second condition makes sure that an initialization pass will
            // set the player correctly for the first asset
            if (nextAsset.mimetype !== currentAsset.mimetype || nextAsset === currentAsset) {
                this.toggleViewer(nextAsset.mimetype);
            }

            if (nextAsset.mimetype === 'image') {
                this._setImageSource(index);
            } else {
                this._setPlayerSource(index);
            }

            // don't set the current index until everything else is executed, just in case
            // the called functions need to reference the current index as well as the
            // supplied index argument
            this.current = index;

            return true;
        },

        // Primary play function. Figures out what type of asset is currently loaded
        // and tells the proper player to play the asset.
        // To an image viewer, "playing" the image means slideshowing if it's enabled,
        // otherwise, play does nothing for an image
        play: function () {
            var instance = this,
                mimetype = instance.getCurrentType();

            if (mimetype === 'image' && instance.slideshow) {
                //if we're supposed to slideshow, then let us slideshow!
                setTimeout(function () {
                    //we're out of the flow, and the user may have interacted with the player
                    //to turn slideshowing off, so make sure we're supposed to still be
                    //slideshowing before we (ahem) slideshow.
                    if (instance.slideshow && instance.setSource(instance.current + 1)) {
                        instance.play();
                    }
                }, 5000); //TODO: make timeout length be configurable via admin settings
            } else if (mimetype === 'video') {
                instance._playVideo();
            }
        },

        // Render the image viewer template and bind it. The initialization procedure
        // will only execute this function if images are found in the given presentation
        attachImageViewer: function () {
            var instance = this,
                $imgContainer = $(IMAGE_TEMPLATE),
                $stage = this.$container.find('.wd-stage');

            $imgContainer.css({ 'background-color': WDP.options.stage_color });
            $stage.append($imgContainer);

            $imgContainer.css({
                height: instance.height,
                width: instance.width
            });

            // template assumes there is another asset after the first one.
            // double check just to make sure.
            if (instance.items.length < 2) {
                $imgContainer.find('.wd-paginate.next-arrow').addClass('disabled');
            }

            instance.$image = $imgContainer.find('.wd-image:not(.wd-next-image)');

            // bind a delegator for the left and right pagination arrows
            $stage.delegate('.wd-paginate', 'click', function (e) {
                var $target = $(e.target),
                    direction, index;

                if ($target.hasClass('disabled')) {
                    return;
                }

                direction = $target.hasClass('next-arrow') ? 1 : -1;
                index = instance.current + direction;

                instance.slideshow = false;
                instance.setSource(index);
                instance.play();
            });

            !instance.hasVideo() && instance.setReady();
        },
        //
        // function to set the image to the asset at the given index.
        // This is one of those "private" helper functions that is called by
        // `setSource`. Because of this, this function does not validate whether the
        // index is valid or is even an image. It assumes that `setSource` already figured
        // that out.
        _setImageSource: function (index) {
            var nextAsset = this.items[index],
                currentAsset = this.items[this.current],
                dimensions = _fitWithin(nextAsset, this.width, this.height),

                $image = this.$image,
                $nextImage = this.$container.find('.wd-image.wd-next-image'),
                $next = this.$container.find('.wd-paginate.next-arrow'),
                $previous = this.$container.find('.previous-arrow');

            $previous[index === 0 ? 'addClass' : 'removeClass']('disabled');
            $next[index === this.items.length - 1 ? 'addClass' : 'removeClass']('disabled');

            if (currentAsset.mimetype === 'image'
                    && currentAsset.mimetype === nextAsset.mimetype
                    && currentAsset !== nextAsset) {

                //going from image to image, so transition them.
                $image.addClass('opaque wd-next-image');
                $image = this.$image = $nextImage;
            }

            //do some wonky css hacky positioning because IE8 doesn't understand background-size
            //When IE8 isn't supported anymore, this hackyness can go away and be replaced with
            //proper css
            $image.css({
                height: dimensions.height,
                width: dimensions.width,
                'margin-left': Math.round((this.width - dimensions.width) / 2),
                'margin-top': Math.round((this.height - dimensions.height) / 2)
            });

            $image.removeClass('opaque wd-next-image').attr('src', nextAsset.url);
        },

        // Returns a booleaning telling us if this player instance is fully initialized
        // and all the players/plugins are loaded
        isReady: function () {
            return this._READY;
        },

        // Returns a boolean telling us whether or not this presentation has any images in it
        hasImages: function () {
            return this._HAS_IMAGE;
        },

        // Returns a boolean telling us whether or not this presentation has any videos in it
        hasVideo: function () {
            return this._HAS_VIDEO;
        },

        // Returns a bool letting us know whether or not this instance's data
        // has been parsed and loaded
        // TODO: can this go away? It's not currently used, but might come in handy later?
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
                    case 'video': break;
                    case 'image':
                        WDP.preloadImage(primary.url);
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

        preloadImage: function (url) {
            $('<img/>').get(0).src = url;
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

                if ((player.slideshow && player.getCurrentType() === 'image')
                        || (player.autoplay && player.getCurrentType() === 'video')) {
                    player.play();
                }

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
