/* 
 * This file was written to work with jQuery 1.4.2 (the version that comes with WordPress 3.0), hence the use of the .attr() method instead of the better .data() method.
 * Once WordPress 3.1 ships and is widely adopted, this will be re-written to use jQuery 1.4.4 and the .data() method.
 */
    
    VideoJS.setupAllWhenReady();
                
    jQuery(document).ready(function($) {
        
        // Set the first thumb as active
        $('.wd-thumb-list li:first-child a').addClass('wd-active');
                        
        
        // Handles the mouseover credit feature
        // The not-mobile class can be used when you want to do things only when on a computer. There is also a mobile class to target just mobile devices.

        function showCredit()
        {
            // On mouse enter
            // Title credit
            $(this).closest('.wd-player').find('.wd-credits-container .wd-title').empty().append(
                $(this).attr('data-wd-title')
            );
            // First credit
            $(this).closest('.wd-player').find('.wd-credits-container .wd-credit').empty().append(
                $(this).attr('data-wd-credit')
            );
        };
        function hideCredit()
        {
            // On mouse out
            var wdItem = $(this).closest('.wd-player').find('.wd-stage').attr('data-wd-item')
            
            // Add playing item's title back to credit container
            $(this).closest('.wd-player').find('.wd-credits-container .wd-title').empty().append(
                $(this).closest('.wd-player').find('.wd-thumb-list li').eq(wdItem).children('a').attr('data-wd-title')
            );
            
            // Add playing item's first credit back to credit container
            $(this).closest('.wd-player').find('.wd-credits-container .wd-credit').empty().append(
                $(this).closest('.wd-player').find('.wd-thumb-list li').eq(wdItem).children('a').attr('data-wd-credit')
            );
            
        };
        $('.not-mobile .wd-thumb-list a').hover(showCredit,hideCredit);
    
        // Handles the set credit feature
        function setClickedCredit()
        {   
            // Remove active class
            $(this).closest('.wd-thumb-list').find('.wd-active').removeClass('wd-active');
            
            // Add new active credit
            $(this).addClass('wd-active');
            
            // Set the stage to the new item number.
            $(this).closest('.wd-player').find('.wd-stage').attr('data-wd-item', $(this).attr('data-wd-item'));
        };

        // On thumb click do...
        $('.wd-player .wd-thumb-list a').click(function(e)
        {
            
            // Get the href from the thumb link and feed it into the video player. This line is for HTML5 player only.
            var currentEl = $(this).closest('.wd-player').find('.video-js').attr('id');
            var newSrc = $(this).attr('href');
            
            //This is testing to see if the newSrc has been set before starting. I do this so when Flash is used JavaScript doesn't throw an error.             
            if ( typeof currentEl != "undefined" ) {
                var newVideo = document.getElementById(currentEl);
                newVideo.src = newSrc;
                newVideo.load();
                newVideo.play();
            }
        
            // For Flash: Send the href of the thumb to the Flash player
            $(this).closest('.wd-player').find('.wd-stage .wd-video-player').externalInterface({method:'setNewSource', args:$(this).attr('href')});
			$(this).closest('.wd-player').find('.wd-stage .wd-video-player').externalInterface({method:'removePlayButton'});			
            
            // When a thumb is clicked remove the poster attribute from the video tag
            $(this).closest('.wd-player').find('.video-js').attr('poster',null);
    
            //Set the playing video's rel tag to to that of the clicked thumb. This is so the playlist function knows which video to play next.
            $(this).closest('.wd-player').find('.wd-stage').attr('data-wd-item', $(this).attr('data-wd-item'));
            
            //Set the current credit and/or title.
            setClickedCredit.call(this);
            
            e.preventDefault();

        });

        // Scroll list to the left/right when button clicked
		var itemPos = 2
        $('.wd-player .wd-nav-next').click(function()
        {
            $(this).closest('.wd-player').find('.wd-thumb-list-container').scrollTo( '+=250px', '800', { axis:'x'});
			var itemPos =+ 2
        });
		
        $('.wd-nav-prev').click(function()
        {
            $(this).closest('.wd-player').find('.wd-thumb-list-container').scrollTo( '-=250px', '800', { axis:'x'});
        });

        // Send next source to the player
        function setNextSource()
        {        
            var currentID = $(this).attr('id');
            var nextVideo = document.getElementById(currentID);

            // Hide play button between videos
            $(this).closest('.wd-player').find('.wd-stage .vjs-big-play-button').css('visibility','hidden');
            
            // Send next source to the HTML5 player
            var nextItem = $(this).closest('.wd-player').find('.wd-stage').attr('data-wd-item') + 1;            
            var nextSrc = $(this).closest('.wd-player').find('.wd-thumb-list li').eq(nextItem).children('a').attr('href'); 
            nextVideo.src = nextSrc;
            nextVideo.load();
            nextVideo.play();
            
            // Set active class on the new item
            $(this).closest('.wd-player').find('.wd-thumb-list .wd-active').removeClass('wd-active');
            $(this).closest('.wd-player').find('.wd-thumb-list li').eq(nextItem).children('a').addClass('wd-active')
            
            // Set the new item number on the stage
            $(this).closest('.wd-player').find('.wd-stage').attr('data-wd-item', nextItem);
        }
        
        // Send previous source to the player
        function setPrevSource()
        {
            var currentID = $(this).attr('id');
            var nextVideo = document.getElementById(currentID);
            
            // Hide play button between videos
            $(this).closest('.wd-player').find('.wd-stage .vjs-big-play-button').css('visibility','hidden');
            
            // Send next source to the HTML5 player
            var prevItem = $(this).closest('.wd-player').find('.wd-stage').attr('data-wd-item') - 1;            
            var prevSrc = $(this).closest('.wd-player').find('.wd-thumb-list').children('li').eq(currentItem-1).children('a').attr('href');             
            nextVideo.src = nextSrc;
            nextVideo.load();
            nextVideo.play();
            
            // Set the new item number on the stage
            $(this).closest('.wd-player').find('.wd-stage').attr('data-wd-item', currentItem-1);
        }

        
        //This is the HTML5 playlist code. When a video finsihes playing, play the next one.
        $('video').bind('ended', function() 
        {   
            //jQuery .size() starts counting at 1, so we need to subtract 1 to get the list to add up correctly with the way jQeury .eg() works.
            var listLength = $(this).parents('.wd-player').find('.wd-thumb-list').children('li').size() - 1;
            
            var currentID = $(this).attr('id');
            var nextVideo = document.getElementById(currentID);
        
            var n = $(this).attr('data-wd-item');
            n = parseInt(n);
            
            //This if statments makes the player stop after the last item is played.
            if (n < listLength) {
                n++;
                
                // Send next source to the HTML5 player
                setNextSource.call(this);
                
            } else {
                nextVideo.pause();
                nextVideo.currentTime = 0;
                $(this).parents('.wd-stage').find('.vjs-big-play-button').css('visibility','visible');
            }
        
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
        		$(this).closest('.wd-player').find('.wd-thumb-tray').dequeue().stop().animate({ height: thumbTrayHeight });
        		$(this).addClass('wd-up-arrow');
        		$(this).closest('.wd-player').find('.wd-credits-container').addClass('wd-active');
        		
        	} else {
        	   //Make tray go up
                $(this).closest('.wd-player').find('.wd-thumb-tray').animate({ height: '0' }, 'normal', 'linear');
                $(this).removeClass('wd-up-arrow');
                $(this).closest('.wd-player').find('.wd-credits-container').removeClass('wd-active');

            }
        }); 
                        
        // When hover on drop down button, change the color of the credit container
        // The not-mobile class can be used when you want to do things only when on a computer. There is also a mobile class to target just mobile devices.
        $('.not-mobile .wd-thumb-dropdown').hover(
            function () {
                $(this).closest('.wd-player').find('.wd-credits-container').toggleClass('hide-thumbs');
            });

    });
    
    //For Flash: When video ends, play the next one.
    function stoppedPlaying(playerID)
    {
        var playerID = '#' + playerID

        //jQuery .length() starts counting at 1, so we need to subtract 1 to get the list to add up correctly with the way jQeury .eg() works.
        var listLength = jQuery(playerID).closest('.wd-player').find('.wd-thumb-list li').size() - 1;   
                
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
            var nextSrc = jQuery(playerID).closest('.wd-player').find('ul.wd-thumb-list').children('li').children('a').eq(n).attr('href');
                                    
            jQuery(playerID).externalInterface({method:'setNewSource', args:nextSrc});
            jQuery(playerID).closest('.wd-player').find('.wd-stage').attr('data-wd-item', n);
            
            // Set border around currently playing
            jQuery(playerID).closest('.wd-player').find('.wd-thumb-list .wd-active').removeClass('wd-active');
            jQuery(playerID).closest('.wd-player').find('.wd-thumb-list li').eq(n).children('a').addClass('wd-active');
            
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