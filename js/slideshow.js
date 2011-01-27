jQuery(document).ready(function($) {

    $('.wd-player.slideshow .wd-thumb-list a').click(function(e)
    {
        var newImageHref = $(this).attr('href')
        var slideshowHeight = $(this).closest('.wd-player').find('.wd-stage').css('height')
        var slideshowWidth = $(this).closest('.wd-player').find('.wd-stage').css('width')
        var newImageHeight = $(this).attr('data-wd-height')
        var newImageWidth = $(this).attr('data-wd-width')
        var currentImageHref = $(this).parents('.wd-player').find('.wd-slideshow-image').eq(0).attr('src')
                        
        //Test to see if clicked thumb is current image
        if ( newImageHref == currentImageHref ) {
            return;
        } else if ($('.wd-slideshow-image').is(':animated')) {
            return;
        } else {
            
            // Get the new image sizes
            fit_within_box(slideshowWidth, slideshowHeight, newImageWidth, newImageHeight);
            

            // Get first image and duplicate it
            $(this).closest('.wd-player').find('.wd-slideshow-image').eq(0).clone()
                // Now modify the duplicated image to be the new image. This is done so we only have to do one DOM insertion. 
                        .hide()
                        .attr('src', newImageHref)
                        .attr('data-wd-item',$(this).attr('data-wd-item'))
                        .appendTo('.wd-stage');
            
            $(this).closest('.wd-player').find('.wd-slideshow-image').eq(0).fadeOut('slow', function() 
            {
                $(this).remove();
            });
            $(this).closest('.wd-player').find('.wd-slideshow-image').eq(1).fadeIn('slow');            
        }
    
        e.preventDefault();    
    });
    
    function fit_within_box(box_width, box_height, width, height)
    {
        var new_width = width
        var new_height = height
        var aspect_ratio = parseInt(width) / parseInt(height)
    
        if (new_width > box_width)
        {
            new_width = box_width
            new_height = int(new_width / aspect_ratio)
        }
        
        if (new_height > box_height)
        {
            new_height = box_height
            new_width = int(new_height * aspect_ratio)
        }
        return (new_width, new_height)
    }
});