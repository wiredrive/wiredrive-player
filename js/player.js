    VideoJS.setupAllWhenReady();
                
    jQuery(document).ready(function($) {
    
        //Add border class to first thumb in list
        $('ul.wd-thumb-list li:first-child').addClass('wd-active');
        
        //Set the first credit as active        
        $('ul.wd-credits li:first-child').addClass('wd-active');
    
        // When hover on drop down button, change the color of the credit container
        // The not-mobile class can be used when you want to do things only when on a computer. There is also a mobile class to target just mobile devices.
        $('.not-mobile .wd-thumb-dropdown').hover(
            function () {
                $(this).parents('.wd-player').find('.wd-credits-container').toggleClass('hide-thumbs');
            });

        
        // When click on drop down button, slide down the thumb tray
        $('.wd-thumb-dropdown').click(function()
        {
            // These varibles are written like this to ensure that the Thumb Tray height is correct, even if the credits container is or isn't inside the thumb tray.
            var thumbListHeight = $(this).parents('.wd-player').find('.wd-thumb-tray').find('.wd-thumb-list').outerHeight();
            if (thumbListHeight == null) {
                thumbListHeight = 0
            }
            
            var creditsContainerHeight = $(this).find('.wd-thumb-tray').find('.wd-credits-container').outerHeight();
            if (creditsContainerHeight == null) {
                creditsContainerHeight = 0
            }
            
            var thumbTrayHeight = thumbListHeight + creditsContainerHeight
            
            var currentTrayHeight = $(this).parents('.wd-player').find('.wd-thumb-tray').outerHeight()
        	if ( currentTrayHeight == 0) {
        	   //Make tray go down
        		$(this).parents('.wd-player').find('.wd-thumb-tray').dequeue().stop().animate({ height: thumbTrayHeight });
        		$(this).addClass('wd-up-arrow');
        		$(this).parents('.wd-player').find('.wd-credits-container').addClass('wd-active');
        		
        	} else {
        	   //Make tray go up
                $(this).parents('.wd-player').find('.wd-thumb-tray').animate({ height: '0' }, 'normal', 'linear');
                $(this).removeClass('wd-up-arrow');
                $(this).parents('.wd-player').find('.wd-credits-container').removeClass('wd-active');

            }
        });        

        // On thumb click do...
        $('.wd-player .wd-thumb-list a').click(function(e)
        {
            
            // Get the href from the thumb link and feed it into the video player. This line is for HTML5 player only
            var currentEl = $(this).parents('.wd-player').find('.video-js').attr('id');
            var newSrc = $(this).attr('href');
            
            //This is testing to see if the newSrc has been set before starting. I do this so when Flash is used JavaScript doesn't throw an error.             
            if ( typeof currentEl != "undefined" ) {
                var newVideo = document.getElementById(currentEl);
                newVideo.src = newSrc;
                newVideo.load();
                newVideo.play();
            }
        
            // For Flash: Send the href of the thumb to the Flash player
            $(this).parents('.wd-player').find('.wd-video-player').externalInterface({method:'setNewSource', args:$(this).attr('href')});
			$(this).parents('.wd-player').find('.wd-video-player').externalInterface({method:'removePlayButton'});			
            
            // When a thumb is clicked remove the poster attribute from the video tag
            $(this).parents('.wd-player').find('.video-js').attr('poster',null);
    
            //Set the playing video's rel tag to to that of the clicked thumb. This is so the playlist function knows which video to play next.
            $(this).parents('.wd-player').find('.wd-video-player').attr('rel', $(this).attr('rel'));
            
            //Set the current credit and/or title.
            var currentRel = $(this).attr('rel')
            $(this).parents('.wd-player').find('.wd-credits').children('li').hide();
            $(this).parents('.wd-player').find('.wd-credits').children('li').removeClass('wd-active');
            $(this).parents('.wd-player').find('.wd-credits').children('li[rel="' + currentRel + '"]').show();
            $(this).parents('.wd-player').find('.wd-credits').children('li[rel="' + currentRel + '"]').addClass('wd-active');
            
            // First remove all borders from current thumb list
            $(this).parents('ul.wd-thumb-list').children().removeAttr('class');
            
            // Then add the border to the clicked thumb
            $(this).parent().addClass('wd-active');
            
            e.preventDefault();

        });

        // Handles the mouseover credit feature
       // The not-mobile class can be used when you want to do things only when on a computer. There is also a mobile class to target just mobile devices.
        $('.not-mobile .wd-thumb-list a').hover(
            function()
            {
                currentRel = $(this).attr('rel')
                //On mouse enter
                $(this).parents('.wd-player').find('.wd-credits').children('li').hide();
                $(this).parents('.wd-player').find('.wd-credits').children('li[rel="' + currentRel + '"]').show();
                        
            },
            function()
            {
                //On mouse out
                $(this).parents('.wd-player').find('.wd-credits').children('li').hide();
                $(this).parents('.wd-player').find('.wd-credits').children('li.wd-active').show();

            }
        );

        // Scroll list to the left/right when button clicked
		var itemPos = 2
        $('.wd-player .wd-nav-next').click(function()
        {
            $(this).parents('.wd-player').find('.wd-thumb-list-container').scrollTo( '+=250px', '800', { axis:'x'});
			var itemPos =+ 2
        });
		
        $('.wd-nav-prev').click(function()
        {
            $(this).parents('.wd-player').find('.wd-thumb-list-container').scrollTo( '-=250px', '800', { axis:'x'});
        });
        
        //This is the HTML5 playlist code. When a video finsihes playing, play the next one.
        $('video').bind('ended', function() 
        {   
            //jQuery .length() starts counting at 1, so we need to subtract 1 to get the list to add up correctly with the way jQeury .eg() works.
            var listLength = $(this).parents('.wd-player').find('ul.wd-thumb-list').children('li').size() - 1;
            
            var currentEl = $(this).attr('id');
            var nextVideo = document.getElementById(currentEl);
        
            var n = $(this).attr('rel');
            n = parseInt(n);
            
            //This if statments makes the player stop after the last item is played.
            if (n < listLength) {
                
                // Hide play button between videos
                $(this).parents('.wd-stage').find('.vjs-big-play-button').css('visibility','hidden');
            
                n++;
                // Send next source to the HTML5 player
                var nextSrc = $(this).parents('.wd-player').find('ul.wd-thumb-list').children('li').children('a').eq(n).attr('href'); 
                nextVideo.src = nextSrc;
                nextVideo.load();
                nextVideo.play();
                $(this).attr('rel', n);
                                    
                // Set border around currently playing item
                $(this).parents('.wd-player').find('ul.wd-thumb-list').children('li').removeClass('wd-active');
                $(this).parents('.wd-player').find('ul.wd-thumb-list').children('li').children('a').eq(n).parent().addClass('wd-active');
                
                // Change the credit container
                $(this).parents('.wd-player').find('.wd-credits').children('li').hide();
                $(this).parents('.wd-player').find('.wd-credits').children('li').removeClass('wd-active');
                $(this).parents('.wd-player').find('.wd-credits').children('li').eq(n).show();
                $(this).parents('.wd-player').find('.wd-credits').children('li').eq(n).addClass('wd-active');
                
            } else {
                nextVideo.pause();
                nextVideo.currentTime = 0;
                $(this).parents('.wd-stage').find('.vjs-big-play-button').css('visibility','visible');
            }
        
        });

    });
    
    //For Flash: When video ends, play the next one.
    function stoppedPlaying(playerID)
    {
        var playerID = '#' + playerID

        //jQuery .length() starts counting at 1, so we need to subtract 1 to get the list to add up correctly with the way jQeury .eg() works.
        var listLength = jQuery(playerID).parents('.wd-player').find('ul.wd-thumb-list').children('li').size() - 1;   
                
        var n = jQuery(playerID).attr('rel');
        if (typeof n == "undefined" ) {
            jQuery(playerID).attr('rel','0');
            n = jQuery(playerID).attr('rel');
        }
        var n = parseInt(n);
    
        //This if statment makes the player stop after the last item is played.
        if (n < listLength) {
            n++;
            // Send next source to the Flash player
            var nextSrc = jQuery(playerID).parents('.wd-player').find('ul.wd-thumb-list').children('li').children('a').eq(n).attr('href');
                                    
            jQuery(playerID).externalInterface({method:'setNewSource', args:nextSrc});
            jQuery(playerID).attr('rel', n);
            
            // Set border around currently playing
            jQuery(playerID).parents('.wd-player').find('ul.wd-thumb-list').children('li').removeClass('wd-active');
            jQuery(playerID).parents('.wd-player').find('ul.wd-thumb-list').children('li').children('a').eq(n).parent().addClass('wd-active');
            
            // Change the credit container
            jQuery(playerID).parents('.wd-player').find('.wd-credits').children('li').hide();
            jQuery(playerID).parents('.wd-player').find('.wd-credits').children('li').removeClass('wd-active');
            jQuery(playerID).parents('.wd-player').find('.wd-credits').children('li').eq(n).show();
            jQuery(playerID).parents('.wd-player').find('.wd-credits').children('li').eq(n).addClass('wd-active');
            
        } else {
            return;
        }
    
    };
    
    // Run this after the browser window has loaded (meaning: all images have loaded). For some reason, the $ shortcut doesn't work in this function. It's a Wordpress glitch I think.
    jQuery(window).load(function() {
    //Calculate thumblist width by adding up all list item widths
        jQuery('ul.wd-thumb-list').each(function() {
            var width = 0;
            jQuery(this).children('li').each(function() {
                //We add +1 here because sometimes jQuery will round down and cause the list to wrap.
                width += jQuery(this).outerWidth( true ) + 1;
            });
            jQuery(this).css('width', width);
        });
    });