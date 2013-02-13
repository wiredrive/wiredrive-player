//jquery is a dependency that is loaded syncronously.
(function ($) {
    "use strict";

    var console = window.console,

        FLASH_TEMPLATE = [
            '<div>',
                "You don't seem to have flash.",
            '</div>'
        ].join(''),

        VIDEO_TEMPLATE = [
            '<video class="wd-video" preload="none" x-webkit-airplay="allow"></video>',
            '<div class="wd-play-button"></div>'
        ].join(''),

        _uid = 1,
        _players = {},

        mixins = {
            video: {
                attachPlayer: function () {
                    var first = this.items[0],
                        $player,
                        $tpl = $(VIDEO_TEMPLATE);

                    this.$container.find('.wd-stage').append($tpl);

                    $player = this.$container.find('video');
                    $player.attr('height', WDP.options.height);
                    $player.attr('width', WDP.options.width);
                    $player.attr('poster', decodeURIComponent(first.poster));
                    $player.attr('src', decodeURIComponent(first.url));

                    this.$player = $player;
                    this.setReady();
                },

                setSource: function () {

                },

                play: function () {
                    this.$player.eq(0).play();
                },
            },
            flash: {
                setSource: function (index) {

                },

                play: function () {

                },

                attachPlayer: function () {
                    var instance = this,
                        first = instance.items[0],
                        
                        $player = $(FLASH_TEMPLATE),
                        id = 'wd-flash' + WDP.uniqueId(),

                        flashvars = {
                            src: first.url,
                            poster: first.poster,
                            backgroundColor: WDP.options.stage_color
                        },
                        params = {
                            allowFullScreen: 'true',
                            allowscriptaccess: 'always'
                        },
                        attributes = {};

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
                        params,
                        attributes,
                        function (e) {
                            instance.$player = instance.$container.find('object');
                            instance.setReady();
                        }
                    );
                }
            },
            image: {
                attachPlayer: function () {

                },

                setSource: function () {

                },

                play: function () {

                }
            }
        },

        WDP,

        VALID_TYPES = ['flash', 'image', 'video'];


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

        isDataLoaded: function () {
            return this._DATA_PARSED;
        },

        setSource: function (index) {
            if (index < 0 || index >= this.items.length) {
                return;
            }

            var asset = this.items[index],
                $player = this.$player,
                player = $player.eq(0);

            switch (this.type) {
                case 'image':
                    $player.attr('src', asset.url);
                    break;
                case 'video':
                    $player.attr('poster', asset.poster);
                    player.src = asset.url;
                    break;
                case 'flash':

            }
        },

        play: function () {
            var $player = this.$player,
                player = this.player;

            switch (this.type) {
                case 'image': break;
                case 'video':
                    player.load();
                    player.play();
                    break;
                case 'flash':
            }
        },

        setReady: function () {
            this._READY = true;
            this.setSource(0);
            this.$container.removeClass('loading');
        },

        fetchData: function () {
            WDP.addCallback(this.id);
            $.getScript(this.jsonpUrl + "/callback/WDP._callbacks['" + this.id + "']")
        },

        parse: function (data) {
            var instance = this;

            // anybody else find it annoying that `$.each`'s callback argument order is
            // (`index`, `element`), but `$.map`'s order is reversed (`element`, `index`)?
            // jQuery's each doesn't conform to the native forEach signature, but map does.
            // I thought jQuery was supposed to be really good at being consistent :-/
            $.each(data.list, function (index, asset) {
                var primary = asset.file.primary,
                    largeThumb = asset.file.large,
                    smallThumb = asset.file.small;

                instance.items.push({
                    title: asset.title,
                    height: primary.height,
                    width: primary.width,
                    url: encodeURIComponent(primary.url),
                    thumbnail: encodeURIComponent(smallThumb.url),
                    poster: encodeURIComponent(largeThumb.url),
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

        uniqueId: function () {
            return _uid++;
        },

        getPlayer: function (playerId) {
            return _players[playerId];
        },

        addCallback: function (playerId) {
            var id = playerId;

            this._callbacks[id] = function (data) {
                var player = _players[id],
                    $stage = $('#' + id + ' .wd-stage');

                player.parse(data);

                switch (player.type) {
                    case 'image': 
                        player.attachPlayer($stage.find('img'));
                        player.setReady();
                        break;
                    case 'video':
                        player.attachPlayer($stage.find('video'));
                        player.setReady();
                        break;
                    case 'flash':
                        player.attachPlayer();
                        break;
                    default:
                }

                delete WDP._callbacks[id];
            };
        },

        registerPlayer: function (config) {
            var player = new Player(config);

            $.extend(player, mixins[config.type]);

            _players[player.id] = player;
            player.fetchData();
        },
    };
}(window.jQuery));
