<script type="text/javascript">
    
    function WDPButtonClick() {

        WDPDialogClose();
                
        // Open dialog
        var buttons = { "Okay": WDPButtonOkay, "Cancel": WDPDialogClose };
        var title = '<img src="<?php echo plugins_url('wiredrive-player') ?>/images/button.png" alt="Wiredrive Player" width="20" height="20" style="margin: 0 0 -3px;" />' + ["Wiredrive Player"];
        
        jQuery("#wdp-dialog").dialog({ 
                                    dialogClass: 'wdp-dialog', 
                                    position: ['center','center'], 
                                    autoOpen: false, 
                                    width: 750, 
                                    minWidth: 750, 
                                    maxWidth: 750, 
                                    height: 580, 
                                    minHeight: 580, 
                                    maxHeight: 650, 
                                    title: title, 
                                    buttons: buttons, 
                                    resizable: true });
                                    
        jQuery("#wdp-dialog").dialog("open");

        // Reset the dialog box incase it's been used before
        jQuery("#wdp-dialog-feed").val("");

        // Callback function for the "Okay" button
        function WDPButtonOkay() {
            
            jQuery("#wdp-dialog-feed").val(function(i, val) {
                return val.replace('feed:', 'http:');
            });
            
            var feed = jQuery('#wdp-dialog-feed').val();
                        
            if ( !feed ) {
                return WDPDialogClose();
            } else {         
                    
                var width = jQuery("#wdp-dialog-width").val();
                var height = jQuery("#wdp-dialog-height").val();
                
                // Setup varibles
                var hidethumbs = {};
                var disablethumbs = {};
                var autoslideshow ={};
                
                // Get Theme Radio Button Values
                var theme = jQuery(".wdp-dialog-content").find("input:radio[name=wdp-theme]:checked").val();
                            
                if(jQuery("#wdp-hide-thumbs").is(":checked")){
                    hidethumbs = 'on';
                } else {
                    hidethumbs = 'off';
                }
                
                if(jQuery("#wdp-auto-slideshow").is(":checked")){
                    autoslideshow = 'on';
                } else {
                    autoslideshow = 'off';
                }
                
                if(jQuery("#wdp-disable-thumbs").is(":checked")){
                    disablethumbs = 'on';
                } else {
                    disablethumbs = 'off';
                }            
                        
                var text = '[wiredrive';
    			
    			if (width) {
    			     text = text + ' width="' + width +'px"';
    			}
    			
                if (height) {
    			     text = text + ' height="' + height +'px"';
    			}
    
    			if (hidethumbs) {
    			     text = text + ' hidethumbs="' + hidethumbs +'"';
    			}			
    
    			if (disablethumbs) {
    			     text = text + ' disablethumbs="' + disablethumbs +'"';
    			}		
    			
    			if (autoslideshow == 'on') {
                    text = text + ' autoslideshow="' + autoslideshow +'"';
    			}
    			
    			if (theme) {
                    text = text + ' theme="' + theme +'"';
    			}

                jQuery.get('<?php echo plugins_url('wiredrive-player') ?>/proxy.php?url='+feed+'', function(html){
                    if (html == '') {
                        alert('Invalid URL');
                        return false;
                    } 
                    
                    html = html.replace( /<(\/?)(html|head|body)([^>]*)>/ig, function(a,b,c,d){
                        return '<' + b + 'div' + ( b ? '' : ' data-element="' + c + '"' ) + d + '>';
                    });

                    RSSlink = jQuery(html).find('[data-element=head]').find('link[type="application/rss+xml"]').eq(0).attr('href');
                                        
                    if ( typeof RSSlink != 'undefined') {
                        feed = RSSlink;
                    }

                    text = text + ']' + feed + '[/wiredrive]';
    						
                    if ( typeof tinyMCE != 'undefined' && ( ed = tinyMCE.activeEditor ) && !ed.isHidden() ) {
                        ed.focus();
                        if (tinymce.isIE)
                            ed.selection.moveToBookmark(tinymce.EditorManager.activeEditor.windowManager.bookmark);
                            ed.execCommand('mceInsertContent', false, text);
                    } else {
                        edInsertContent(edCanvas, text);
                                
                    }

                    WDPDialogClose();

                });
    						
            }
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