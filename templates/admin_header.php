<script type="text/javascript">

    function WDPButtonClick() {

        WDPDialogClose();

        // Open dialog
        var buttons = { "Okay": WDPButtonOkay, "Cancel": WDPDialogClose };
        var title = '<img src="<?php echo plugins_url('wiredrive-wordpress-video-player') ?>/images/button.png" alt="Wiredrive Player" width="20" height="20" style="margin: 0 0 -3px;" />' + ["Wiredrive Player"];
        jQuery("#wdp-dialog").dialog({ autoOpen: false, width: 750, minWidth: 750, height: 500, minHeight: 500, maxHeight: 500, title: title, buttons: buttons, resizable: true });
        jQuery("#wdp-dialog").dialog("open");

        // Reset the dialog box incase it's been used before
        jQuery("#wdp-dialog-feed").val("");

        // Callback function for the "Okay" button
        function WDPButtonOkay() {

            var feed = jQuery("#wdp-dialog-feed").val();
            var width = jQuery("#wdp-dialog-width").val();
            var height = jQuery("#wdp-dialog-height").val();
            var hidethumbs = jQuery("#wdp-hide-thumbs").val();
            
            if(jQuery("#wdp-hide-thumbs").is(":checked")){
                hidethumbs = 'on';
            } else {
                hidethumbs = 'off';
            }
                                    
            if ( !feed ) return WDPDialogClose();

            var text = '[wiredrive';
			
			if (width) {
			     var text = text + ' width="' + width +'px"';
			}
			
            if (height) {
			     var text = text + ' height="' + height +'px"';
			}
			
			if (hidethumbs) {
			     var text = text + ' hidethumbs="' + hidethumbs +'"';
			}
						
			var text = text + ']' + feed + '[/wiredrive]';
						
            if ( typeof tinyMCE != 'undefined' && ( ed = tinyMCE.activeEditor ) && !ed.isHidden() ) {
                ed.focus();
                if (tinymce.isIE)
                    ed.selection.moveToBookmark(tinymce.EditorManager.activeEditor.windowManager.bookmark);

                ed.execCommand('mceInsertContent', false, text);
            } else
                edInsertContent(edCanvas, text);

            WDPDialogClose();
        }

        // Close dialog if its open
        function WDPDialogClose() {
            jQuery("#wdp-dialog").dialog("close");
        }

        // Style the jQuery-generated buttons by adding CSS classes and add second CSS class to the "Okay" button
        jQuery(".ui-dialog button").addClass("button");

    };
    // On page load...
    jQuery(document).ready(function(){
    jQuery('.ui-widget-header').css('background-color', '#DFDFDF');

    });
</script>