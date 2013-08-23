(function ($) {
    "use strict";

    var DIALOG_TITLE_TEMPLATE = [
            '<span class="wd-logo"></span>',
            '<span class="wd-dialog-title">Wiredrive Player</span>'
        ].join(''),

        // the handle on the dialog element. There should only be one instance, so
        // it's safe to stash this in this scope
        _dialog,

        //is a proxy request in progress?
        _requesting = false,

        // dialog callback/action functions
        _dialogClose = function () {
            _dialog.dialog('close');
        },
        _dialogOpen = function () {
            _dialogReset();

            //jquery-ui won't let you set HTML in the title, even if you know what you're doing
            _dialog.parent().find('.ui-dialog-title').html(DIALOG_TITLE_TEMPLATE);

            _dialog.dialog('open');
        },
        _dialogOkay = function () {
            if (_requesting) {
                return;
            }

            var theme = $('#wd-theme').val(),
                $loading = $('.ui-dialog-buttonset .wd-loading'),
                data = {
                    theme: theme,
                    url: $('#wd-url').val(),
                    autoslideshow: $('#wd-slideshow:checked').val(),
                    loop: $('#wd-loop:checked').val(),
                    action: 'wd-url-validator'
                };
                
            //only send these settings if the parent settings are enabled
            if (data.autoslideshow === 'on') {
                data.slideshowduration = $('#wd-duration').val();
            }

            //only send these settings if the theme is inline-player
            if (theme === 'inline-player') {
                data.width = $('#wd-width').val();
                data.height = $('#wd-height').val();

                //the wording is easier for humans to read, but makes the legacy
                //setting a little confusing since we now have to flip the value
                data.disablethumbs = $('#wd-enablethumbs:checked').val() === 'on' ? 'off' : 'on';
                data.autoplay = $('#wd-autoplay:checked').val();

                if (data.disablethumbs === 'off') {
                    data.hidethumbs = $('#wd-hidethumbs:checked').val();
                    data.creditcount = $('#wd-reel-credit-count').val();
                    data.creditlabel = $('#wd-reel-credit-label:checked').val();
                }
            }

            if (theme === 'gallery-player') {
                if ($('#wd-linebreak-enabled:checked').val() === 'on') {
                    data.linebreak = $('#wd-linebreak').val();
                }

                data.creditcount = $('#wd-gallery-credit-count').val();
                data.creditlabel = $('#wd-gallery-credit-label:checked').val();
                data.thumbwidth = $('#wd-thumbwidth').val();
                data.thumbheight = $('#wd-thumbheight').val();
                data.letterbox = $('#wd-letterbox:checked').val();
                data.thumbfit = $('#wd-thumbfit').val();
            }

            _requesting = true;
            $loading.removeClass('wd-hidden');

            $.post(WDPA.validatorUrl, data, function (response) {
                var editor,
                    tinymce = window.tinymce;

                _requesting = false;
                $loading.addClass('wd-hidden');

                if (response.error) {
                    alert(response.error);
                    return;
                }

                if (typeof tinymce !== 'undefined') {
                    editor = tinymce.activeEditor;

                    if (!editor.isHidden()) {
                        editor.focus();

                        // hack to make up for tinymce and IE9's ignorance.
                        // a bookmark is saved when the dialog opens to store the cursor position.
                        // here we recall it so that the shortcode is inserted at the cursor location,
                        // rather than the beginning of the editor (IE8 still has this problem)
                        if (tinymce.isIE) {
                            editor.selection.moveToBookmark(WDPA.ieBookmark);
                        }

                        editor.execCommand('mceInsertContent', false, response.shortcode);
                    }
                }

                _dialogClose();
            }, 'json');
        },
        _dialogReset = function () {
            var defaults = WDPA.defaults;

            // reset shared
            _dialog.find('#wd-url').attr('value', '');
            _dialog.find('#wd-loop').removeAttr('checked');
            _dialog.find('#wd-duration').attr('value', defaults.slideshowDuration).attr('disabled', 'disabled');
            _dialog.find('#wd-slideshow').removeAttr('checked');

            // reset inline
            _dialog.find('#wd-width').attr('value', defaults.width);
            _dialog.find('#wd-height').attr('value', defaults.height);
            _dialog.find('#wd-autoplay').removeAttr('checked');
            _dialog.find('#wd-enablethumbs')
                   .attr('checked', 'checked')
                   .closest('li').find('ul').removeClass('wd-disabled')
                   .find('input').removeAttr('disabled').removeAttr('checked');

            // reset gallery
            _dialog.find('#wd-letterbox').removeAttr('checked');
            _dialog.find('#wd-linebreak-enabled').removeAttr('checked');
            _dialog.find('#wd-linebreak').attr('disabled', 'disabled');
            _dialog.find('#wd-gallery-credit-label').removeAttr('checked');
        },

        WDPA = window.WDPA = {
            showDialog: _dialogOpen,

            //create and bind the dialog instance. There should not be a need for multiple
            //dialogs on the same page
            initDialog: function () {
                _dialog = $('#wd-dialog'); //set scope var
                    
                _dialog.dialog({
                    dialogClass: 'wd-dialog',
                    position: ['center', 'center'],
                    autoOpen: false,
                    resizable: false,
                    width: 750,
                    height: 535,
                    modal: true,
                    buttons: {
                        Okay: _dialogOkay,
                        Cancel: _dialogClose
                    }
                });

                // bind theme change swapping the options panels
                _dialog.on('change', 'select#wd-theme', function (e) {
                    var $gallery = _dialog.find('#wd-gallery-options'),
                        $reel = _dialog.find('#wd-reel-options');

                    if ($(e.target).val() === 'gallery-player') {
                        $gallery.removeClass('wd-hidden');
                        $reel.addClass('wd-hidden');
                    } else {
                        $gallery.addClass('wd-hidden');
                        $reel.removeClass('wd-hidden');
                    }
                });

                // bind checkboxes that disable relevant text inputs
                _dialog.on('change', '#wd-slideshow, #wd-linebreak-enabled', function (e) {
                    var $target = $(e.target),
                        $sib = $target.siblings('input[type="text"]');

                    if ($target.is(':checked')) {
                        $sib.removeAttr('disabled');
                    } else {
                        $sib.attr('disabled', 'disabled');
                    }
                });

                // bind checkboxes with sub options
                _dialog.on('change', '#wd-enablethumbs', function (e) {
                    var $target = $(e.target),
                        $options = $target.closest('li').find('ul'),
                        $inputs = $options.find('input');

                    if ($(e.target).is(':checked')) {
                        $options.removeClass('wd-disabled');
                        $inputs.removeAttr('disabled');
                    } else {
                        $options.addClass('wd-disabled');
                        $inputs.attr('disabled', 'disabled');
                    }
                });

                // tack on an additiona style to the jQuery-ui generated buttons on the dialog
                $('.ui-dialog button').addClass('button');
                $('.wd-dialog .ui-dialog-buttonset').prepend('<span class="wd-loading wd-hidden"></span>');
            },

            //bind all the color pickers that may or may not be on the page.
            //color pickers are current only on the admin-settings page
            bindColorPickers: function () {
                // Add Farbtastic to every color input
                $('.wd-color-input-wrap').each(function () {
                    var id = $(this).children('input').attr('id');

                    $('.' + id).farbtastic('#' + id);
                });

                //On click show the color picker
                $('.wd-color-button').click(function () {
                    $(this).siblings('.wd-color-picker-wrap').show();
                });

                // anytime a mousedown even reaches the document, close all color pickers
                // (a once delegator would really come in handy here)
                $(document).mousedown(function () {
                    $('.wd-color-picker-wrap').hide()
                });

                //update the background color if text is entered into the field
                $('.wd-color-input').keyup(function () {
                    var color = $(this).val();

                    $(this).css('background-color', color);
                });
            }
        };

    $(document).ready(function () {
        WDPA.initDialog();
        WDPA.bindColorPickers();
    });
}(window.jQuery));
