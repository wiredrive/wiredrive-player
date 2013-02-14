//jquery is the only dependency and it's loaded syncronously.
//no need for a doc.ready function
(function ($) {
    "use strict";

    var console = window.console, //just in case we're in IE8

        /*
         * Player templates
         */
        FLASH_TEMPLATE = [
            '<div>',
                "You don't seem to have flash.",
            '</div>'
        ].join(''),

        VIDEO_TEMPLATE = [
            '<video class="wd-video" preload="none" x-webkit-airplay="allow"></video>',
            '<div class="wd-play-button"></div>'
        ].join(''),

        IMAGE_TEMPLATE = [
            '<div class="wd-image-container">',
                '<div class="wd-paginate previous disabled"></div>',
                '<img class="wd-image" />',
                '<div class="wd-paginate next"></div>',
            '</div>'
        ].join(''),

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
                        $player, $playButton,
                        $tpl = $(VIDEO_TEMPLATE);

                    instance.$container.find('.wd-stage').append($tpl);

                    $playButton = instance.$container.find('.wd-play-button'),
                    $player = instance.$container.find('video');
                    $player.attr('height', WDP.options.height);
                    $player.attr('width', WDP.options.width);
                    $player.attr('poster', first.poster);
                    $player.attr('src', first.url);

                    instance.$player = $player;

                    $playButton.one('click', function (e) {
                        $(e.target).remove();
                        $player.attr('controls', 'controls');
                        $player.removeAttr('poster');
                        instance.play();
                    });

                    $player.on('ended', function (e) {
                        if (instance.setSource(++instance.current)) {
                            instance.play();
                        }
                    });

                    instance.setReady();
                },

                setSource: function (index) {
                    if (index < 0 || index >= this.items.length) {
                        return false;
                    }

                    var asset = this.items[index],
                        $player = this.$player,
                        player = $player.get(0);

                    $player.attr('src', asset.url);
                    player.load();

                    return true;
                },

                play: function () {
                    this.$player.get(0).play();
                },
            },
            flash: {
                setSource: function (index) {
                    if (index < 0 || index >= this.items.length) {
                        return false;
                    }

                    var asset = this.items[index],
                        player = this.$player.get(0);

                    player.setSrc(asset.url);
                    player.load();

                    return true;
                },

                play: function () {
                    this.$player.get(0).play2();
                },

                attachPlayer: function () {
                    var instance = this,
                        first = instance.items[0],
                        
                        $player = $(FLASH_TEMPLATE),
                        cbid = WDP.flashCallbackId(),
                        id = 'wd-flash' + WDP.uniqueId(),

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
                        }

                        if (eventName === 'complete') {
                            if (instance.setSource(++instance.current)) {
                                instance.play();
                            }
                        }
                    };

                    $player.attr('id', id);
                    instance.$container.find('.wd-stage').append($player);

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
            },
            image: {
                attachPlayer: function () {
                    var instance = this,
                        $tpl = $(IMAGE_TEMPLATE),
                        $stage = this.$container.find('.wd-stage');

                    $tpl.css({
                        height: WDP.options.height + 'px',
                        width: WDP.options.width + 'px'
                    });

                    if (instance.items.length < 2) {
                        $tpl.find('.next').addClass('disabled');
                    }

                    $stage.append($tpl);
                    instance.$player = $tpl.find('img');

                    instance.setSource(0);

                    $stage.delegate('.wd-paginate', 'click', function (e) {
                        var $target = $(e.target),
                            $reverse, direction, index;

                        if ($target.hasClass('disabled')) {
                            return;
                        }

                        if ($target.hasClass('next')) {
                            direction = 1;
                            $reverse = $stage.find('.previous');
                        } else {
                            direction = -1;
                            $reverse = $stage.find('.next');
                        }

                        index = instance.current + direction;

                        //if we're moving to the last one in a given direction, disable the button
                        if (!instance.items[index + direction]) {
                            $target.addClass('disabled');
                        }

                        $reverse.removeClass('disabled');
                        instance.setSource(index);
                    });
                },

                setSource: function (index) {
                    if (index < 0 || index >= this.items.length) {
                        return false;
                    }

                    var asset = this.items[index],
                        $player = this.$player;

                    $player.attr('src', asset.url);
                    this.current = index;

                    return true;
                },

                play: function () {

                }
            }
        },

        WDP,

        VALID_TYPES = ['flash', 'image', 'video'];

    //just so that console logs in this scope don't cause errors in IE8
    if (!console) {
        console = {};
        console.log = console.warn = console.error = function () {};
    }

    function Player(config) {
        if ($.inArray(config.type, VALID_TYPES) === -1) {
            console.warn('WDP: unrecognized type', config.type, 'given to player', config.id);
        }

        this._READY = false;
        this._DATA_PARSED = false;

        this.$container = $('#' + config.id);
        this.id = config.id;
        this.$player = null;
        this.items = [];
        this.type = config.type;
        this.jsonpUrl = config.jsonpUrl;
        this.current = 0;

        return this;
    }

    Player.prototype = {
        constructor: Player,

        isReady: function () {
            return this._READY;
        },

        isDataLoaded: function () {
            return this._DATA_PARSED;
        },

        setReady: function () {
            this._READY = true;
        },

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

                instance.items.push({
                    title: asset.title,
                    height: primary.height,
                    width: primary.width,
                    url: primary.url,
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

    WDP = window.WDP = {
        _callbacks: {},

        flashCallbackId: function () {
            return 'flash' + WDP.uniqueId();
        },

        jsonpCallbackId: function () {
            return 'jsonp' + WDP.uniqueId();
        },

        uniqueId: function () {
            return _uid++;
        },

        getPlayer: function (playerId) {
            return _players[playerId];
        },

        addCallback: function (playerId) {
            var id = playerId,
                cbid = WDP.jsonpCallbackId();

            this._callbacks[cbid] = function (data) {
                var player = _players[id],
                    $stage = $('#' + id + ' .wd-stage');

                player.parse(data);
                player.attachPlayer();

                delete WDP._callbacks[cbid];
            };

            return 'WDP._callbacks.' + cbid;
        },

        registerPlayer: function (config) {
            var player = new Player(config);

            $.extend(player, mixins[config.type]);

            _players[player.id] = player;
            player.fetchData();
        },
    };
}(window.jQuery));
