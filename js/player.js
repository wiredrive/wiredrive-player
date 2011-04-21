/* 
 * This file was written to work with jQuery 1.4.2 (the version that comes with WordPress 3.0), hence the use of the .attr() method instead of the better .data() method.
 * Once WordPress 3.1 ships and is widely adopted, this will be re-written to use jQuery 1.4.4 and the .data() method.
 *
 * CUSTOM EVENTS
 *
 * The plugin will raise it's own custom event when a video has ended. Keep in mind the same event get's fired for the Flash player as it does for the HTML5 player.
 *
 * Sample Event Listner:
 *   
 *   $('.wd-player').bind('ended.wdp', function(event, playerID) { 
 *       alert(playerID); 
 *   });
 * 
 * The player also is set to listern for a play event. This way you can trigger the player start playing the current video like so:
 *
 * Currently this will only play the first player present on the page.
 *
 * itemNumber = The item to start playing from. If not set, it will start playing from the current item. Must be an integer. The first item is 0, the second item is 1, and so on.
 * playerID = The ID of the desired player. If not set, it will be the first player on the page. Can accept the # or not eg('#elementID' or 'elementID').
 *  
 *   $('a').click(function() {
 *       var itemNumber = 2;
 *       var playerID = $(this).closest('.post').find('.wd-video-player').attr('id');
 *       jQuery(this).trigger('play.wdp', [itemNumber, playerID]);
 *   });
 *
 */

var wdp = {

    playSlideshow: true,
    fullscreenImage: false,
    touchx: 0,
        
    init: function() {
        // Set the first thumb as active
        jQuery('.wd-thumb-list li:first-child a').addClass('wd-active');
        
        
        // Show the first credit & title
        jQuery('.wd-credits-container').each(function() {
    
            jQuery(this).find('.wd-title')
                    .append(
                        jQuery(this).closest('.wd-player')
                                    .find('.wd-thumb-list .wd-active')
                                    .attr('data-wd-title')
                    );
            
            jQuery(this).find('.wd-credit')
                    .append(
                        jQuery(this).closest('.wd-player')
                                    .find('.wd-thumb-list .wd-active')
                                    .attr('data-wd-credit')
                    );
            
        });
        
        // Preload any auto slideshow images
        jQuery('.wd-player.autoslideshow .wd-thumb-list li a').each(function(index) {
            var imageSource = jQuery(this).attr('data-wd-source');
            var imageID = jQuery('<img />').attr('src', imageSource);
        });
        
        // Run any auto slideshows
        wdp.autoSlideshow();
        
        // Remove the inline style width from the player DIV when a grid player.
        jQuery('.grid.wd-player').removeAttr('style');

        // Remove the large play button from any grid players.
        jQuery('.grid.wd-player').find('.wd-play-big-button').remove();
        
        // Position the box thumbs in the center vertically and horizontally. 
        jQuery('.box-thumbs .wd-thumb-list .wd-thumb').each(function() {
    
            var boxHeight = jQuery(this).closest('.wd-thumb-list > li > a').height();
            var boxWidth = jQuery(this).closest('.wd-thumb-list > li > a').width();
            var thumbHeight = jQuery(this).attr('data-thumb-height');
            var thumbWidth = jQuery(this).attr('data-thumb-width');
                        
            var new_size = wdp.fit_within_box(boxWidth, boxHeight, thumbWidth, thumbHeight);
              
            jQuery(this)
                .width(new_size.width)
                .height(new_size.height)
                .css({
                    'margin-top': 0-(new_size.height/2)+'px',
                    'margin-left': 0-(new_size.width/2)+'px',
                    'visibility': 'visible'
                });
        });
        
    },
    
    
    
    /*
     *  The resizing function for slideshow images. Needs to be ready before (document).ready    
     */
    fit_within_box: function(box_width, box_height, new_width, new_height) 
    {
        
        var aspect_ratio=new_width/new_height;
        if(new_width>=box_width){
            new_width=box_width;
            new_height=Math.round(new_width/aspect_ratio);
        }
        if(new_height>=box_height){
            new_height=box_height;
            new_width=Math.round(new_height*aspect_ratio);
        }    
        return {
            width: new_width, 
            height: new_height
        };
        
    },
    
    
    slideshowInit: function() {
            
        var slideshowHeight = jQuery(this).closest('.wd-player').find('.wd-stage').height();
        var slideshowWidth = jQuery(this).closest('.wd-player').find('.wd-stage').width();
        var newImageHeight = jQuery(this).closest('.wd-player').find('.wd-thumb-list a').eq(0).attr('data-wd-height');
        var newImageWidth = jQuery(this).closest('.wd-player').find('.wd-thumb-list a').eq(0).attr('data-wd-width');
        
        // If the image will be in a grid, then use a differnt size calculation        
        if (jQuery(this).closest('.wd-player').hasClass('grid')) {
 
            // Allow the image to expand to 80% of the browser window
            slideshowHeight = jQuery(window).height() - (jQuery(window).height()/100)*20;
            slideshowWidth = jQuery(window).width() - (jQuery(window).width()/100)*20;
    
            // Set the stage to the size of the browser window
            jQuery(this).closest('.wd-player').find('.wd-stage').css({
                        height: slideshowHeight,
                        width: slideshowWidth
            });
        }

        var first_size = wdp.fit_within_box(slideshowWidth, slideshowHeight, newImageWidth, newImageHeight);
                
        jQuery(this).width(first_size.width)
            .height(first_size.height)
            .css('margin-top', 0-(first_size.height/2)+'px')
            .css('margin-left', 0-(first_size.width/2)+'px')
            .show();                
    
    },


    
    autoSlideshow: function() {
        
        function delay() {

            jQuery('.wd-player.autoslideshow .wd-stage').not('.grid .wd-stage').each(function() {
                listLength = jQuery(this).closest('.wd-player').find('.wd-thumb-list').children('li').size() - 1;
                currentItem = jQuery(this).closest('.wd-player').find('.wd-stage').attr('data-wd-item');
                                
                if (currentItem < listLength) {
                    if (wdp.playSlideshow) {
                        wdp.setNextSource.call(this);
                        wdp.autoSlideshow();
                    }
                    
                } else if (currentItem === listLength) {
                    jQuery(this).closest('.wd-player').find('.wd-stage').attr('data-wd-item', -1);
                    if (wdp.playSlideshow) {
                        wdp.setNextSource.call(this);
                        wdp.autoSlideshow();
                    }
                }
                
            });

        }
        
        setTimeout(delay, 5000);

    },
    
    slideshowImageClick: function() {

        var currentStage = jQuery(this).closest('.wd-player').find('.wd-stage');
        var newImageHref = jQuery(this).attr('href');
        var slideshowHeight = jQuery(this).closest('.wd-player').find('.wd-stage').height();
        var slideshowWidth = jQuery(this).closest('.wd-player').find('.wd-stage').width();
        var newImageHeight = jQuery(this).attr('data-wd-height');
        var newImageWidth = jQuery(this).attr('data-wd-width');
        var currentImageHref = jQuery(this).closest('.wd-player').find('.wd-slideshow-image').eq(0).attr('src');
        
        if ( newImageHref !== currentImageHref ) {
            currentStage.find('.wd-slideshow-image').removeAttr('src');
        }
        
        // If the image will be in a grid, then use a differnt size calculation        
        if (jQuery(this).closest('.wd-player').hasClass('grid')) {

            // Allow the image to expand to 80% of the browser window
            slideshowHeight = jQuery(window).height() - (jQuery(window).height()/100)*20;
            slideshowWidth = jQuery(window).width() - (jQuery(window).width()/100)*20;
    
            // Set the stage to the size of the browser window
            jQuery(this).closest('.wd-player').find('.wd-stage').css({
                        height: slideshowHeight,
                        width: slideshowWidth
            });
        }

        // Test to see if clicked thumb is current image
        if ( newImageHref === currentImageHref ) {
            currentStage.find('.wd-slideshow-image').css('visibility','visible');
            return;
        } else if (currentStage.find('.wd-slideshow-image').is(':animated')) {
            return;
        } else {
                        
            // Get the new image sizes
            var new_size = wdp.fit_within_box(slideshowWidth, slideshowHeight, newImageWidth, newImageHeight);

            // Get first image and duplicate it
            var firstImage = currentStage.find('.wd-slideshow-image').eq(0).clone().addClass('wd-slideshow-image-two');
            
            currentStage.append(firstImage);
            
            // Now modify the duplicated image to be the new image. This is done so we only have to do one DOM insertion.
            currentStage.find('.wd-slideshow-image-two')
                        .hide()
                        .removeAttr('id')
                        .attr('src', newImageHref)
                        .attr('data-wd-item',jQuery(this).attr('data-wd-item'))
                        .width(new_size.width)
                        .height(new_size.height)
                        .css('margin-top', 0-(new_size.height/2)+'px')
                        .css('margin-left', 0-(new_size.width/2)+'px');
                        
        }
        
        if (jQuery(this).closest('.wd-player').hasClass('grid')) {
           // If the image will be in a grid, then just show the image, don't fade it in.        
            currentStage.find('.wd-slideshow-image').eq(0).remove();
            currentStage.find('.wd-slideshow-image-two').css('visibility','visible');
            
        } else {
            // Otherwise, fade out the first image, remove it, and then fade in the new image.
            currentStage.find('.wd-slideshow-image').eq(0).fadeOut('slow', function()
            {
                jQuery(this).remove();
                currentStage.find('.wd-slideshow-image-two').fadeIn().removeClass('.wd-slideshow-image-two');
            });
        }    
        
        // Set the stage to the current plaing item number. This is so the slideshow function knows which image to show next.
        currentStage.attr('data-wd-item', jQuery(this).attr('data-wd-item'));
        
        wdp.setClickedCredit.call(this);
        
        wdp.setNavButton.call(this);
    },
    
    setNextCredit: function(playerID, isFlash) 
    {
        
        if(isFlash) {
            // Is Flash
            currentPlayer = jQuery(playerID).closest('.wd-player');
        } else {
            // Is slideshow or HTML5
             currentPlayer = jQuery(this).closest('.wd-player');
        }
                
        var nextItem = currentPlayer.find('.wd-stage').attr('data-wd-item');
        
               
        // New credits
        currentPlayer.find('.wd-credits .wd-title')
                    .empty()
                    .append(
                        currentPlayer.find('.wd-thumb-list li a').eq(nextItem).attr('data-wd-title')
                    );
        
        currentPlayer.find('.wd-credits .wd-credit')
                    .empty()
                    .append(
                        currentPlayer.find('.wd-thumb-list li a').eq(nextItem).attr('data-wd-credit')
                    );
    },
    
    setPrevCredit: function() 
    {
        var prevItem = jQuery(this).closest('.wd-player').find('.wd-stage').attr('data-wd-item');
                
        // New credits
        jQuery(this).closest('.wd-player')
            .find('.wd-credits .wd-title')
            .empty()
            .append(
                jQuery(this).closest('.wd-player').find('.wd-thumb-list li a').eq(prevItem).attr('data-wd-title')
            );
        
        jQuery(this).closest('.wd-player')
            .find('.wd-credits .wd-credit')
            .empty()
            .append(
                jQuery(this).closest('.wd-player').find('.wd-thumb-list li a').eq(prevItem).attr('data-wd-credit')
            );
            
    },
    
    showCredit: function() 
    {
        // Title credit
        jQuery(this).closest('.wd-player')
            .find('.wd-credits .wd-title')
            .empty()
            .append(
                jQuery(this).attr('data-wd-title')
            );
            
        // First credit
        jQuery(this).closest('.wd-player')
            .find('.wd-credits .wd-credit')
            .empty()
            .append(
                jQuery(this).attr('data-wd-credit')
            );
    
    },
    
    hideCredit: function()
    {
        // On mouse out
        var wdItem = jQuery(this).closest('.wd-player').find('.wd-stage').attr('data-wd-item');
        
        // Add playing item's title back to credit container
        jQuery(this).closest('.wd-player')
            .find('.wd-credits .wd-title')
            .empty()
            .append(
                jQuery(this).closest('.wd-player').find('.wd-thumb-list li a').eq(wdItem).attr('data-wd-title')
            );
        
        // Add playing item's credit back to the credit container
        jQuery(this).closest('.wd-player')
            .find('.wd-credits .wd-credit')
            .empty()
            .append(
                jQuery(this).closest('.wd-player').find('.wd-thumb-list li a').eq(wdItem).attr('data-wd-credit')
            );
    },
    
    
    
    /*
     * Handles the set credit feature
     */
    setClickedCredit: function()
    {   
        // Remove active class
        jQuery(this).closest('.wd-player')
                .find('.wd-thumb-list .wd-active')
                .removeClass('wd-active');
        
        // Add new active credit
        jQuery(this).addClass('wd-active');
        
        // Set the stage to the new item number.
        jQuery(this).closest('.wd-player')
            .find('.wd-stage')
            .attr('data-wd-item', jQuery(this).attr('data-wd-item'));
    },
    
    
    /*
     * Used for the slidehsow feature to make sure the next/prev button is displayed when it needs to be.
     */
    setNavButton: function(listLength, playerID, isFlash) 
    {
        
        if(isFlash) {
            // Is Flash
            currentPlayer = jQuery(playerID).closest('.wd-player');
        } else {
            // Is slideshow or HTML5
             currentPlayer = jQuery(this).closest('.wd-player');
        }

        var currentItem = currentPlayer.find('.wd-stage').attr('data-wd-item');
           
        // Remeber that listLength starts at 0. So, listLength=1 means there are 2 items.
        if (listLength == 0 ) {
            // 1 item in list...
            currentPlayer.find('.wd-play-next, .wd-play-prev').removeClass('wd-active').css('opacity','0');    
        } else if (currentItem == listLength ) {
            // On last item...
            currentPlayer.find('.wd-play-next').removeClass('wd-active');
            currentPlayer.find('.wd-play-prev').addClass('wd-active'); 
        } else if (currentItem == 0) {
            // On first item...
            currentPlayer.find('.wd-play-prev').removeClass('wd-active');
            currentPlayer.find('.wd-play-next').addClass('wd-active');    
        } else if (currentItem > 0) {
            // One any item
            currentPlayer.find('.wd-play-next').addClass('wd-active');
            currentPlayer.find('.wd-play-prev').addClass('wd-active');
        }

    },
    
    
    
    /*
     * Send next source to the player
     */
    setNextSource: function()
    {   
       
        //Check to see if the current image is still fading (prevents turbo clicking problems with slideshows).
        if (jQuery(this).closest('.wd-player').find('.wd-slideshow-image').is(':animated')) {
            return;
        }
       
        //jQuery .size() starts counting at 1, so we need to subtract 1 to get the list to add up correctly with the way jQeury .eq() works.
        var listLength = jQuery(this).closest('.wd-player').find('.wd-thumb-list li').size() - 1;
        var currentID = jQuery(this).closest('.wd-player').find('.wd-video-player').attr('id');
        var videoContainer = document.getElementById(currentID);
        var nextItem = jQuery(this).closest('.wd-player').find('.wd-stage').attr('data-wd-item');
                
        if (nextItem < listLength) {
            
            // Get the new SRC URL.
                nextItem++;
            var nextSrc = jQuery(this).closest('.wd-player').find('.wd-thumb-list li a').eq(nextItem).attr('href'); 
            
            if (videoContainer === null) {
                //This means it's an image                
                var currentStage = jQuery(this).closest('.wd-player').find('.wd-stage');
                var slideshowHeight = jQuery(this).closest('.wd-player').find('.wd-stage').height();
                var slideshowWidth = jQuery(this).closest('.wd-player').find('.wd-stage').width();
                var newImageHeight = jQuery(this).closest('.wd-player').find('.wd-thumb-list li a').eq(nextItem).attr('data-wd-height');
                var newImageWidth = jQuery(this).closest('.wd-player').find('.wd-thumb-list li a').eq(nextItem).attr('data-wd-width');
                var currentImageHref = jQuery(this).closest('.wd-player').find('.wd-slideshow-image').eq(0).attr('src');
                        
                // Get the new image sizes
                var new_size = wdp.fit_within_box(slideshowWidth, slideshowHeight, newImageWidth, newImageHeight);
                        
                // Get first image and duplicate it
                var firstImage = jQuery(this).closest('.wd-player').find('.wd-slideshow-image').eq(0).clone().addClass('wd-slideshow-image-two').removeAttr('src');
                
                currentStage.append(firstImage);
                            
                // Now modify the duplicated image to be the new image. This is done so we only have to do one DOM insertion.
                currentStage.find('.wd-slideshow-image-two')
                            .hide()
                            .removeAttr('id')
                            .attr('src', nextSrc)
                            .attr('data-wd-item', nextItem)
                            .width(new_size.width)
                            .height(new_size.height)
                            .css('margin-top', 0-(new_size.height/2)+'px')
                            .css('margin-left', 0-(new_size.width/2)+'px');
                            

                // Fade out the first image, remove it, and then fade in the new image.
                currentStage.find('.wd-slideshow-image').eq(0).fadeOut('slow', function()
                {
                    jQuery(this).remove();
                    currentStage.find('.wd-slideshow-image-two').fadeIn().removeClass('.wd-slideshow-image-two');
                });
                           
            } else if ( typeof videoContainer.load === 'function' ) {
                // This sends it to the HTML player
                videoContainer.src = nextSrc;
                videoContainer.load();
                videoContainer.play();
                                 
            } else {
           
                // This sends it to the Flash Player                  
                jQuery(videoContainer).externalInterface({method:'setNewSource', args:nextSrc});
                jQuery(videoContainer).externalInterface({method:'removePlayButton'});
            }
            // Set active class on the new item
            // Remove active class
            jQuery(this).closest('.wd-player')
                    .find('.wd-thumb-list .wd-active')
                    .removeClass('wd-active');

            // Add active class        
            jQuery(this).closest('.wd-player')
                    .find('.wd-thumb-list li a')
                    .eq(nextItem)
                    .addClass('wd-active');
            
            // Set the new item number on the stage
            jQuery(this).closest('.wd-player')
                    .find('.wd-stage')
                    .attr('data-wd-item', nextItem);

        
            wdp.setNextCredit.call(this);

            wdp.setNavButton.call(this, listLength);
              
        }
    },
    
    
    
    /*
     * Send previous source to the player
     */
    setPrevSource: function()
    {
       
        //Check to see if the current image is still fading (prevents turbo clicking problems with slideshows).
        if (jQuery(this).closest('.wd-player').find('.wd-slideshow-image').is(':animated')) {
            return;
        }
            
        //jQuery .size() starts counting at 1, so we need to subtract 1 to get the list to add up correctly with the way jQeury .eq() works.
        var listLength = jQuery(this).closest('.wd-player').find('.wd-thumb-list').children('li').size() - 1;        
        var currentID = jQuery(this).closest('.wd-player').find('.wd-video-player').attr('id');
        var videoContainer = document.getElementById(currentID);
        var prevItem = jQuery(this).closest('.wd-player').find('.wd-stage').attr('data-wd-item');

        if (prevItem > 0) { 
            // Hide play button between videos
            jQuery(this).closest('.wd-player')
                    .find('.wd-stage .vjs-big-play-button')
                    .css('visibility','hidden');
            
            // Send next source to the HTML5 player
                prevItem--;        
            var prevSrc = jQuery(this).closest('.wd-player').find('.wd-thumb-list').children('li').eq(prevItem).children('a').attr('href');             

            if (videoContainer === null) {
                //This means it's an image                
                var currentStage = jQuery(this).closest('.wd-player').find('.wd-stage');
                var slideshowHeight = jQuery(this).closest('.wd-player').find('.wd-stage').height();
                var slideshowWidth = jQuery(this).closest('.wd-player').find('.wd-stage').width();
                var newImageHeight = jQuery(this).closest('.wd-player').find('.wd-thumb-list li a').eq(prevItem).attr('data-wd-height');
                var newImageWidth = jQuery(this).closest('.wd-player').find('.wd-thumb-list li a').eq(prevItem).attr('data-wd-width');
                var currentImageHref = jQuery(this).closest('.wd-player').find('.wd-slideshow-image').eq(0).attr('src');
                        
                // Get the new image sizes
                var new_size = wdp.fit_within_box(slideshowWidth, slideshowHeight, newImageWidth, newImageHeight);
                        
                // Get first image and duplicate it
                var firstImage = jQuery(this).closest('.wd-player').find('.wd-slideshow-image').eq(0).clone().addClass('wd-slideshow-image-two').removeAttr('src');
                
                currentStage.append(firstImage);
                
            
                // Now modify the duplicated image to be the new image. This is done so we only have to do one DOM insertion.
                currentStage.find('.wd-slideshow-image-two')
                            .hide()
                            .removeAttr('id')
                            .attr('src', prevSrc)
                            .attr('data-wd-item', prevItem)
                            .width(new_size.width)
                            .height(new_size.height)
                            .css('margin-top', 0-(new_size.height/2)+'px')
                            .css('margin-left', 0-(new_size.width/2)+'px');
                            

                // Fade out the first image, remove it, and then fade in the new image.

                currentStage.find('.wd-slideshow-image').eq(0).fadeOut('slow', function()
                {
                    jQuery(this).remove();
                    currentStage.find('.wd-slideshow-image-two').fadeIn().removeClass('.wd-slideshow-image-two');
                });
                
            } else if ( typeof videoContainer.load === 'function' ) {
                // This send it to the HTML player
                videoContainer.src = prevSrc;
                videoContainer.load();
                videoContainer.play();                
            } else {
                // This sends it to the Flash Player                     
                jQuery(videoContainer).externalInterface({method:'setNewSource', args:prevSrc});
                jQuery(videoContainer).externalInterface({method:'removePlayButton'});
            }

            
            // Set active class on the new item
            // Remove active class
            jQuery(this).closest('.wd-player')
                    .find('.wd-thumb-list .wd-active')
                    .removeClass('wd-active');

            // Add active class        
            jQuery(this).closest('.wd-player')
                    .find('.wd-thumb-list li a')
                    .eq(prevItem)
                    .addClass('wd-active');
            
            // Set the new item number on the stage
            jQuery(this).closest('.wd-player')
                    .find('.wd-stage')
                    .attr('data-wd-item', prevItem);
            
            // Set the new item number on the stage
            jQuery(this).closest('.wd-player')
                    .find('.wd-stage')
                    .attr('data-wd-item', prevItem);
                    
            wdp.setPrevCredit.call(this);
            
            wdp.setNavButton.call(this, listLength);
        }
    },



    /*
     * Thumb tray drop down toggle
     */
    thumbTrayDropdown: function() {
        
        // These varibles are written like this to ensure that the Thumb Tray height is correct, even if the credits container is or isn't inside the thumb tray.
        var thumbListHeight = jQuery(this).closest('.wd-player').find('.wd-thumb-tray').find('.wd-thumb-list').outerHeight();
        if (thumbListHeight === null) {
            thumbListHeight = 0;
        }
                
        var creditsContainerHeight = jQuery(this).find('.wd-thumb-tray').find('.wd-credits-container').outerHeight();
        if (creditsContainerHeight === null) {
            creditsContainerHeight = 0;
        }
        
        var thumbTrayHeight = thumbListHeight + creditsContainerHeight;
        
        var currentTrayHeight = jQuery(this).closest('.wd-player').find('.wd-thumb-tray').outerHeight();
    	if ( currentTrayHeight === 0) {
    	   //Make tray go down
    		jQuery(this).closest('.wd-player')
    		          .find('.wd-thumb-tray')
    		          .dequeue()
    		          .stop()
    		          .css('visibility', 'visible')
    		          .animate({ height: thumbTrayHeight });

    		jQuery(this).addClass('wd-up-arrow');
    		
    		jQuery(this).closest('.wd-player')
    		          .find('.wd-credits-container')
    		          .addClass('wd-active');
    		
    	} else {
    	   //Make tray go up
            jQuery(this).closest('.wd-player')
                    .find('.wd-thumb-tray')
                    .animate({ height: '0' }, 'normal', 'linear', function() 
                        {
                            jQuery(this).css('visibility', 'hidden');
                        }
                    );
                    
            jQuery(this).removeClass('wd-up-arrow');
            
            jQuery(this).closest('.wd-player')
                    .find('.wd-credits-container')
                    .removeClass('wd-active');
        }

    },
    
    
    
    /*
     * For Flash: When video ends, play the next one.
     */
    stoppedPlaying: function(playerID)
    {      
        var playerID = '#' + playerID;
        var isFlash = true;
        
        // Fire a custom event (see the top of the this file for a discription).
        jQuery('.wd-video-player').trigger('ended.wdp', [playerID]);
        
        //jQuery .length() starts counting at 1, so we need to subtract 1 to get the list to add up correctly with the way jQeury .eq() works.
        var listLength = jQuery(playerID).closest('.wd-player').find('.wd-thumb-list li').size() - 1;   
                        
        var currentItem = jQuery(playerID).closest('.wd-player').find('.wd-stage').attr('data-wd-item');
        var nextItem = parseInt(currentItem, 10);
        
        //This if statment makes the player stop after the last item is played.
        if (nextItem < listLength) {
            nextItem++;
            // Send next source to the Flash player
            var nextSrc = jQuery(playerID).closest('.wd-player').find('ul.wd-thumb-list').children('li').children('a').eq(nextItem).attr('href');
                                    
            jQuery(playerID).externalInterface({method:'setNewSource', args:nextSrc});
            
            jQuery(playerID).closest('.wd-player')
                                .find('.wd-stage')
                                .attr('data-wd-item', nextItem);
            
            // Set border around currently playing
            jQuery(playerID).closest('.wd-player')
                                .find('.wd-thumb-list .wd-active')
                                .removeClass('wd-active');
                                
            jQuery(playerID).closest('.wd-player')
                                .find('.wd-thumb-list li a')
                                .eq(nextItem)
                                .addClass('wd-active');
                                
            wdp.setNextCredit(playerID, isFlash);
            
        }
        
        wdp.setNavButton.call(this, listLength, playerID, isFlash); 
    },


    /*
     * Add a DIV that contains the title and credit.
     */    
    showHoverCredits: function()
    {
        jQuery(this).find('.hover-credits').show();
    },
    
    hideHoverCredits: function() 
    {    
        jQuery(this).find('.hover-credits').hide();
    },
        
    
    /*
     * Play the video
     * Used for the big play button
     */
        
    play: function() {
        var playerID = jQuery(this).closest('.wd-player').find('video').attr('id');
        var videoContainer = document.getElementById(playerID); 

        jQuery(this).closest('.wd-player').find('video').attr('controls', 'true');       
        jQuery(this).closest('.wd-player').find('.wd-play-big-button').remove();

        videoContainer.play();
    }
};

            
jQuery(document).ready(function($) {       

    wdp.init();             

    /*
     * Handles the mouseover credit feature
     * The not-mobile class can be used when you want to do things only when on a computer. There is also a mobile class to target just mobile devices.
     */ 
    $('.not-mobile .wd-thumb-list a').hover(wdp.showCredit, wdp.hideCredit);


    /*
     * On thumb click do...
     */ 
    $('.wd-player.not-slideshow .wd-thumb-list a').click(function(e)
    {
        e.preventDefault();
        
        // Get the href from the thumb link and feed it into the video player. This line is for HTML5 player only.
        var listLength = $(this).closest('.wd-player').find('.wd-thumb-list').children('li').size() - 1;
        var currentID = $(this).closest('.wd-player').find('.wd-video-player').attr('id');
        var videoContainer = document.getElementById(currentID);            
        var newSrc = $(this).attr('href');
        
        // This is testing to see if the newSrc has been set before starting. I do this so when Flash is used JavaScript doesn't throw an error.             
        if ( typeof videoContainer.load === 'function' ) {
            videoContainer.src = newSrc;
            
            $(this).closest('.wd-player').find('.wd-video-player').attr('controls', 'true');       
            $(this).closest('.wd-player').find('.wd-play-big-button').remove();            
            videoContainer.load();
            videoContainer.play();
        } else {            
            // For Flash: Send the href of the thumb to the Flash player
            $(videoContainer).externalInterface({method:'setNewSource', args:newSrc});
            $(videoContainer).externalInterface({method:'removePlayButton'});
        }
        
        // When a thumb is clicked remove the poster attribute from the video tag
        $(this).closest('.wd-player')
                .find('.video-js')
                .attr('poster',null);

        // Set the stage to the current plaing item number. This is so the playlist function knows which video to play next.
        $(this).closest('.wd-player')
                .find('.wd-stage')
                .attr('data-wd-item', $(this).attr('data-wd-item'));
        
        // Set the current credit and/or title.
        wdp.setClickedCredit.call(this);
        
        // Set the next/prev button active
        wdp.setNavButton.call(this, listLength);
                
    });


    /*
     * Play video when clicking large play icon
     */
    $('.wd-play-big-button').click(function(){
        wdp.play.call(this);
    });

    /*
     * Scroll list to the left/right when button clicked
     */ 
	var itemPos = 2;
    $('.wd-player .wd-nav-next').click(function()
    {
        $(this).closest('.wd-player')
                .find('.wd-thumb-list-container')
                .scrollTo( '+=250px', '800', { axis:'x'});
        
        var itemPos =+ 2;
    });
	
    $('.wd-nav-prev').click(function()
    {
        $(this).closest('.wd-player')
                .find('.wd-thumb-list-container')
                .scrollTo( '-=250px', '800', { axis:'x'});
    });
    
    
    
    /*
     * This is the HTML5 playlist code. When a video finsihes playing, play the next one.
     */ 
    $('video').bind('ended', function() 
    {   
        
        var playerID = $(this).attr('id');
        
        // Fire a custom event (see the top of the this file for a discription).
        jQuery('.wd-video-player').trigger('wdpEnded', [playerID]);
    
        //jQuery .size() starts counting at 1, so we need to subtract 1 to get the list to add up correctly with the way jQeury .eq() works.
        var listLength = $(this).closest('.wd-player').find('.wd-thumb-list').children('li').size() - 1;
        
        var videoContainer = document.getElementById(playerID);
    
        var n = $(this).closest('.wd-stage').attr('data-wd-item');
            n = parseInt(n, 10);
                        
        //This if statments makes the player stop after the last item is played.
        if (n < listLength) {
            n++;
            
            // Send next source to the HTML5 player
            wdp.setNextSource.call(this);
            
        } else {
            videoContainer.pause();
            videoContainer.currentTime = 0;
            $(this).closest('.wd-player').find('.vjs-big-play-button').css('visibility','visible');
        }
    
    });



            
    /*
     *  When click on drop down button, slide down the thumb tray
     */
    $('.wd-thumb-dropdown').click(function() 
    {
        wdp.thumbTrayDropdown.call(this);
    }); 


                    
/*
 * Below is code relating to the image slideshow feature.
 *
 ***************************************************************************
 */
    
    /*
     * This resizes the first slideshow image.
     */
    $('.wd-player.slideshow .wd-slideshow-image').each(function() 
    {
    
        wdp.slideshowInit.call(this);
    
    });
    
    
    
    /*
     *  When clicking on a slideshow thumb, do this
     */
    $('.wd-player.slideshow .wd-thumb-list a').click(function(e)
    {   
        e.preventDefault();
        wdp.slideshowImageClick.call(this);
    
    });
    
    
    
    
    /*
     *  This will play the next item in the playlist
     */
    $('.wd-player .wd-play-next').click(function()
    {
        wdp.setNextSource.call(this);
    });

    
    
    
    /*
     *  This will play the previous item in the playlist
     */
    $('.wd-player .wd-play-prev').click(function()
    {
        wdp.setPrevSource.call(this);
    });
   
   
   
    /*
     *  This enables touch gestures for next/prev image on a slideshow
     */
    $('.wd-player.slideshow .wd-stage').live('touchstart touchmove touchend', function(event) {            
        
        var e = event.originalEvent;    
        
        if (event.type === 'touchend') {
            return;
        }

        if (event.type === 'touchstart') { 
            var t = e.touches[0];
    		wdp.touchx = t.clientX;         
        }
        
         if (event.type === 'touchmove') {
            // only deal with one finger
    		if (e.touches.length === 1) {
    			var t = e.touches[0],
    				deltaX = wdp.touchx - t.clientX;
                                
    			if (deltaX < 0 && !$(this).closest('.wd-player').find('.wd-slideshow-image').is(':animated')) {
                    wdp.setPrevSource.call(this);
    			} else if (deltaX > 0 && !$(this).closest('.wd-player').find('.wd-slideshow-image').is(':animated')) {
                    wdp.setNextSource.call(this);
                    
    			} 				
    			e.preventDefault();
    		}
        }
       
    });


        
    /*
     *  Kill the auto slideshow if something is clicked
     */
    $('.wd-player.slideshow, .slideshow wd-play-prev, .slideshow wd-play-next').click(function() {
        wdp.playSlideshow = false;
    });
    
   
/*
 * Below is the code relating to the grid player.
 ***************************************************************************
 */    
     
    /*
     * When you click on a thumb do this
     */
    $('.grid.not-mobile .wd-thumb-list a').not('.ipad .wd-thumb-list a').click(function(e) {
        
        var listLength = $(this).closest('.wd-player').find('.wd-thumb-list').children('li').size() - 1;
        var popTitle = $(this).closest('.wd-player').find('.wd-credits').eq(0).clone().addClass('grid-credits');
        var popMargTop = $(this).closest('.wd-player').find('.wd-stage').height() / 2;
        var popMargLeft = $(this).closest('.wd-player').find('.wd-stage').width() / 2;
    
        // Apply Margin to grid
        $(this).closest('.wd-player').find('.wd-stage').css({
            'margin-top' : -popMargTop,
            'margin-left' : -popMargLeft
        });
                                            
        // Fade in the stage
        $(this).closest('.wd-player').find('.wd-stage').css({'top' : '50%', 'left' : '50%'}).removeClass('zero');        
        
        // Add active class to stage
        $(this).closest('.wd-player').find('.wd-stage').addClass('wd-active');
        
        // Add close button and set width
        $(this).closest('.wd-player').find('.wd-stage')
                            .append('<a href="#close" class="close">&#215;</a>')
                            .append(popTitle);      

        //Add the fade layer to bottom of the body tag.
        $('body').append('<div id="fade"></div>');
        
        //Fade in the fade layer
        $('#fade').fadeIn();
        
        // Set the next/prev button active
        wdp.setNavButton.call(this, listLength);
                
        e.preventDefault();
    });
    
    
    
    /*
     * Play video on mobile device
     */
    $('.grid.mobile .wd-thumb-list a').click(function() 
    {
        window.location = $(this).attr('href');
    });
    
    
    
    /*
     * Go to source on iPad.
     */
    $('.grid.ipad .wd-thumb-list a').click(function() 
    {
            window.location = $(this).attr('href');
    });
    
    
    
    /*
     * Set the click tracker on a slideshow image
     */
    $('.grid.slideshow .wd-thumb-list a').click(function() 
    {
        wdp.fullscreenImage = true;
        $(this).closest('.wd-player').find('.wd-slideshow-image').show();
    });
    
    
    
     /*
      * Resize the slideshow grid when the browser window is resized
      */
    $(window).resize(function() {
                
        if (wdp.fullscreenImage) {
                        
            var currentItem = $('.wd-stage.wd-active').attr('data-wd-item');
            var slideshowHeight = Math.round($(window).height() - ($(window).height()/100)*20);
            var slideshowWidth = Math.round($(window).width() - ($(window).width()/100)*20);
            var newImageHeight = $('.wd-stage.wd-active').closest('.wd-player').find('.wd-thumb-list li a').eq(currentItem).attr('data-wd-height');
            var newImageWidth = $('.wd-stage.wd-active').closest('.wd-player').find('.wd-thumb-list li a').eq(currentItem).attr('data-wd-width');
    
            // Get the new sizes
            var new_size = wdp.fit_within_box(slideshowWidth, slideshowHeight, newImageWidth, newImageHeight);
            
            // Resize the image
            $('.wd-stage.wd-active').find('.wd-slideshow-image')
                        .width(new_size.width)
                        .height(new_size.height)
                        .css('margin-top', 0-(new_size.height/2)+'px')
                        .css('margin-left', 0-(new_size.width/2)+'px');

            // Set the stage to the size of the window
            $('.wd-stage.wd-active')
                        .css('height', slideshowHeight)
                        .css('width', slideshowWidth)
                        .css('margin-top', 0-(slideshowHeight/2)+'px')
                        .css('margin-left', 0-(slideshowWidth/2)+'px');
        }

    });
    
    
    
    /*
     * Close grids and Fade Layer
     */
    $('a.close, #fade').live('click', function(e) 
    {
        var currentID = $('.wd-stage.wd-active').find('video').attr('id');
        var videoContainer = document.getElementById(currentID);
        var flashObject = $('.wd-stage.wd-active').find('.wd-video-player');    

        $('#fade').fadeOut('fast', function() 
        {            
                        
            if (videoContainer === null) {
                //Stop the Flash video
                flashObject.externalInterface({method:'pausevideo'});

            } else {
                //Stop HTML5 video      
                videoContainer.pause();
                videoContainer.currentTime = 0;
                
            }

            // Remove the fade layer and close button
            $('#fade, a.close, .grid-credits, .wd-arrows').remove();

            // Move stage offscreen
            $('.grid .wd-stage').css({'top' : '999%', 'left' : '999%'});
        });
        
        // Remove active class from stage
        $('.wd-stage.wd-active').removeClass('wd-active');
        
        // Reset the click tracker
        wdp.fullscreenImage = false;
        
        e.preventDefault();
    });
    
    
    
    /*
     * On thumb hover show the credits
     */
    $('.grid .wd-thumb-list a, .inline-grid .wd-thumb-list a').hover(function(){
        wdp.showHoverCredits.call(this);
    },
    function() {
        wdp.hideHoverCredits.call(this);
    });



    /*
     * Bind custom events
     */ 
    $('body').bind('play.wdp', function(event, itemNumber, playerID) {       

        if (playerID) {
            // Strip hash from player ID
            playerID.replace('#','');
        } else {
            var playerID = $('.wd-video-player').attr('id');
        }

        if (typeof(itemNumber) == "undefined") {
            var newSrc = $('#'+playerID).closest('.wd-player').find('.wd-thumb-list a.wd-active').attr('href');
        } else {
            var newSrc = $('#'+playerID).closest('.wd-player').find('.wd-thumb-list a').eq(itemNumber).attr('href');
            
            // Set the correct link as active
            $('#'+playerID).closest('.wd-player').find('.wd-thumb-list a.wd-active').removeClass('wd-active');
            $('#'+playerID).closest('.wd-player').find('.wd-thumb-list a').eq(itemNumber).addClass('wd-active');
            
            // Set the stage counter to the correct number
            $('#'+playerID).closest('.wd-player').find('.wd-stage').attr('data-wd-item', itemNumber);
            
        }
                
        var videoContainer = document.getElementById(playerID);

        if ( typeof videoContainer.load === 'function' ) {
            // This sends it to the HTML player
        
            $('#'+playerID).closest('.wd-player').find('video').attr('controls', 'true');       
            $('#'+playerID).closest('.wd-player').find('.wd-play-big-button').remove();
        
            videoContainer.src = newSrc;
            videoContainer.load();
            videoContainer.play();                                 
        } else {   
            // This sends it to the Flash Player                  
            $(videoContainer).externalInterface({method:'setNewSource', args:newSrc});
            $(videoContainer).externalInterface({method:'removePlayButton'});
        }
                
    });
   
   $('#test').click(function() {
       //playerID = $('.wd-video-player').attr('id');
       
       jQuery(this).trigger('play.wdp', [0]);
   });    
    
});


/*
 * Run this after the browser window has loaded (meaning: all images have loaded).
 * For some reason, the $ shortcut doesn't work in this function. I think it's becuase of the jQuery version that ships with WordPress..
 *
 */
 
jQuery(window).load(function() {
    // Calculate thumblist width by adding up all list item widths
    jQuery('.wd-thumb-list').each(function() {
        var width = 0;
        var height = 0;
        jQuery(this).children('li')
                        .each(function() {
            
            width += Math.round(jQuery(this).outerWidth(true))+1;
            height += Math.round(jQuery(this).outerHeight(true))+1;
        });

        jQuery(this).css('width', width).attr('data-wd-height', height);
    });
    
});



/*
 * jQuery Plugin: externalInterface
 * Version 1.0
 *
 * Copyright (c) 2010 David Comeau (http://www.davecomeau.net)
 * Licensed jointly under the GPL and MIT licenses.
 *
 */
(function(jQuery)
{
	jQuery.fn.externalInterface = function(args)
	{
		this.each(function()
		{
			if(typeof(args.method) !== 'undefined')
			{
				try
				{
					if(typeof(args.args) !== 'undefined')
					{
						var data = this[args.method](args.args);
					}
					else
					{
						var data = this[args.method]();
						
					}
					
					if(typeof(args.success) !== 'undefined')
					{
						args.success(data);
					}
				}
				catch(error)
				{
					if(typeof(args.error) != 'undefined')
					{
						args.error(error);
					}
				}
			}

		});
	
		return this;
	};
})(jQuery);