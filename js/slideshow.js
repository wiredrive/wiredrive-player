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
    
    $('.wd-player.slideshow .wd-thumb-list a').click(function(e)
    {
        var newImageHref = $(this).attr('href')
        var slideshowHeight = $(this).closest('.wd-player').find('.wd-stage').height()
        var slideshowWidth = $(this).closest('.wd-player').find('.wd-stage').width()
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
                        .appendTo('.wd-stage');
            
            $(this).closest('.wd-player').find('.wd-slideshow-image').eq(0).fadeOut('slow', function() 
            {
                $(this).remove();
            });
            $(this).closest('.wd-player').find('.wd-slideshow-image').eq(1).fadeIn('slow');            
        }
    
        e.preventDefault();    
    });
    
});