(function () {
    "use strict";

    var tinymce = window.tinymce;

    tinymce.create('tinymce.plugins.wdpButton', {
        init : function (ed, url) {
            ed.addButton('mce-wdp-button', {
                title: 'Wiredrive Player',
                image: url + '/../images/icon-wd-logo.png',
                onclick : function () {
                    // HACK: TinyMCE doesn't work in IE8-9 when trying to insert content at the cursor
                    // position. The only way to get around it for IE9 is to store a bookmark of where the cursor
                    // is here and then recall that bookmark position in the shortcode callback before
                    // inserting the shortcode. Also, tinyMCE is convoluted.
                    // This does not fix IE8, so all the shortcodes that are generated will be inserted at the
                    // beginning of the text editor in IE8.
                    if (tinymce.isIE) {
                        WDPA.ieBookmark = tinymce.activeEditor.selection.getBookmark();
                    }

                    WDPA.showDialog();
                }
            });
        },

        createControl : function (n, cm) {
            return null;
        },

        getInfo : function () {
            return {
                longname: 'Wiredrive Video Player Button',
                author: 'Wiredrive',
                authorurl: 'https://wiredrive.com',
                infourl: 'https://wiredrive.com',
                version: "3.1.0"
            };
        }
    });

    tinymce.PluginManager.add('wdpButton', tinymce.plugins.wdpButton);
}());
