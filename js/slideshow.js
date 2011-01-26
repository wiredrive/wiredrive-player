jQuery(document).ready(function($) {

    $('.wd-player.slideshow .wd-thumb-list a').click(function(e)
    {
        var newImageHref = $(this).attr('href')
        var currentImageHref = $(this).parents('.wd-player').find('.wd-stage').children().eq(0).attr('src')
                
        //Test to see if clicked thumb is current image
        if ( newImageHref == currentImageHref ) {
            return;
        } else {
            $(this).parents('.wd-player').find('.wd-stage').children().eq(0).clone().attr('src', newImageHref).attr('rel',$(this).attr('rel')).ImageResize({ height: 300, width: 300}).appendTo('.wd-stage');
            $(this).parents('.wd-player').find('.wd-stage').children().eq(0).fadeOut('slow', function() 
            {
                $(this).parents('.wd-player').find('.wd-stage').children().eq(1).siblings().remove()
            });
            $(this).parents('.wd-player').find('.wd-stage').children().eq(1).fadeIn('slow');       
        }
    
        e.preventDefault();    
    });

});

(function( $ ) {

  $.fn.ImageResize = function( params ) {

    var aspectRatio = 0
      // Nasty I know but it's done only once, so not too bad I guess
      // Alternate suggestions welcome :)
      ,	isIE6 = $.browser.msie && (6 == ~~ $.browser.version)
      ;

    // We cannot do much unless we have one of these
    if ( !params.height && !params.width ) {
      return this;
    }

    // Calculate aspect ratio now, if possible
    if ( params.height && params.width ) {
      aspectRatio = params.width / params.height;
    }

    // Attach handler to load
    // Handler is executed just once per element
    // Load event required for Webkit browsers
    return this.one( "load", function() {

      // Remove all attributes and CSS rules
      this.removeAttribute( "height" );
      this.removeAttribute( "width" );
      this.style.height = this.style.width = "";

      var imgHeight = this.height
        ,	imgWidth = this.width
        ,	imgAspectRatio = imgWidth / imgHeight
        ,	bxHeight = params.height
        ,	bxWidth = params.width
        ,	bxAspectRatio = aspectRatio;
				
      // Work the magic!
      // If one parameter is missing, we just force calculate it
      if ( !bxAspectRatio ) {
        if ( bxHeight ) {
          bxAspectRatio = imgAspectRatio + 1;
        } else {
          bxAspectRatio = imgAspectRatio - 1;
        }
      }

      // Only resize the images that need resizing
      if ( (bxHeight && imgHeight > bxHeight) || (bxWidth && imgWidth > bxWidth) ) {

        if ( imgAspectRatio > bxAspectRatio ) {
          bxHeight = ~~ ( imgHeight / imgWidth * bxWidth );
        } else {
          bxWidth = ~~ ( imgWidth / imgHeight * bxHeight );
        }

        this.height = bxHeight;
        this.width = bxWidth;
      }
    })
    .each(function() {

      // Trigger load event (for Gecko and MSIE)
      if ( this.complete || isIE6 ) {
        $( this ).trigger( "load" );
      }
    });
  };
})( jQuery );