//jquery is the only dependency and it's loaded syncronously.
//no need for a doc.ready function
//This file is written with jQuery 1.7.2 as a baseline
(function ($) {
    "use strict";

        //in case we're in IE8, we're going to define a local var `console`
        //to clobber the global one inside this scope so that we can log
        //to our heart's content without IE8 complaining about its ingornace
    var console = (function () {
            var console = window.console;

            if (typeof console === 'object') {
                return console;
            }

            console = {};
            console.log = console.warn = console.error = function () {};

            return console;
        }()),

        // Function that checks whether or not the browser supports css transitions
        // and stashes the result in this scope var which we depend on for fader transitions
        // between images. If the env doesn't support css transitions, then we need
        // to do some ugly hacks. See `_noTransitionTimeoutHack` function below for
        // a better explaination
        ENV_SUPPORTS_TRANSITIONS = (function () {
            var b = document.body || document.documentElement,
                s = b.style,
                p = 'transition',
                v = ['Moz', 'Webkit', 'Khtml', '0', 'ms'];

            if (typeof s[p] === 'string') {
                return true;
            }

            p = p.charAt(0).toUpperCase() + p.substr(1);

            for (var i = 0; i < v.length; i++) {
                if (typeof s[v[i] + p] === 'string') {
                    return true;
                }
            }

            return false;
        }()),

        WDP, // our global object that will manage all player instances on the page

        // thumbnail dimensions for images inside the thumb tray.
        // you'll also need to change some css rules
        // if you futz with these numbers :-/
        CAROUSEL_THUMBNAIL_WIDTH = 60,
        CAROUSEL_THUMBNAIL_HEIGHT = 60,

        /*
         * Player templates
         */
        IMAGE_TEMPLATE = [
            '<div class="wd-image-container">',
                '<img class="wd-image" />',
                '<img class="wd-image wd-next-image opaque" />',
            '</div>'
        ].join(''),

        FLASH_TEMPLATE = [
            '<div class="wd-flash-container">',
                '<div class="wd-flash-replace">',
                    '<div>You require either an HTML5 capable browser or Adobe Flash to view this content.</div>',
                    '<div>Click an icon to install</div>',
                    '<div class="wd-install-links">',
                        '<a href="http://www.apple.com/safari/download" target="_new">',
                            '<span class="wd-install-safari"></span>',
                        '</a>',
                        '<a href="http://get.adobe.com/flashplayer" target="_new">',
                            '<span class="wd-install-flash"></span>',
                        '</a>',
                    '</div>',
                '</div>',
                '<div class="wd-poster">',
                    '<img />',
                    '<div class="wd-play-video-button"></div>',
                '</div>',
            '</div>'
        ].join(''),

        VIDEO_TEMPLATE = [
            '<div class="video-container">',
                '<video class="wd-video" preload="none" x-webkit-airplay="allow"></video>',
                '<div class="wd-play-video-button"></div>',
            '</div>'
        ].join(''),

        CAROUSEL_THUMBNAIL_TEMPLATE = [
            '<li class="wd-thumbnail">',
                '<img />',
            '</li>'
        ].join(''),

        GALLERY_THUMBNAIL_TEMPLATE = [
            '<li class="wd-thumbnail">',
                '<div class="wd-credit-tray">',
                    '<div class="wd-credit-wrapper">',
                        '<div class="wd-title"></div>',
                        '<div class="wd-tag"></div>',
                    '</div>',
                '</div>',
                '<img />',
            '</li>'
        ].join(''),

        CREDIT_TEMPLATE = [
            '<div class="wd-credit">',
                '<span class="wd-credit-label"></span>',
                '<span class="wd-tag"></span>',
            '</div>',
            '<span class="wd-credit-separator"></span>'
        ].join(''),

        EMPTY_TEMPLATE = [
            '<div class="wd-empty-presentation">',
                '<span>Wiredrive Player: No presentable assets found in presentation!</span>',
            '</div>'
        ].join(''),

        MODAL_CONTAINER_ID = 'wd-modal-player',
        MODAL_TEMPLATE = [
            '<div id="wd-skrim">',
                '<div id="' + MODAL_CONTAINER_ID + '" class="wd-player inline-player">',
                    '<div class="wd-stage">',
                        '<div class="wd-play-slideshow-button"></div>',
                    '</div>',

                    '<div class="wd-paginate previous-arrow"></div>',
                    '<div class="wd-paginate next-arrow"></div>',

                    '<div class="wd-credit-tray">',
                        '<span class="wd-title"></span>',
                    '</div>',
                '</div>',
            '</div>'
        ].join(''),

        LINEBREAK_TEMPLATE = '<li class="wd-linebreak"></li>',

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
                        $container = instance.$container,
                        first = instance.items[0],
                        isFirstVideo = first.mimetype === 'video',
                        $stage = $container.find('.wd-stage'),
                        $player, $playButton,

                        // delegate function for the paginators. To keep all the code related
                        // to the html5 play button (which is only visible if the html5 player is loaded
                        // and the first asset is a video and autoplay is off), we have a delegate function
                        // that we will bind to the paginators. This accounts for the case of where
                        // the user clicks on the pagintate button to change to the next asset without
                        // ever playing the first asset or clicking on a thumbnail
                        onceDelegate = function (e) {
                            if ($(e.target).hasClass('disabled')) {
                                return;
                            }

                            // The iPad is slow. The onceDelegate properly removes the poster attribute,
                            // but iPad safari doesn't redraw the video quickly enough. In the case where the
                            // first asset is a video, the user then switches to an image, and then switches back to
                            // a video, there will be a flash of the stale poster image from the first video before
                            // the new video loads.
                            // This little hack forces a redraw for whatever the nebulus reasons may be
                            // http://stackoverflow.com/questions/3485365/how-can-i-force-webkit-to-redraw-repaint-to-propagate-style-changes
                            if (instance.isMobile) {
                                $player.css('display', 'none');
                                $player.get(0).offsetHeight;
                                $player.css('display', 'block');
                            }

                            $playButton.remove();
                            $player.removeAttr('poster');
                            $player.attr('controls', 'controls');
                            $container.off('touch click', '.wd-paginate', onceDelegate);
                            $container.off('touch click', '.wd-thumbnail img', onceDelegate);
                        },
                        $tpl = $(VIDEO_TEMPLATE);

                    $stage.prepend($tpl);

                    $playButton = $container.find('.wd-play-video-button'),
                    $player = $container.find('video');

                    // only show the poster image if the first asset is a video
                    // and we're not in a modal (modal will autoplay once opened, so
                    // no use for poster)
                    if (isFirstVideo && !instance.isModal() && !instance.autoplay) {
                        $player.attr('poster', first.poster);

                        $container.on('touch click', '.wd-paginate', onceDelegate);
                        $container.on('touch click', '.wd-thumbnail img', onceDelegate);
                        $playButton.one('click', function (e) {
                            onceDelegate(e);

                            $player.attr('src', first.url);
                            $player.get(0).load();

                            //the once delegator doesn't need to explicitly call `play` because
                            //that will be handled by the normal event handlers on the paginators
                            //that call `setSource`. Since the delegator doesn't, here we need
                            //the explicit call to `play`
                            instance.play();
                        });
                    } else {
                        $playButton.remove();
                        $player.attr('controls', 'controls');
                        $player.attr('src', instance.items[instance.current].url);
                        $player.get(0).load();
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

                _pauseVideo: function () {
                    this.$player.get(0).pause();
                },

                _playVideo: function (bindOnceCanPlay) {
                    var $player = this.$player,
                        player = $player.get(0),
                        iPadHackFn = function () {
                            $player.load();
                            player.play();
                        },
                        iPadInterval;

                    if (bindOnceCanPlay) {
                        //it seems that iPad's still have some issues playing the first video
                        //asset. Even with a canplay listener, when the first video is
                        //loaded, it simply waits to recieve data but never actually recieves data.
                        //It just sits there indefinitely. The fix is hacky (as always for iPad).
                        // Delay the actual call to reload and play the video, and just keep trying
                        // every two seconds until the video actually plays.
                        // If you know of a way to get the iPad to cooperate, submit a pull request.
                        $player.one('canplay', function (e) {
                            clearInterval(iPadInterval);
                        });

                        setTimeout(function () {
                            iPadInterval = setInterval(iPadHackFn, 2000);
                            iPadHackFn();
                        }, 100);
                    }

                    player.play();
                },
            },
            flash: {
                _setPlayerSource: function (index) {
                    if (!this.isReady()) {
                        return;
                    }

                    var asset = this.items[index],
                        player = this.$player.get(0);

                    player.setSrc(asset.url);
                    player.load();
                },

                _pauseVideo: function () {
                    if (this.isReady()) {
                        try {
                            this.$player.get(0).pause();
                        } catch (e) {
                            console.warn('WiredrivePlayer: NPObject error pausing flash video');
                        }
                    }
                },

                _playVideo: function () {
                    this.isReady() && this.$player.get(0).play2();
                },

                attachPlayer: function () {
                    var instance = this,
                        $container = instance.$container,
                        $tpl = $(FLASH_TEMPLATE),
                        $poster = $tpl.find('.wd-poster'),
                        $img = $poster.find('img'),
                        $playButton = $poster.find('.wd-play-video-button'),

                        cbid = WDP.flashCallbackId(),
                        id = 'wd-flash' + WDP.uniqueId(),

                        first = instance.items[0],
                        isFirstVideo = first.mimetype === 'video',
                        dimensions = _fitWithin(first, instance.width, instance.height),

                        onceDelegate = function (e) {
                            if ($(e.target).hasClass('disabled')) {
                                return;
                            }

                            $poster.remove();
                            $container.off('click', '.wd-paginate', onceDelegate);
                            $container.off('click', '.wd-thumbnail img', onceDelegate);
                        },

                        flashvars, params;

                    flashvars = {
                        javascriptCallbackFunction: 'WDP._callbacks.' + cbid,

                        //these need to be uri encoded for flashvars because the
                        //flashvars value is basically a querystring, therefore
                        //if urls are not uri encoded, their querystrings will get
                        //lost in the flashvars
                        src: encodeURIComponent(first.url),
                        playButtonOverlay: false
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
                            instance.setReady();
                            instance.setSource(instance.current);

                            if ((instance.getCurrentType() === 'video' && instance.autoplay)
                                    || instance.id === MODAL_CONTAINER_ID) {
                                instance.play();
                            }
                        }

                        if (eventName === 'complete') {
                            instance.setSource(instance.current + 1) && instance.play();
                        }
                    };

                    $tpl.find('div.wd-flash-replace').attr('id', id);
                    instance.$container.find('.wd-stage').prepend($tpl);

                    // figure out of we need to show a poster or not
                    if (isFirstVideo && !instance.isModal() && !instance.autoplay) {
                        $container.on('click', '.wd-paginate', onceDelegate);
                        $container.on('click', '.wd-thumbnail img', onceDelegate);
                        $playButton.one('click', function (e) {
                            onceDelegate(e);
                            instance.play();
                        });

                        $poster.css({
                            width: instance.width,
                            height: instance.height
                        });

                        $img.attr('src', first.poster)
                            .css({
                                width: dimensions.width,
                                height: dimensions.height,
                                'margin-top': (instance.height - dimensions.height) / 2
                            });
                    } else {
                        $poster.remove();
                    }


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

    /**
     * Hello. This is an ugly hack. Here's what it does:
     * If the player is transitioned from an image to another image, the DOM is structured
     * so that two image elements are positioned over each other, the new source is set
     * on the second image node, the new node fades in and the old node fades out
     * via a CSS3 opacity transition. If the browser does not support CSS3 transitions,
     * then there will be no fade. Worse yet, if the redraw is lagging, then you may sometimes
     * see an even older image (the image that was exchanged prior to this swap operation)
     * for a split second or two before the browser catches up and renders
     * the new image source. To prevent this, an "immediate" timeout is called that removes the source
     * attribute completely before the old image fades out.
     *
     * This way if the browser is lagging on changing the source for the new image, the old image
     * simply goes away and we see the background stage until the new image is loaded, rather than
     * a stale image that is neither of the images involved in this transition.
     *
     * Yes, this is ugly, but I'd rather the player be written to utilize CSS3 with an ugly hack
     * that can easily be removed later (just remove the conditional in `_setImageSource` that calls
     * this function) than write it where these ugly hacks are central to its workflow
     */
    function _noTransitionTimeoutHack($image) {
        setTimeout(function () {
            $image.removeAttr('src');
        }, 1);
    }

    function _fitWithin(obj, maxWidth, maxHeight, fillHeight) {
        var ratio = 0,
            width = obj.width,
            height = obj.height,
            newHeight = height,
            newWidth = width;

        if (!fillHeight && width > maxWidth) {
            ratio = maxWidth / width;
            newWidth = maxWidth;
            newHeight = height * ratio;
            height = height * ratio;
            width = width * ratio;
        }

        if (fillHeight || height > maxHeight) {
            ratio = maxHeight / height;
            newHeight = maxHeight;
            newWidth = width * ratio;
        }

        return {
            height: Math.round(newHeight),
            width: Math.round(newWidth)
        };
    }

    function _calculateWidth($node) {
        return $node.get(0).offsetWidth +
            parseInt($node.css('margin-left'), 10) +
            parseInt($node.css('margin-right'), 10) +

            // IE8 is too stupid to understand border-<side>-width as a number.
            // Fallback to 0 for these values
            (parseInt($node.css('border-left-width'), 10) || 0) +
            (parseInt($node.css('border-right-width'), 10) || 0);
    }

    // Constructor function for a player instance. The old player couldn't manage multiple instances
    // of Wiredrive Players, so here we fix that with this Player object that knows how to manage
    // the content inside of its bounding box.
    //
    // NOTE: This is not a safe constructor (meaning if you forget to invoke this function via
    // the `new` keyword, it will modify the global scope)
    function Player(config) {
        var $container,
            test = document.createElement('video'),
            $stage;

        //see if we can play html5 video somewhat reliably.
        //Don't bother checking for ogg or webm. The majority of WD clients appear to use mp4
        if (!!test.canPlayType && test.canPlayType('video/mp4; codecs="avc1.42E01E"').replace(/^no$/, '') === 'probably') {
            this.type = 'video';
        } else {
            this.type = 'flash';
        }

        //detect IE9 and force it to use flash. It still is glitchy with h264,
        //even though it passes the above test
        if (document.documentMode === 9) {
            this.type = 'flash';
        }

        //do some ua sniffing to see if we're on an iOS device.
        //TODO: probably better to use a media query to put a class on the container
        //that tells us we're on mobile.
        this.isMobile = navigator.userAgent.match(/iPad/i) != null
            || navigator.userAgent.match(/iPhone/i) != null
            || navigator.userAgent.match(/iPod/i) != null;

        this._READY = false;
        this._HAS_VIDEO = false;
        this._HAS_IMAGE = false;
        this.$container = $container = $('#' + config.id);

        this.$player = null;
        this.$image = null;

        $stage = $container.find('.wd-stage');

        this.theme = config.theme;
        this.galleryThumbWidth = parseInt(config.galleryThumbWidth, 10);
        this.galleryThumbHeight = parseInt(config.galleryThumbHeight, 10);
        this.linebreak = +config.linebreak;
        this.creditCount = +config.creditCount;
        this.showCreditLabel = !!config.showCreditLabel;

        this.height = parseInt(config.height, 10);
        this.width = parseInt(config.width, 10);
        this.slideshow = !!config.slideshow;
        this.duration = +config.duration;
        this.autoplay = !!config.autoplay;
        this.loop = !!config.loop;

        // Crop mode doesn't work in IE8 (but it does in emulated IE8...)
        // Rather than do UA sniffing, just check for a feature that IE8 sorely lacks
        // to see if we should force scale mode. Sure, this means that any browser that
        // doesn't have indexOf defined on Array gets grouped in with IE8, but
        // if you're a browser that doesn't know what indexOf is by now, you're no
        // better than IE8
        this.thumbfit = typeof Array.prototype.indexOf === 'undefined' ?
            'scale' : config.thumbfit;

        this.id = config.id;
        this.items = [];
        this.jsonpUrl = config.jsonpUrl;
        this.current = 0;

        //make DOM changes based on config
        if (this.slideshow) {
            this.$container.find('.wd-stage').addClass('slideshow');
        }

        $container.addClass(this.theme);
        $container.attr('id', this.id);

        if (this.theme === 'inline-player' && !this.isModal()) {
            $container.css({ width: this.width });
            $stage.css({ height: this.height });
        }

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

        // remove this player from the DOM completely
        destroy: function () {
            this.pause();
            this.$container.remove();
        },

        // is this player the modal player?
        isModal: function () {
            return this.id === MODAL_CONTAINER_ID;
        },

        // Swaps between the video player and the image player based on the given
        // `type` (`video` or `image`)
        toggleViewer: function (mimetype) {
            //keep in mind there might only be one player (image or video)
            //there is no assurance this instance will have both
            var $imageContainer = this.$container.find('.wd-image-container'),
                $flashContainer = this.$container.find('.wd-flash-container'),
                $videoContainer = this.$player && this.$player.parent('.video-container'),
                $stage = this.$container.find('.wd-stage');

            //NOTE: Flash will lose its handle on the DOM `object` element if any CSS
            //rules make the player invisible. To prevent the handle from being lost,
            //the flash player is not hidden, but rather resized to be a 1x1 pixel box,
            //which explains some of the wonky logic here. HTML5 video players don't seem
            //to have this problem and can therefore simply be hidden via `display: none;`
            //
            //ADDITIONAL NOTE: It used to be that only flash had this problem, but then along came
            //the iPad, where it has trouble playing a video if the video was hidden (well, maybe not
            //hidden, but the browser didn't redraw fast enough to unhide the element, even though at the
            //time of the load call, it's not hidden in the DOM tree. Hooray laggy redraw!) when the load
            //request came in. The easy fix was to apply the flash strategy to html5 video, all
            //thanks to the wonderful wonderful ipad.
            if (mimetype === 'video') {
                this.type === 'flash' ?
                    $flashContainer.css({ width: '100%', height: '100%' }).removeClass('wd-hidden-flash') :
                    $videoContainer.css({ width: '100%', height: '100%' }).removeClass('wd-hidden-flash');

                $imageContainer.addClass('wd-hidden');
                $stage.removeClass('image').addClass('video');
            } else {
                //prevent video from potentially playing in the background
                //check for the current asset being a video first, otherwise slideshowing
                //could unintentionally be stopped before it starts
                this.getCurrentType() === 'video' && this.pause();
                
                if (this.type === 'flash') {
                    //override any inline dimension styles that may be on the flash container
                    $flashContainer.css({ width: 1, height: 1 }).addClass('wd-hidden-flash');
                } else {
                    //if there is a video container, hide it
                    $videoContainer && $videoContainer.css({ width: 1, height: 1 }).addClass('wd-hidden-flash');
                }

                $imageContainer.removeClass('wd-hidden');
                $stage.removeClass('video').addClass('image');
            }
        },

        setCredit: function (asset) {
            var instance = this,
                $title = this.$container.find('.wd-title'),
                title = asset.title,
                iterator = function (index, credit) {
                    if (index >= instance.creditCount) {
                        return false;
                    }

                    var $credit = $(CREDIT_TEMPLATE);

                    if (instance.showCreditLabel) {
                        $credit.find('.wd-credit-label').text(credit.credit);
                    } else {
                        $credit.find('.wd-credit-label').remove();
                    }

                    $credit.find('.wd-tag').text(credit.tag);
                    $credit.insertAfter($title);
                };

            //remove the old credits
            this.$container.find('.wd-credit, .wd-credit-separator').remove();
            $title.text(title); //set the title
            
            if (this.theme === 'inline-player') {
                $.each(asset.credits, iterator);
            } else if (asset.credits.length) {
                iterator(0, asset.credits[0]);
            }

            //remove the trailing comma (I wish IE8 didn't suck at pseudo selectors)
            this.$container.find('.wd-credit-separator').last().remove();
        },

        // Sets the source of the player to be the asset at the given index and returns a boolean
        // letting us know whether or not it was successful (really just whether or not the index
        // supplied is valid)
        //
        // This function is responsible for figuring out the type of asset and setting
        // the source correctly, as well as toggling between video and image players
        setSource: function (index) {
            if (index < 0) {
                if (!this.loop) {
                    return false;
                }
                    
                index = this.items.length - 1;
            } else if (index >= this.items.length) {
                if (!this.loop) {
                    return false;
                }

                index = 0;
            }

            var nextAsset = this.items[index],
                currentAsset = this.items[this.current],
                $next = this.$container.find('.wd-paginate.next-arrow'),
                $previous = this.$container.find('.previous-arrow');

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

            this.setCredit(nextAsset);

            //if there is a carousel, tell it to scroll to make the currently selected asset visible
            this.scrollTo && this.scrollTo(index);

            if (!this.loop) {
                $previous[index === 0 ? 'addClass' : 'removeClass']('disabled');
                $next[index === this.items.length - 1 ? 'addClass' : 'removeClass']('disabled');
            }

            // update the thumbnail selection
            // do current first, since initially both index and current are 0
            this.$container.find('li[data-wd-index=' + this.current + '] img').removeClass('selected');
            this.$container.find('li[data-wd-index=' + index + '] img').addClass('selected');

            // don't set the current index until everything else is executed, just in case
            // the called functions need to reference the current index as well as the
            // supplied index argument
            this.current = index;
            this.resize();

            return true;
        },

        pause: function () {
            if (this.getCurrentType() === 'video') {
                this._pauseVideo();
            } else {
                this.slideshow = false;
                this.$container.find('.wd-play-slideshow-button').removeClass('playing');
                this.clearTimeout();
            }
        },

        // Clear the slideshow timeout
        clearTimeout: function () {
            clearTimeout(this.timeoutId);
            this.timeoutId = null;
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
                instance.$container.find('.wd-play-slideshow-button').addClass('playing');

                // make sure a timeout isn't already ticking
                !instance.timeoutId && (instance.timeoutId = setTimeout(function () {
                    instance.clearTimeout();

                    //we're out of the flow, and the user may have interacted with the player
                    //to turn slideshowing off, so make sure we're supposed to still be
                    //slideshowing before we (ahem) slideshow.
                    if (instance.slideshow && instance.setSource(instance.current + 1)) {
                        instance.play();
                    } else {
                        instance.pause();
                    }
                }, instance.duration * 1000));
            } else if (mimetype === 'video') {
                // This case may exist on slower desktops, but iPad seems to consitently have
                // a problem playing videos when the load call doesn't load fast enough.
                // If we're on a mobile device, tell playVideo to bind a once event on canstart
                // that assures the video will start playing eventually, even if not right away
                instance._playVideo(instance.isMobile);
            }
        },

        bind: function () {
            var instance = this,
                $container = instance.$container,
                iPadHack = false; //have we executed our ipad hack already?

            // bind the paginators
            if (instance.items.length > 1) {
                $container.on('click', '.wd-paginate', function (e) {
                    var $target = $(e.target),
                        direction, index;

                    if ($target.hasClass('disabled')) {
                        return;
                    }

                    direction = $target.hasClass('next-arrow') ? 1 : -1;
                    index = instance.current + direction;

                    instance.pause();
                    instance.setSource(index);
                    instance.play();
                });
            } else {
                $container.find('.wd-paginate').addClass('wd-hidden');
            }

            // bind clicking on the slideshow play button
            $container.find('.wd-play-slideshow-button').on('click', function (e) {
                var $target = $(e.target);

                if (!$target.hasClass('playing')) {
                    // going to play
                    $target.addClass('playing');
                    instance.slideshow = true;
                    instance.play();

                    // iPad does not support autoplay. This also means that you can not
                    // programatically trigger an html5 video to start playing unless said
                    // code comes from an execution stack that started with a user interaction event
                    // (click, touch, etc).
                    // In the case where we have an autoslideshow on a presentation containing both
                    // images and videos where the first asset is an image: If the user presses the
                    // slideshow play button, when it autoslideshows to the next asset that is a video,
                    // the play command came from a timeout, which is not user interaction, therefore
                    // the video will not start playing. This hack says that if we're on mobile,
                    // then the first time the slideshow play button is clicked, play the hidden video and immediately
                    // pause it. This frees the video from not autoplaying since we technically already
                    // started playing it via a user event. The subsequent timeouts from an image slideshow
                    // can now start playing the video. This is kind of a dirty hack, but so is iPad HTML5
                    // video support (Gee, if only we could use the flash player on the ipad...).
                    // This only needs to happen here and only needs to happen once. Any other way of
                    // getting to the first video involes an execution path that begins with an interaction
                    // event, so the hack is not needed
                    if (instance.isMobile && !iPadHack) {
                        iPadHack = true;
                        instance._playVideo(); //make sure NOT to pass a truthy argument here!!!
                        instance.pause();
                    }
                } else {
                    // going to pause
                    instance.pause();
                }
            });
        },

        //function to render out the gallery of thumbnails
        attachGallery: function () {
            var instance = this,
                isLetterbox = !!instance.$container.find('.wd-thumb-tray.letterbox').size(),
                isScale = instance.thumbfit === 'scale',
                $ol = instance.$container.find('.wd-carousel');

            //loop through each asset and build the thumbnail template
            $.each(this.items, function (index, asset) {
                var $thumb = $(GALLERY_THUMBNAIL_TEMPLATE),
                    $img = $thumb.find('img'),
                    thumb = asset.thumbnail,

                    dimensions = _fitWithin(thumb, instance.galleryThumbWidth, instance.galleryThumbHeight);

                //set image dimensions
                $thumb.addClass(instance.thumbfit);
                $img.attr('src', thumb.url)
                    .css({
                        height: dimensions.height,
                        width: dimensions.width
                    });

                // The three if statements below apply css to account for the following
                //  conditions, depending on the configuration of this gallery player:
                //
                // scale without letterboxing: collapse li borders around the scaled image 
                // scale with    letterboxing: scale image, vertical align to li via margin-top
                // crop  without letterboxing: background-image on li. no li border collapse
                // crop  with    letterboxing: background-image on li. no li border collapse

                if (instance.thumbfit === 'crop') {
                    // set as background image. let css do our cropping for us
                    $thumb.css('background-image', 'url(' + thumb.url + ')');
                }

                if (isLetterbox && instance.thumbfit === 'scale') {
                    //offset the image to be vertically centered
                    $img.css({
                        'margin-top': (instance.galleryThumbHeight - dimensions.height) / 2
                    });
                }

                if (!isLetterbox && instance.thumbfit === 'scale') {
                    //collapse the dimensions of the container to fit the image
                    $thumb.css({
                        height: dimensions.height,
                        width: dimensions.width
                    });
                } else {
                    //force the dimensions of the container
                    $thumb.css({
                        width: instance.galleryThumbWidth,
                        height: instance.galleryThumbHeight
                    });
                }

                //so we know which asset this thumbnail indexes
                $thumb.attr('data-wd-index', index);
                $thumb.find('.wd-title').text(asset.title);

                if (instance.creditCount > 0 && asset.credits[0]) {
                    $thumb.find('.wd-tag').text(asset.credits[0].tag);
                }

                $ol.append($thumb);

                //is it time to insert a linebreak?
                //(The +1 is because normal people don't start counting at 0)
                if ((index + 1) % instance.linebreak === 0) {
                    $ol.append($(LINEBREAK_TEMPLATE));
                }
            });

            instance.$container.on('touchstart click', '.wd-thumbnail', function (e) {
                var index = +$(e.currentTarget).attr('data-wd-index');

                instance.current = index;
                WDP.showModal(instance);
            });
        },

        // function to render all the thumbnails into the thumbnail tray (if there is one)
        // and bind the carouseling functionality.
        // This function is a bit monolithic, but it keeps all the logic for carouseling in one place
        attachCarousel: function () {
            var instance = this,
                $container = instance.$container,

                $ol = $container.find('.wd-carousel'),
                $bb = $container.find('.wd-carousel-bb'),
                $next = $container.find('.wd-carousel-button.next'),
                $previous = $container.find('.wd-carousel-button.previous'),
                $thumbTray = $container.find('.wd-thumb-tray'),
                $creditTray = $container.find('.wd-credit-tray'),

                contentWidth = 0, //the width of all the thumbnails bounding boxes added together

                // the carousel determines how far to scroll based on "markers", which is really
                // just the index of the thumbnail it is using as its scroll destination. When a thumbnail
                // is used as a marker, it basically means that after the scrolling is finished, the marker
                // thumbnail will be either the leftmost or rightmost thumbnail and will be completely visible.
                markerLeft = true, //is the marker on the left or on the right?
                markerIndex = 0, //what is the marker index?
                marginLeft = 0, //the overall margin-left that is applied to the ol to cause scrolling
                lastMarginLeft = 0, //a cache of the previous value of margin-left
                viewportWidth, //the width of the carousel mask (the area with visible thumbnails)
                cache = [], // a cache of objects to store width and position calculations of each thumbnail

                updateButtonStates = function () {
                    $next.removeClass('disabled');
                    $previous.removeClass('disabled');

                    if (markerIndex === 0) {
                        //very beginning. disable previous button
                        $previous.addClass('disabled');
                    } else if (markerIndex === cache.length - 1) {
                        //very end. disable next button
                        $next.addClass('disabled');
                    }
                },

                //function for scrolling through the carousel backwards
                //(marginleft increases from negative towards zero)
                //TODO: there's probably a smart way to have next and previous scrolling
                //taken care of by the same function
                scrollPrevious = function () {
                    var total; //the total amount we will be mutating marginLeft by

                    // if the marker is already the leftmost asset, ignore
                    if (markerIndex === 0) {
                        return;
                    }

                    if (markerLeft) {
                        //if the marker is on the left, act like there is a full page to scroll through
                        markerIndex--; //the new marker will be on the right
                        total = viewportWidth; //total difference will be the viewport's width
                    } else {
                        //the marker is on the right
                        for (total = 0;
                             //iterate as long as the marker is not the first asset and the number
                             //of iterated assets to the left have a total width less than the viewport
                             markerIndex > 0 && total + cache[markerIndex].width < viewportWidth;
                             markerIndex--) {

                            total += cache[markerIndex].width;
                        }
                    }

                    if (marginLeft + viewportWidth > 0) {
                        //there isn't a full page to scroll through. We're going backwards, so just reset
                        //the margins to 0 and set the marker to be the first asset
                        markerIndex = 0;
                        marginLeft = 0;
                        markerLeft = true;
                    } else {
                        //there is a full page worth of content, so the new marker will be on the right
                        marginLeft += total;
                        markerLeft = false;
                    }

                    $ol.css({ 'margin-left': marginLeft });
                    lastMarginLeft = marginLeft;

                    updateButtonStates();
                },

                // function for scrolling through the carousel forwards
                // (marginleft decreases from 0 towards negative content width)
                scrollNext = function () {
                    var total;

                    // if the marker is already the last asset, ignore
                    if (markerIndex === cache.length - 1) {
                        return;
                    }

                    if (!markerLeft) {
                        //marker is on the right. if there is a full page of content, the marker
                        //will end of on the left.
                        markerIndex++;
                        total = viewportWidth;
                    } else {
                        //marker is on the left, so find out how many thumnails we need to scroll to
                        for (total = 0;
                             markerIndex !== cache.length && total + cache[markerIndex].width < viewportWidth;
                             markerIndex++) {

                            total += cache[markerIndex].width;
                        }
                    }

                    if (Math.abs(marginLeft) + viewportWidth * 2 > contentWidth) {
                        //there isn't enough content for a full page scroll, so just scroll
                        //to the very end
                        markerIndex = cache.length - 1;
                        marginLeft = -(contentWidth - viewportWidth);
                        markerLeft = false;
                    } else {
                        //full page scroll. marker ends up on the left
                        marginLeft -= total;
                        markerLeft = true;
                    }

                    $ol.css({ 'margin-left': marginLeft });
                    lastMarginLeft = marginLeft;

                    updateButtonStates();
                };


            // there is no container for the thumb tray, so it must be disabled
            if (!$ol.size()) {
                return;
            }

            //the initial viewport width does NOT include the pagination buttons. This is so we can
            //truely see if there is enough space to fit all thumbnails so that there is no need for
            //pagination
            viewportWidth = parseInt($thumbTray.css('width'), 10);

            //loop through each asset and build the thumbnail template, as well as calculate the positions
            //and offsets to save onto the cache
            $.each(this.items, function (index, asset) {
                var $thumb = $(CAROUSEL_THUMBNAIL_TEMPLATE),
                    $img = $thumb.find('img'),
                    thumb = asset.thumbnail,

                    //we want all thumbnails to be vertically flush. The `true` arg
                    //forces _fitWithin to only scale the height.
                    //This also means that if you have an image with a very large width
                    //but a relatively small height, the thumbnail will be scaled by height, meaning
                    //the thumbnail will be VERY VERY wide. It might even take up the entire viewport
                    //and then some. It was decided that this is probably an edge case for the types
                    //of assets most (if not all) users will populate this player with, so it is considered
                    //an acceptable edge case.
                    dimensions = _fitWithin(thumb, CAROUSEL_THUMBNAIL_WIDTH, CAROUSEL_THUMBNAIL_HEIGHT, true);

                //set image dimensions
                $img.attr('src', thumb.url)
                    .css({
                        height: dimensions.height,
                        width: dimensions.width
                    });

                //the only reason the li container $thumb needs to have an explicit width set is
                //because of IE8. Every other browser has no problem figuring out the size of the li
                //based on the explicit width set on the contained image. IE8 wanted to be different #RAGE
                $thumb.css('width', dimensions.width);

                //so we know which asset this thumbnail indexes
                $thumb.attr('data-wd-index', index);
                $ol.append($thumb);

                cache.push({
                    $node: $thumb,
                    width: _calculateWidth($thumb),
                    previousTotal: contentWidth 
                });

                contentWidth += cache[index].width;
                cache[index].runningTotal = contentWidth;
            });

            // originally used white-space: nowrap to keep all the thumbnails in line,
            // but IE is too stupid to know what that rule means unless it's on a span.
            // Since we already know what the width of all the content is, just set an
            // explicit width on the ol container and be done with it :-/
            // The pre-incrementer accounts for some sizing rounding errors that appears to consistently
            // undershoot the width by a single pixel, causing the last thumbnail's right border
            // to fall off.
            $ol.css('width', ++contentWidth);

            //check to see if we need to worry about pagination
            if (viewportWidth > contentWidth) {
                //nope! hooray!
                $thumbTray.addClass('no-paginate');
            } else {
                //pagination required. not all assets will be visible given the viewport area.
                //adjust the viewport width to account for the pagination buttons
                viewportWidth = parseInt($bb.css('width'), 10);

                //bind delegators for clicking on the next and previous pagination buttons.
                $thumbTray.on('click', '.wd-carousel-button', function (e) {
                    var $target = $(e.currentTarget);

                    if ($target.hasClass('disabled')) {
                        return;
                    }

                    if ($target.hasClass('next')) {
                        scrollNext();
                    } else {
                        scrollPrevious();
                    }
                });
            }

            // bind clicking on a thumbnail in the thumbnail tray
            $thumbTray.on('touch click', '.wd-thumbnail img', function (e) {
                var $li = $(e.target).parent('li'),
                    index = +$li.attr('data-wd-index');

                instance.pause();
                instance.setSource(index);
                instance.play();
            });

            // bind mouse hovers to display credits
            $thumbTray.on('mouseenter mouseleave', '.wd-thumbnail img', function (e) {
                var index;
                
                if (e.type === 'mouseenter') {
                    index = +$(e.target).parent('li').attr('data-wd-index');
                    instance.setCredit(instance.items[index]);
                } else {
                    instance.setCredit(instance.items[instance.current]);
                }
            });

            $creditTray.on('click', '.wd-thumb-collapse', function (e) {
                var $icon = $(this).find('.wd-triangle');

                if ($thumbTray.hasClass('collapsed')) {
                    $thumbTray.removeClass('collapsed');
                    $icon.removeClass('down').addClass('up');
                } else {
                    $thumbTray.addClass('collapsed');
                    $icon.removeClass('up').addClass('down');
                }
            });

            //attach the carouseling functions to this instance
            instance.scrollNext = scrollNext;
            instance.scrollPrevious = scrollPrevious;

            //attach a function that will tell the carousel to scroll to a position that makes
            //the specified index visible
            instance.scrollTo = function (index) {
                var startdiff = cache[index].previousTotal + marginLeft,
                    enddiff = cache[index].runningTotal + marginLeft,
                    op, pages;

                if (startdiff < 0) {
                    op = 'scrollPrevious';
                    pages = Math.abs(Math.floor(startdiff / viewportWidth));
                } else if (enddiff > viewportWidth) {
                    op = 'scrollNext';
                    pages = Math.floor(enddiff / viewportWidth);
                }

                if (op) {
                    for (var i = 0; i < pages; i++) {
                        this[op]();
                    }
                }
            }
        },

        // Render the image viewer template and bind it. The initialization procedure
        // will only execute this function if images are found in the given presentation
        attachImageViewer: function () {
            var instance = this,
                $imgContainer = $(IMAGE_TEMPLATE),
                css = {},
                $stage = this.$container.find('.wd-stage');

            $stage.prepend($imgContainer);

            if (this.isModal()) {
                css['background-color'] = 'transparent';
            } else {
                css['background-color'] = WDP.options.stage_color;
                css.height = instance.height;
                css.width = instance.width;
            }

            $imgContainer.css(css);
            instance.$image = $imgContainer.find('.wd-image:not(.wd-next-image)');
            !instance.hasVideo() && instance.setReady();
        },

        // function to set the image to the asset at the given index.
        // This is one of those "private" helper functions that is called by
        // `setSource`. Because of this, this function does not validate whether the
        // index is valid or is even an image. It assumes that `setSource` already figured
        // that out.
        _setImageSource: function (index) {
            var nextAsset = this.items[index],
                currentAsset = this.items[this.current],
                $stage = this.$container.find('.wd-stage').css('margin-top', 0),
                dimensions = _fitWithin(nextAsset, $stage.width(), $stage.height()),

                $image = this.$image,
                $nextImage = this.$container.find('.wd-image.wd-next-image');

            if (currentAsset.mimetype === 'image'
                    && currentAsset.mimetype === nextAsset.mimetype
                    && currentAsset !== nextAsset) {

                //going from image to image, so transition them.
                $image.addClass('opaque wd-next-image');

                // If the browser does not support css transitions, then we're probably in either IE8 or IE9
                // and we need to do some hacks to make things not look weird.
                // See the `_noTransitionTimeoutHack` function above for a better explaination
                if (!ENV_SUPPORTS_TRANSITIONS) {
                    _noTransitionTimeoutHack($image);
                }

                $image = this.$image = $nextImage;
            } else if (currentAsset === nextAsset) {
                //Fix for Firefox: When the image viewer is first initialized, originally the next-image img
                //element did not have a source. Firefox has a bug where it cannot do a CSS3 transition from
                //opacity 0 to 1 on an image with no source. This fix sets both the image and the next image
                //to be the same image if this is the initialization pass (current and index are equal)
                $nextImage.attr('src', nextAsset.url);

                //resize the next image, otherwise it could be misaligned and get in the way of the
                //skrim click off close
                $nextImage.css({
                    height: dimensions.height,
                    width: dimensions.width,
                    'margin-left': Math.round(($stage.width() - dimensions.width) / 2),
                    'margin-top': Math.round(($stage.height() - dimensions.height) / 2)
                });
            }

            $image.removeClass('opaque wd-next-image').attr('src', nextAsset.url);
        },

        // function to resize the current viewer to be vertically and horizontally centered within the stage.
        // This does nothing if the current asset is a video inside an inline player (not a modal) as
        // the positioning is done via CSS. For images in an inline player (thanks to IE8) and images/videos
        // inside the modal, js math is needed to ensure aspect ratios and control locations
        resize: function () {
            var $container = this.$container,
                $credits = $container.find('.wd-credit-tray'),
                $stage = $container.find('.wd-stage'),
                asset = this.items[this.current],
                $video, $image, dimensions;

            if (this.getCurrentType() === 'video' && this.isModal()) {
                // bug in IE11 where sometimes the element will not have fully rendered yet, causing the
                // sizing of the player to collapse to 0x0. Hackily break the resize logic out of this
                // execution stack so that when it does execute, the container has size.
                // a horrible fix for a horrible browser.
                setTimeout(function () {
                    $video = $stage.find('.wd-flash-container, .video-container'),

                    dimensions = _fitWithin(
                        asset,
                        $container.width(),
                        $container.height() - $credits.height()),

                    $video.css({
                        height: dimensions.height,
                        width: dimensions.width
                    });

                    $stage.css({
                        'margin-top': ($container.height() - $stage.height()) / 2
                    });
                });
            } else if (this.getCurrentType() === 'image') {
                dimensions = _fitWithin(
                    asset,
                    $stage.width(),
                    $stage.height()
                );

                $image = $container.find('.wd-image:not(.wd-next-image)');

                $image.css({
                    height: dimensions.height,
                    width: dimensions.width,
                    'margin-left': Math.round(($stage.width() - dimensions.width) / 2),
                    'margin-top': Math.round(($stage.height() - dimensions.height) / 2)
                });
            }
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
                var content = asset.media.web || asset.media.primary,
                    maxThumb = asset.media.max,
                    smallThumb = asset.media.small;

                switch (asset.mimeCategory) {
                    case 'video': break;
                    case 'image':
                        WDP.preloadImage(content.url);
                        break;
                    default:
                        console.log('skipping', asset.mimeCategory);
                        return;
                }

                instance['_HAS_' + asset.mimeCategory.toUpperCase()] = true;

                instance.items.push({
                    title: asset.title || asset.label,
                    height: +content.height,
                    width: +content.width,
                    url: content.url,
                    mimetype: asset.mimeCategory,
                    thumbnail: {
                        url: smallThumb.url,
                        height: +smallThumb.height,
                        width: +smallThumb.width
                    },
                    poster: maxThumb.url,
                    description: asset.description,
                    keywords: $.map(asset.keywords, function (item) { return item.label; }),
                    credits: $.map(asset.metadata, function (credit) {
                        return { credit: credit.label, tag: credit.tags[0].label };
                    })
                });
            });

            // if we didn't end up parsing any presentable assets
            if (!instance.items.length) {
                return false;
            }

            // autoplay is not supported on iOS for bandwidth reasons. With the additional restriction of not
            // being able to programatically start html5 video unless the command is in an execution stack
            // that originated from a user interaction event, autoplay really only means anything on an ipad
            // if the presentation is nothing but images. If the first asset is an image and autoplay
            // and slideshow are on, then the timeout that transitions from a slideshowing image to a video
            // will not have access to start playing the video.
            if (instance.isMobile && instance.autoplay && instance._HAS_VIDEO) {
                instance.autoplay = false;
            }

            // turn off slideshow mode if the presentation has no images
            if (instance.slideshow && !instance._HAS_IMAGE) {
                instance.slideshow = false;
                instance.$container.find('.wd-stage').removeClass('slideshow');
            }

            return true;
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

                if (player.parse(data)) {
                    if (player.theme === 'inline-player') {
                        WDP._initInlinePlayer(player);
                    } else {
                        WDP._initGalleryPlayer(player);
                    }
                } else {
                    WDP._initEmptyPlayer(player);
                }

                // Callback is not needed anymore
                delete WDP._callbacks[cbid];
            };

            return 'WDP._callbacks.' + cbid;
        },

        _initGalleryPlayer: function (player) {
            player.attachGallery();
        },

        _initEmptyPlayer: function (player) {
            player.$container.find('> div').addClass('wd-hidden');
            player.$container.append(EMPTY_TEMPLATE);
        },

        _initInlinePlayer: function (player) {
            // mixin the correct player if this presentation has videos
            if (player.hasVideo()) {
                $.extend(player, mixins[player.type]);
                player.attachPlayer();
            }

            // bind image viewer if needed
            player.hasImages() && player.attachImageViewer();
            player.attachCarousel();
            player.bind();

            // flash depends on a callback, so it might not be ready yet.
            // video and image players will be ready by now, but flash will
            if (player.getCurrentType() === 'video') {
                if (player.isReady()) {
                    //player is ready (probably html5)
                    player.setSource(player.current) && player.autoplay && player.play();
                } else {
                    //player is not ready (either flash or flash is disabled.
                    //Trigger the viewer so that styles and binds don't break
                    player.toggleViewer('video');
                }
            } else {
                //first asset is an image, so it can be displayed
                player.setSource(player.current) && player.autoplay && player.play();
            }
        },

        // create a modal player and use the contents of the given player as the modal's contents.
        // The modal player is basically an inline player with different css rules applied to it
        // along with some js math and style tweaks along the way.
        showModal: function (gallery) {
            $('body').append(MODAL_TEMPLATE);

            var modalPlayer,
                $html = $('html'),
                $window = $(window),
                $document = $(document),

                // Firefox forces the page to scroll to the top when overflow hidden
                // happens on the body. stash the scroll position here to be recalled
                // when the skrim closes
                scrollY = $document.scrollTop(),
                $skrim = $('#wd-skrim'),
                resize;

            $html.addClass('wd-skrim-visible');

            // Firefox needs to be corrected
            // NOTE: If the theme declares an important margin-top rule on the
            // html tag, then this will not do anything in Firefox due to the
            // nature of the !important rule.
            //
            // This is why you should never use !important rules when expecting
            // user defined stylesheets.
            //
            // iPad still allows touch scrolling on the background document because
            // of how poorly they handle event propogation and video elements.
            // Don't bother repositioning anything if we're on mobile. Just let
            // them scroll whereever they want in the background
            if (!gallery.isMobile && $document.scrollTop() === 0) {
                $html.css({ 'margin-top': -scrollY });
            }

            modalPlayer = new Player({
                id: 'wd-modal-player',
                theme: 'inline-player',
                type: gallery.type,
                height: gallery.height,
                width: gallery.width,
                slideshow: gallery.slideshow,
                duration: gallery.duration,
                showCreditLabel: gallery.showCreditLabel,
                creditCount: gallery.creditCount,
                loop: gallery.loop
            });

            modalPlayer.current = gallery.current;
            modalPlayer.items = gallery.items;
            modalPlayer._HAS_VIDEO = gallery._HAS_VIDEO;
            modalPlayer._HAS_IMAGE = gallery._HAS_IMAGE;
            resize = $.proxy(modalPlayer.resize, modalPlayer);

            this._initInlinePlayer(modalPlayer);
            $window.on('resize', resize);

            if (modalPlayer.isReady()) {
                modalPlayer.resize();
                modalPlayer.play();
            }

            //bind the click off close on the skrim
            $skrim.on('click', function (e) {
                if ($(e.target).is('#wd-skrim, #wd-modal-player, .wd-stage, .wd-credit-tray')) {
                    modalPlayer.destroy();

                    $skrim.off('click');
                    $skrim.remove();
                    $window.off('resize', resize);
                    $html.removeClass('wd-skrim-visible');

                    $html.css({ 'margin-top': 0 });
                    !gallery.isMobile && $document.scrollTop(scrollY);
                }
            });
        },

        // Registers a new Player instance and initializes it by triggering the request for its data
        registerPlayer: function (config) {
            var player;

            if (_players[config.id]) {
                throw new Error(
                    "WiredrivePlayer: attempting to initialize an already registered player id: " + config.id
                );
            }

            player = new Player(config);
            _players[player.id] = player;
            player.fetchData();
        }
    };
}(window.jQuery));
