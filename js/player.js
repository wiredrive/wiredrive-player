/* 
 * This file was written to work with jQuery 1.4.2 (the version that comes with WordPress 3.0), hence the use of the .attr() method instead of the better .data() method.
 * Once WordPress 3.1 ships and is widely adopted, this will be re-written to use jQuery 1.4.4 and the .data() method.
 */
    
// The resizing function for slideshow images. Needs to be ready before (document).ready    
function fit_within_box(box_width, box_height, new_width, new_height)
{
    var aspect_ratio=new_width/new_height;
    if(new_width>box_width){
        new_width=box_width;
        new_height=Math.round(new_width/aspect_ratio);
    }
    if(new_height>box_height){
        new_height=box_height;
        new_width=Math.round(new_height*aspect_ratio);
    }    
    return {
        width: new_width, 
        height: new_height
    };
};
            
jQuery(document).ready(function($) {
    
    // Set the first thumb as active
    $('.wd-thumb-list li:first-child a').addClass('wd-active');
    
    // Show the first credit & title
    $('.wd-player .wd-credits-container').each(function() {
        $(this).find('.wd-title')
                .append(
                    $(this).closest('.wd-player').find('.wd-thumb-list .wd-active').attr('data-wd-title')
                );
        
        $(this).find('.wd-credit')
                .append(
                    $(this).closest('.wd-player').find('.wd-thumb-list .wd-active').attr('data-wd-credit')
                );
        
    });
                    
    
    function setNextCredit() {
        nextItem = $(this).closest('.wd-player').find('.wd-stage').attr('data-wd-item');
        nextItem++;
                        
        // Title credit
        $(this).closest('.wd-player')
            .find('.wd-title')
            .empty()
            .append(
                $(this).closest('.wd-player').find('.wd-thumb-list li a').eq(nextItem).attr('data-wd-title')
            );
    
        // First credit
        $(this).closest('.wd-player')
            .find('.wd-credit')
            .empty()
            .append(
                $(this).closest('.wd-player').find('.wd-thumb-list li a').eq(nextItem).attr('data-wd-credit')
            );   
    };
    
    function setPrevCredit() {
        prevItem = $(this).closest('.wd-player').find('.wd-stage').attr('data-wd-item');
        prevItem--;
                
        // Title credit
        $(this).closest('.wd-player')
            .find('.wd-title')
            .empty()
            .append(
                $(this).closest('.wd-player').find('.wd-thumb-list li a').eq(prevItem).attr('data-wd-title')
        );
    
        // First credit
        $(this).closest('.wd-player')
            .find('.wd-credit')
            .empty()
            .append(
                $(this).closest('.wd-player').find('.wd-thumb-list li a').eq(prevItem).attr('data-wd-credit')
        );   
    };

    function showCredit()
    {
        // On mouse enter
        // Title credit
        $(this).closest('.wd-player')
            .find('.wd-title')
            .empty()
            .append(
                $(this).attr('data-wd-title')
            );
    
        // First credit
        $(this).closest('.wd-player')
            .find('.wd-credit')
            .empty()
            .append(
                $(this).attr('data-wd-credit')
            );
    };
    function hideCredit()
    {
        // On mouse out
        var wdItem = $(this).closest('.wd-player').find('.wd-stage').attr('data-wd-item')
        
        // Add playing item's title back to credit container
        $(this).closest('.wd-player')
            .find('.wd-title')
            .empty()
            .append(
                $(this).closest('.wd-player')
                        .find('.wd-thumb-list li a')
                        .eq(wdItem)
                        .attr('data-wd-title')
            );
        
        // Add playing item's first credit back to credit container
        $(this).closest('.wd-player')
            .find('.wd-credit')
            .empty()
            .append(
                $(this).closest('.wd-player')
                    .find('.wd-thumb-list li a')
                    .eq(wdItem)
                    .attr('data-wd-credit')
            );
        
    };

    // The not-mobile class can be used when you want to do things only when on a computer. There is also a mobile class to target just mobile devices.
    // Handles the mouseover credit feature
    $('.not-mobile .wd-thumb-list a').hover(showCredit,hideCredit);

    // Handles the set credit feature
    function setClickedCredit()
    {   
        // Remove active class
        $(this).closest('.wd-player')
                .find('.wd-thumb-list .wd-active')
                .removeClass('wd-active');
        
        // Add new active credit
        $(this).addClass('wd-active');
        
        // Set the stage to the new item number.
        $(this).closest('.wd-player')
            .find('.wd-stage')
            .attr('data-wd-item', $(this).attr('data-wd-item'));
    };

    function setNavButton(listLength) {
        // Hide/show the correct next/prev button.
        var currentItem = $(this).closest('.wd-player').find('.wd-stage').attr('data-wd-item');
        if (currentItem == listLength ) {
            $(this).closest('.wd-player').find('.wd-play-next').removeClass('wd-active');
            $(this).closest('.wd-player').find('.wd-play-prev').addClass('wd-active'); 
        } else if (currentItem == 0) {
            $(this).closest('.wd-player').find('.wd-play-prev').removeClass('wd-active');
            $(this).closest('.wd-player').find('.wd-play-next').addClass('wd-active');    
        } else if (currentItem > 0) {
            $(this).closest('.wd-player').find('.wd-play-next').addClass('wd-active');
            $(this).closest('.wd-player').find('.wd-play-prev').addClass('wd-active');
        }

    };

    // On thumb click do...
    $('.wd-player.not-slideshow .wd-thumb-list a').click(function(e)
    {
        
        // Get the href from the thumb link and feed it into the video player. This line is for HTML5 player only.
        var listLength = $(this).closest('.wd-player').find('.wd-thumb-list').children('li').size() - 1;
        var currentID = $(this).closest('.wd-player').find('.wd-video-player').attr('id');
        var videoContainer = document.getElementById(currentID);            
        var newSrc = $(this).attr('href');
        
        // This is testing to see if the newSrc has been set before starting. I do this so when Flash is used JavaScript doesn't throw an error.             
        if ( typeof videoContainer.load == 'function' ) {
            videoContainer.src = newSrc;
            videoContainer.load();
            videoContainer.play();
        } else {
    
            // For Flash: Send the href of the thumb to the Flash player
            $(this).closest('.wd-player')
                    .find('.wd-stage .wd-video-player')
                    .externalInterface({method:'setNewSource', args:$(this).attr('href')});
			
			$(this).closest('.wd-player')
                    .find('.wd-stage .wd-video-player')
                    .externalInterface({method:'removePlayButton'});
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
        setClickedCredit.call(this);
        
        // Set the next/prev button active
        setNavButton.call(this, listLength);
                
        e.preventDefault();

    });

    // Scroll list to the left/right when button clicked
	var itemPos = 2
    $('.wd-player .wd-nav-next').click(function()
    {
        $(this).closest('.wd-player')
                .find('.wd-thumb-list-container')
                .scrollTo( '+=250px', '800', { axis:'x'});
        
        var itemPos =+ 2
    });
	
    $('.wd-nav-prev').click(function()
    {
        $(this).closest('.wd-player')
                .find('.wd-thumb-list-container')
                .scrollTo( '-=250px', '800', { axis:'x'});
    });

    // Send next source to the player
    function setNextSource()
    {       
        //jQuery .size() starts counting at 1, so we need to subtract 1 to get the list to add up correctly with the way jQeury .eg() works.
        var listLength = $(this).closest('.wd-player').find('.wd-thumb-list').children('li').size() - 1;
        var currentID = $(this).closest('.wd-player').find('.wd-video-player').attr('id');
        var videoContainer = document.getElementById(currentID);
        var nextItem = $(this).closest('.wd-player').find('.wd-stage').attr('data-wd-item');
                
        if (nextItem < listLength) {
            
            // Get the new SRC URL.
                nextItem++;
            var nextSrc = $(this).closest('.wd-player').find('.wd-thumb-list li a').eq(nextItem).attr('href'); 
            
            if (videoContainer == null) {
                //This means it's an image
                
                //Check to see if the current image is still fading (prevents turbo clicking problems).
                if ($(this).closest('.wd-player').find('.wd-slideshow-image').is(':animated')) {
                    return;
                }
                
                var slideshowHeight = $(this).closest('.wd-player').find('.wd-stage').height()
                var slideshowWidth = $(this).closest('.wd-player').find('.wd-stage').width()
                var newImageHeight = $(this).closest('.wd-player').find('.wd-thumb-list li a').eq(nextItem).attr('data-wd-height')
                var newImageWidth = $(this).closest('.wd-player').find('.wd-thumb-list li a').eq(nextItem).attr('data-wd-width')
                var currentImageHref = $(this).closest('.wd-player').find('.wd-slideshow-image').eq(0).attr('src')
                        
                // Get the new image sizes
                var new_size = fit_within_box(slideshowWidth, slideshowHeight, newImageWidth, newImageHeight);
                
                // Get first image and duplicate it
                $(this).closest('.wd-player').find('.wd-slideshow-image').eq(0).clone()
                    // Now modify the duplicated image to be the new image. This is done so we only have to do one DOM insertion. 
                            .hide()
                            .attr('src', nextSrc)
                            .attr('data-wd-item',nextItem)
                            .width(new_size.width)
                            .height(new_size.height)
                            .css('margin-top', 0-(new_size.height/2)+'px')
                            .css('margin-left', 0-(new_size.width/2)+'px')
                            .appendTo($(this).closest('.wd-player').find('.wd-stage'));
                
                $(this).closest('.wd-player').find('.wd-slideshow-image').eq(0).fadeOut('slow', function() 
                {
                    $(this).remove();
                });

                $(this).closest('.wd-player').find('.wd-slideshow-image').eq(1).fadeIn('slow');
                
            } else if ( typeof videoContainer.load == 'function' ) {
                // This send it to the HTML player
                videoContainer.src = nextSrc;
                videoContainer.load();
                videoContainer.play();                
            } else {
                // This sends it to the Flash Player                     
                $(videoContainer).externalInterface({method:'setNewSource', args:nextSrc})
                $(videoContainer).externalInterface({method:'removePlayButton'});
            }
                            
            // Set active class on the new item
            // Remove active class
            $(this).closest('.wd-player')
                    .find('.wd-thumb-list .wd-active')
                    .removeClass('wd-active');

            // Add active class        
            $(this).closest('.wd-player')
                    .find('.wd-thumb-list li a')
                    .eq(nextItem)
                    .addClass('wd-active');
            
            setNextCredit.call(this);
            
            // Set the new item number on the stage
            $(this).closest('.wd-player')
                    .find('.wd-stage')
                    .attr('data-wd-item', nextItem);
        
            $(this).closest('.wd-player').find('.wd-play-prev').addClass('wd-active');
        
            if (nextItem == listLength) {
                $(this).closest('.wd-player').find('.wd-play-next').removeClass('wd-active');
            }    
        }
    }
    
    // Send previous source to the player
    function setPrevSource()
    {
        //jQuery .size() starts counting at 1, so we need to subtract 1 to get the list to add up correctly with the way jQeury .eg() works.
        var listLength = $(this).closest('.wd-player').find('.wd-thumb-list').children('li').size() - 1;        
        var currentID = $(this).closest('.wd-player').find('.wd-video-player').attr('id');
        var videoContainer = document.getElementById(currentID);
        var prevItem = $(this).closest('.wd-player').find('.wd-stage').attr('data-wd-item');

        if (prevItem > 0) { 
            // Hide play button between videos
            $(this).closest('.wd-player')
                    .find('.wd-stage .vjs-big-play-button')
                    .css('visibility','hidden');
            
            // Send next source to the HTML5 player
                prevItem--;        
            var prevSrc = $(this).closest('.wd-player').find('.wd-thumb-list').children('li').eq(prevItem).children('a').attr('href');             

            if (videoContainer == null) {
                //This means it's an image
                
                //Check to see if the current image is still fading (prevents turbo clicking problems).
                if ($(this).closest('.wd-player').find('.wd-slideshow-image').is(':animated')) {
                    return;
                }
                
                var slideshowHeight = $(this).closest('.wd-player').find('.wd-stage').height()
                var slideshowWidth = $(this).closest('.wd-player').find('.wd-stage').width()
                var newImageHeight = $(this).closest('.wd-player').find('.wd-thumb-list li a').eq(prevItem).attr('data-wd-height')
                var newImageWidth = $(this).closest('.wd-player').find('.wd-thumb-list li a').eq(prevItem).attr('data-wd-width')
                var currentImageHref = $(this).closest('.wd-player').find('.wd-slideshow-image').eq(0).attr('src')
                        
                // Get the new image sizes
                var new_size = fit_within_box(slideshowWidth, slideshowHeight, newImageWidth, newImageHeight);
                
                // Get first image and duplicate it
                $(this).closest('.wd-player').find('.wd-slideshow-image').eq(0).clone()
                    // Now modify the duplicated image to be the new image. This is done so we only have to do one DOM insertion. 
                            .hide()
                            .attr('src', prevSrc)
                            .attr('data-wd-item',prevItem)
                            .width(new_size.width)
                            .height(new_size.height)
                            .css('margin-top', 0-(new_size.height/2)+'px')
                            .css('margin-left', 0-(new_size.width/2)+'px')
                            .appendTo($(this).closest('.wd-player').find('.wd-stage'));
                
                $(this).closest('.wd-player').find('.wd-slideshow-image').eq(0).fadeOut('slow', function() 
                {
                    $(this).remove();
                });
                $(this).closest('.wd-player').find('.wd-slideshow-image').eq(1).fadeIn('slow');   
                
            } else if ( typeof videoContainer.load == 'function' ) {
                // This send it to the HTML player
                videoContainer.src = prevSrc;
                videoContainer.load();
                videoContainer.play();                
            } else {
                // This sends it to the Flash Player                     
                $(videoContainer).externalInterface({method:'setNewSource', args:prevSrc})
                $(videoContainer).externalInterface({method:'removePlayButton'});
            }

            
            // Set active class on the new item
            // Remove active class
            $(this).closest('.wd-player')
                    .find('.wd-thumb-list .wd-active')
                    .removeClass('wd-active');

            // Add active class        
            $(this).closest('.wd-player')
                    .find('.wd-thumb-list li a')
                    .eq(prevItem)
                    .addClass('wd-active');
            
            setPrevCredit.call(this);
            
            // Set the new item number on the stage
            $(this).closest('.wd-player')
                    .find('.wd-stage')
                    .attr('data-wd-item', prevItem);
            
            // Set the new item number on the stage
            $(this).closest('.wd-player')
                    .find('.wd-stage')
                    .attr('data-wd-item', prevItem);
        
            $(this).closest('.wd-player').find('.wd-play-next').addClass('wd-active');
            
            if (prevItem == 0) {
                $(this).closest('.wd-player').find('.wd-play-prev').removeClass('wd-active');
            }
        }
    }

    
    //This is the HTML5 playlist code. When a video finsihes playing, play the next one.
    $('video').bind('ended', function() 
    {   
        //jQuery .size() starts counting at 1, so we need to subtract 1 to get the list to add up correctly with the way jQeury .eg() works.
        var listLength = $(this).closest('.wd-player').find('.wd-thumb-list').children('li').size() - 1;
        
        var currentID = $(this).attr('id');
        var videoContainer = document.getElementById(currentID);
    
        var n = $(this).closest('.wd-stage').attr('data-wd-item');
            n = parseInt(n);
                        
        //This if statments makes the player stop after the last item is played.
        if (n < listLength) {
            n++;
            
            // Send next source to the HTML5 player
            setNextSource.call(this);
            
        } else {
            videoContainer.pause();
            videoContainer.currentTime = 0;
            $(this).closest('.wd-player').find('.vjs-big-play-button').css('visibility','visible');
        }
    
    });
    
            
    // When click on drop down button, slide down the thumb tray
    $('.wd-thumb-dropdown').click(function()
    {
        // These varibles are written like this to ensure that the Thumb Tray height is correct, even if the credits container is or isn't inside the thumb tray.
        var thumbListHeight = $(this).closest('.wd-player').find('.wd-thumb-tray').find('.wd-thumb-list').outerHeight();
        if (thumbListHeight == null) {
            thumbListHeight = 0
        }
                
        var creditsContainerHeight = $(this).find('.wd-thumb-tray').find('.wd-credits-container').outerHeight();
        if (creditsContainerHeight == null) {
            creditsContainerHeight = 0
        }
        
        var thumbTrayHeight = thumbListHeight + creditsContainerHeight
        
        var currentTrayHeight = $(this).closest('.wd-player').find('.wd-thumb-tray').outerHeight()
    	if ( currentTrayHeight == 0) {
    	   //Make tray go down
    		$(this).closest('.wd-player')
    		          .find('.wd-thumb-tray')
    		          .dequeue()
    		          .stop()
    		          .css('visibility', 'visible')
    		          .animate({ height: thumbTrayHeight });

    		$(this).addClass('wd-up-arrow');
    		
    		$(this).closest('.wd-player')
    		          .find('.wd-credits-container')
    		          .addClass('wd-active');
    		
    	} else {
    	   //Make tray go up
            $(this).closest('.wd-player')
                    .find('.wd-thumb-tray')
                    .animate({ height: '0' }, 'normal', 'linear', function() 
                        {
                            $(this).css('visibility', 'hidden');
                        }
                    );
                    
            $(this).removeClass('wd-up-arrow');
            
            $(this).closest('.wd-player')
                    .find('.wd-credits-container')
                    .removeClass('wd-active');
        }
    }); 
                    
    // When hover on drop down button, change the color of the credit container
    // The not-mobile class can be used when you want to do things only when on a computer. There is also a mobile class to target just mobile devices.
    $('.not-mobile .wd-thumb-dropdown').hover(
        function () {
            $(this).closest('.wd-player').find('.wd-credits-container').toggleClass('hide-thumbs');
    });
    
    /*
     * Below is code relating to the image slideshow feature.
     *
     ***************************************************************************
     */
    
    //This resizes the first slideshow image.
    $('.wd-player.slideshow .wd-slideshow-image').each(function() {
        
        var slideshowHeight = $(this).closest('.wd-player').find('.wd-stage').height();
        var slideshowWidth = $(this).closest('.wd-player').find('.wd-stage').width();
        var newImageHeight = $(this).closest('.wd-player').find('.wd-thumb-list a').eq(0).attr('data-wd-height');
        var newImageWidth = $(this).closest('.wd-player').find('.wd-thumb-list a').eq(0).attr('data-wd-width');

        var first_size = fit_within_box(slideshowWidth, slideshowHeight, newImageWidth, newImageHeight);
                
        $(this).width(first_size.width)
            .height(first_size.height)
            .css('margin-top', 0-(first_size.height/2)+'px')
            .css('margin-left', 0-(first_size.width/2)+'px')
            .show();
    });
    
    // When clicking on a slideshow thumb, do this
    $('.wd-player.slideshow .wd-thumb-list a').click(function(e)
    {   
        e.preventDefault();   
        var newImageHref = $(this).attr('href')
        var slideshowHeight = $(this).closest('.wd-player').find('.wd-stage').height()
        var slideshowWidth = $(this).closest('.wd-player').find('.wd-stage').width()
        var newImageHeight = $(this).attr('data-wd-height')
        var newImageWidth = $(this).attr('data-wd-width')
        var currentImageHref = $(this).closest('.wd-player').find('.wd-slideshow-image').eq(0).attr('src')
                                
        //Test to see if clicked thumb is current image
        if ( newImageHref == currentImageHref ) {
            return;
        } else if ($(this).closest('.wd-player').find('.wd-slideshow-image').is(':animated')) {
            return;
        } else {
            
            // Get the new image sizes
            var new_size = fit_within_box(slideshowWidth, slideshowHeight, newImageWidth, newImageHeight);

            // Get first image and duplicate it
            $(this).closest('.wd-player').find('.wd-slideshow-image').eq(0).clone()
                // Now modify the duplicated image to be the new image. This is done so we only have to do one DOM insertion. 
                        .hide()
                        .attr('src', newImageHref)
                        .attr('data-wd-item',$(this).attr('data-wd-item'))
                        .width(new_size.width)
                        .height(new_size.height)
                        .css('margin-top', 0-(new_size.height/2)+'px')
                        .css('margin-left', 0-(new_size.width/2)+'px')
                        .appendTo($(this).closest('.wd-player').find('.wd-stage'));
            
            $(this).closest('.wd-player').find('.wd-slideshow-image').eq(0).fadeOut('slow', function() 
            {
                $(this).remove();
            });
            $(this).closest('.wd-player').find('.wd-slideshow-image').eq(1).fadeIn('slow');            
            
            // Set the stage to the current plaing item number. This is so the slideshow function knows which image to show next.
            $(this).closest('.wd-player')
                .find('.wd-stage')
                .attr('data-wd-item', $(this).attr('data-wd-item'));
            
            setClickedCredit.call(this);
            
            setNavButton.call(this);
        }
    
        e.preventDefault();    
    });

    // This will play the next item in the playlist
    $('.wd-player .wd-play-next').click(function()
    {
        setNextSource.call(this);
    });

    
    // This will play the previous item in the playlist
    $('.wd-player .wd-play-prev').click(function()
    {
        setPrevSource.call(this);
    });
    
    // This enables touch gestures for next/prev image on a slideshow
    var touch = {};
    $('.wd-player.slideshow .wd-stage').live('touchstart touchmove touchend', function(event) {    

        var e = event.originalEvent;    
        
        if (event.type == 'touchend') {
            return;
        }

        if (event.type == 'touchstart') { 
            var t = e.touches[0];
    		touch.x = t.clientX;         
        }
        
         if (event.type == 'touchmove') {
            // only deal with one finger
    		if (e.touches.length == 1) {
    			var t = e.touches[0],
    				deltaX = touch.x - t.clientX
                                
    			if (deltaX < 0 && !$(this).closest('.wd-player').find('.wd-slideshow-image').is(':animated')) {
                    setNextSource.call(this);
    			} else if (deltaX > 0 && !$(this).closest('.wd-player').find('.wd-slideshow-image').is(':animated')) {
                    setPrevSource.call(this);
    			} 				
    			e.preventDefault();
    		}
        }
       
    });

    // Start the autoslide show
    var playSlideshow = {};
    $(document).ready(function autoSlideshow()
    {
        
        $('.wd-player.autoslideshow .wd-stage').animate(
            {
                opacity: 1
            }, 5000, function() 
            {
                listLength = $(this).closest('.wd-player').find('.wd-thumb-list').children('li').size() - 1;
                currentItem = $(this).closest('.wd-player').find('.wd-stage').attr('data-wd-item')
                                
                if (currentItem < listLength) {
                    if (playSlideshow) {
                        setNextSource.call(this);
                        autoSlideshow();
                    }
                    
                } else if (currentItem == listLength) {
                    $(this).closest('.wd-player').find('.wd-stage').attr('data-wd-item', -1)
                    if (playSlideshow) {
                        setNextSource.call(this);
                        autoSlideshow();
                    }
                }
                
            });
    });
    
    // Kill the auto slideshow if something is clicked
    $('.wd-player.slideshow, .slideshow wd-play-prev, .slideshow wd-play-next').click(function() {
        playSlideshow = false;
    });
    
    // Preload the images
    $('.wd-player.autoslideshow .wd-thumb-list li').each(function(index) {
        var imageSource = $(this).children('a').attr('data-wd-source')
        var imageID = 'preload'+index;
        var imageID = $('<img />').attr('src', imageSource);
    });

});

/*
 * End of document.ready().
 ***************************************************************************
 */    

//For Flash: When video ends, play the next one.
function stoppedPlaying(flashPlayerID)
{
    var playerID = '#' + flashPlayerID

    //jQuery .length() starts counting at 1, so we need to subtract 1 to get the list to add up correctly with the way jQeury .eg() works.
    var listLength = jQuery(playerID).closest('.wd-player').find('.wd-thumb-list li').size() - 1;   
                    
    var nextItem = jQuery(playerID).closest('.wd-player').find('.wd-stage').attr('data-wd-item');
        nextItem = parseInt(nextItem);
    
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
    } 
};

// Run this after the browser window has loaded (meaning: all images have loaded). For some reason, the $ shortcut doesn't work in this function. It's a Wordpress glitch I think.
jQuery(window).load(function() {
    //Calculate thumblist width by adding up all list item widths
    jQuery('ul.wd-thumb-list').each(function() {
        var width = 0;
        jQuery(this).children('li')
                        .each(function() {

            //We add +1 here because sometimes jQuery will round down and cause the list to wrap.
            width += jQuery(this).outerWidth( true ) + 1;
        });

        jQuery(this).css('width', width);
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
			if(typeof(args.method) != 'undefined')
			{
				try
				{
					if(typeof(args.args) != 'undefined')
					{
						var data = this[args.method](args.args);
					}
					else
					{
						var data = this[args.method]();
					}
					
					if(typeof(args.success) != 'undefined')
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