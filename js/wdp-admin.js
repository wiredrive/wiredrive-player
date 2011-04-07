jQuery(document).ready(function($) {

    // Add Farbtastic to every color input
    $('.wdp-color-input-wrap').each( function() {
    
        var inputID = $(this).children('input').attr('id');
        jQuery('.' + inputID).farbtastic('#' + inputID);

	});
	
    //On click show the color picker
    var colorswatch = false;
	$('.wdp-color-button').click(function() {
        $(this).siblings('.wdp-color-picker-wrap').show();   
	});

    // If you click on the color picker, then don't close the box.
	$('.wdp-color-picker-wrap').mousedown(function() {
		// Oh, the swatch was clicked. Tell the document clicker to abort.
		colorswatch = true;
		return;
	});

	$(document).mousedown(function() {
		// Was the swatch clicked? If so, abort.
		if ( true == colorswatch ) return;
		$('.wdp-color-picker-wrap').hide()
	});
	
	//If the color is manually updated, then update the background color
	$('.wdp-color-input').keyup(function() {
        var color = $(this).val()
        $(this).css('background-color', color);
    });
	
});