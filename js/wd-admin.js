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
            _dialog.dialog('open');
        },
        _dialogOkay = function () {
            if (_requesting) {
                return;
            }

            var theme = $('.wd-dialog-content input:radio[name=wd-theme]:checked').val(),
                data = {
                    theme: theme,
                    url: $('#wd-dialog-feed').val(),
                    width: $('#wd-dialog-width').val(),
                    height: $('#wd-dialog-height').val(),
                    autoslideshow: $('.' + theme + ' .wd-slideshow:checked').val(),
                    loop: $('.' + theme + ' .wd-loop:checked').val(),
                };
                
            //only send these settings if the parent settings are enabled
            if (data.autoslideshow === 'on') {
                data.slideshowduration = $('.' + theme + ' .wd-slideshow-duration').val();
            }

            //only send these settings if the theme is inline-player
            if (theme === 'inline-player') {
                //the wording is easier for humans to read, but makes the legacy
                //setting a little confusing since we now have to flip the value
                data.disablethumbs = $('#wd-enable-thumbs:checked').val() === 'on' ? 'off' : 'on';
                data.autoplay = $('#wd-inline-autoplay:checked').val();

                if (data.disablethumbs === 'off') {
                    data.hidethumbs = $('#wd-collapsable-thumbs:checked').val();
                }
            }

            if (theme === 'gallery-player') {
                data.linebreak = $('#wd-thumbnails-per-row').val();
                data.thumbwidth = $('#wd-thumbnail-width').val();
                data.thumbheight = $('#wd-thumbnail-height').val();
                data.letterbox = $('#wd-gallery-letterbox:checked').val();
                data.thumbfit = $('.wd-dialog-content input:radio[name=wd-thumb-fit]:checked').val();
            }

            _requesting = true;

            $.getJSON(WDPA.proxyUrl, data, function (response) {
                var editor,
                    tinymce = window.tinymce;

                _requesting = false;

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
            });
        },
        _dialogReset = function () {
            var defaults = WDPA.defaults;

            _dialog.find('#wd-dialog-feed').attr('value', '');
            _dialog.find('#wd-dialog-width').attr('value', defaults.width);
            _dialog.find('#wd-dialog-height').attr('value', defaults.height);
            _dialog.find('.wd-slideshow-duration').attr('value', defaults.slideshowDuration);
            _dialog.find('.wd-loop').removeAttr('checked');
            _dialog.find('.wd-autoplay').removeAttr('checked');
            _dialog.find('#wd-slideshow')
                .removeAttr('checked')
                .siblings('ul')
                .addClass('wd-disabled')
                .find('input').attr('disabled', 'disabled');
            _dialog.find('#wd-enable-thumbs')
                .attr('checked', 'checked')
                .siblings('ul')
                .removeClass('wd-disabled')
                .find('input')
                .removeAttr('disabled')
                .removeAttr('checked');
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
                    width: 750,
                    height: 650,
                    title: DIALOG_TITLE_TEMPLATE,
                    resizable: true,
                    buttons: {
                        Okay: _dialogOkay,
                        Cancel: _dialogClose
                    }
                });

                // simple delegator to make sure that sub-options are disabled when the parent
                // option is unchecked
                _dialog.on('click', [
                    '#wd-enable-thumbs,',
                    '.wd-slideshow',
                ].join(' '), function (e) {
                    var $target = $(e.target),
                        $ul = $target.siblings('ul');

                    if ($target.is(':checked')) {
                        $ul.removeClass('wd-disabled');
                        $ul.find('input').removeAttr('disabled');
                    } else {
                        $ul.addClass('wd-disabled');
                        $ul.find('input').attr('disabled', 'disabled').removeAttr('checked');
                    }
                });

                _dialog.on('click', 'input[name=wd-theme]', function (e) {
                    _dialog.find('.wd-options')
                           .addClass('wd-hidden')
                           .filter('.' + $(e.target).attr('value'))
                           .removeClass('wd-hidden');
                });

                // tack on an additiona style to the jQuery-ui generated buttons on the dialog
                $('.ui-dialog button').addClass('button');
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
