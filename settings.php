<?php
// Specify Hooks/Filters
add_action('admin_init', 'sampleoptions_init_fn' );
add_action('admin_menu', 'sampleoptions_add_page_fn');

        /*
		$arr = array("wdp_width" => "100%", 
		             "wdp_height" => "480px", 
		             "wdp_stage_color" => '#000000', 
		             "wdp_credit_container_border" => "#2C2C2C", 
		             "wdp_credit_container_color" => "#373636", 
		             'wdp_thumb_bg_color' => '#141414', 
		             'wdp_arrow_color' => '#EAEAEA', 
		             'wdp_active_item_color' => '#FFFFFF', 
		             'wdp_title_color' => '#FFFFFF', 
		             'wdp_credit_color' => '#999999',
		             'wdp_credit_container_alignment' => 'center'             
		             );
		*/

// Register our settings. Add the settings section, and settings fields
function sampleoptions_init_fn(){
	register_setting('wdp_options', 'wdp_options', 'wdp_options_validate' );
	add_settings_section('main_section', 'Main Settings', 'section_text_fn', __FILE__);
	add_settings_field('wdp_width', 'Default Width', 'wdp_width_fn', __FILE__, 'main_section');
	add_settings_field('wdp_height', 'Default Height', 'wdp_height_fn', __FILE__, 'main_section');
	add_settings_field('wdp_stage_color', "The color of the stage", 'wdp_stage_color_fn', __FILE__, 'main_section');
	add_settings_field('wdp_credit_container_border', "Credit Container's Top Border Color", 'wdp_credit_container_border_fn', __FILE__, 'main_section');
	add_settings_field('wdp_credit_container_color', 'Credit Container Color', 'wdp_credit_container_color_fn', __FILE__, 'main_section');
	add_settings_field('wdp_credit_container_alignment', 'Credit Text Alignment', 'wdp_credit_container_alignment_fn', __FILE__, 'main_section');
	add_settings_field('wdp_thumb_bg_color', 'Thumb Tray Background Color', 'wdp_thumb_bg_color_fn', __FILE__, 'main_section');
	add_settings_field('wdp_arrow_color', 'Next & Previous Arrow Colors', 'wdp_arrow_color_fn', __FILE__, 'main_section');
	add_settings_field('wdp_active_item_color', 'Active Item Color', 'wdp_active_item_color_fn', __FILE__, 'main_section');
	add_settings_field('wdp_title_color', 'Title Text Color', 'wdp_title_color_fn', __FILE__, 'main_section');
	add_settings_field('wdp_credit_color', 'Credit Text Color', 'wdp_credit_color_fn', __FILE__, 'main_section');
	
}

// Add sub page to the Settings Menu
function sampleoptions_add_page_fn() {
	add_options_page('Wiredrive Player Settings', 'Wiredrive Player', 'administrator', __FILE__, 'options_page_fn');
}

// ************************************************************************************************************

// Callback functions

// Section HTML, displayed before the first option
function  section_text_fn() {
	//echo '<p>Below are some examples of different option controls.</p>';
}

// TEXTBOX - Name: wdp_options[wdp_width]
function wdp_width_fn() {
	$options = get_option('wdp_options');
	echo "<input id='wdp_width' name='wdp_options[wdp_width]' size='10' type='text' value='{$options['wdp_width']}' />";
}

// TEXTBOX - Name: wdp_options[wdp_height]
function wdp_height_fn() {
	$options = get_option('wdp_options');
	echo "<input id='wdp_height' name='wdp_options[wdp_height]' size='10' type='text' value='{$options['wdp_height']}' />";
}

// TEXTBOX - Name: wdp_options[wdp_stage_color]
function wdp_stage_color_fn() {
	$options = get_option('wdp_options');
	echo "<div class='wdp-color-input-wrap'>";
	echo "<input id='wdp_stage_color' class='wdp-colorpicker' name='wdp_options[wdp_stage_color]' size='10' type='text' value='{$options['wdp_stage_color']}' />";
	echo "<span class='wdp-color-button'></span>";
	echo "<div class='wdp-color-picker-wrap'></div>";
	echo "</div>";
}

// TEXTBOX - Name: wdp_options[wdp_credit_container_border]
function wdp_credit_container_border_fn() {
	$options = get_option('wdp_options');
	echo "<div class='wdp-color-input-wrap'>";
	echo "<input id='wdp_credit_container_border' name='wdp_options[wdp_credit_container_border]' size='10' type='text' value='{$options['wdp_credit_container_border']}' />";
	echo "<span class='wdp-color-button'></span>";
	echo "<div class='wdp-color-picker-wrap'></div>";
	echo "</div>";	
}

// TEXTBOX - Name: wdp_options[wdp_credit_container_color]
function wdp_credit_container_color_fn() {
	$options = get_option('wdp_options');
    echo "<div class='wdp-color-input-wrap'>";	
	echo "<input id='wdp_credit_container_color' class='wdp-colorpicker' name='wdp_options[wdp_credit_container_color]' size='10' type='text' value='{$options['wdp_credit_container_color']}' />";
	echo "<span class='wdp-color-button'></span>";
	echo "<div class='wdp-color-picker-wrap'></div>";
	echo "</div>";
}

// RADIO - Name: wdp_options[wdp_credit_container_alignment]
function wdp_credit_container_alignment_fn() {
	$options = get_option('wdp_options');
	$items = array("Left", "Center", "Right");
	foreach($items as $item) {
		$checked = ($options['wdp_credit_container_alignment']==$item) ? ' checked="checked" ' : '';
		echo "<label><input ".$checked." value='$item' name='wdp_options[wdp_credit_container_alignment]' type='radio' /> $item</label><br />";
	}
}

// TEXTBOX - Name: wdp_options[wdp_thumb_bg_color]
function wdp_thumb_bg_color_fn() {
	$options = get_option('wdp_options');
    echo "<div class='wdp-color-input-wrap'>";	
	echo "<input id='wdp_thumb_bg_color' class='wdp-colorpicker' name='wdp_options[wdp_thumb_bg_color]' size='10' type='text' value='{$options['wdp_thumb_bg_color']}' />";
	echo "<span class='wdp-color-button'></span>";
	echo "<div class='wdp-color-picker-wrap'></div>";
	echo "</div>";	
}
// TEXTBOX - Name: wdp_options[wdp_arrow_color]
function wdp_arrow_color_fn() {
	$options = get_option('wdp_options');
	echo "<div class='wdp-color-input-wrap'>";
	echo "<input id='wdp_arrow_color' class='wdp-colorpicker' name='wdp_options[wdp_arrow_color]' size='10' type='text' value='{$options['wdp_arrow_color']}' />";
	echo "<span class='wdp-color-button'></span>";
	echo "<div class='wdp-color-picker-wrap'></div>";
	echo "</div>";
}
// TEXTBOX - Name: wdp_options[wdp_active_item_color]
function wdp_active_item_color_fn() {
	$options = get_option('wdp_options');
	echo "<div class='wdp-color-input-wrap'>";
	echo "<input id='wdp_active_item_color' class='wdp-colorpicker' name='wdp_options[wdp_active_item_color]' size='10' type='text' value='{$options['wdp_active_item_color']}' />";
	echo "<span class='wdp-color-button'></span>";
	echo "<div class='wdp-color-picker-wrap'></div>";
	echo "</div>";
}
// TEXTBOX - Name: wdp_options[wdp_title_color]
function wdp_title_color_fn() {
	$options = get_option('wdp_options');
	echo "<div class='wdp-color-input-wrap'>";
	echo "<input id='wdp_title_color' class='wdp-colorpicker' name='wdp_options[wdp_title_color]' size='10' type='text' value='{$options['wdp_title_color']}' />";
	echo "<span class='wdp-color-button'></span>";
	echo "<div class='wdp-color-picker-wrap'></div>";
	echo "</div>";
}
// TEXTBOX - Name: wdp_options[wdp_credit_color]
function wdp_credit_color_fn() {
	$options = get_option('wdp_options');
	echo "<div class='wdp-color-input-wrap'>";
	echo "<input id='wdp_credit_color' class='wdp-colorpicker' name='wdp_options[wdp_credit_color]' size='10' type='text' value='{$options['wdp_credit_color']}' />";
	echo "<span class='wdp-color-button'></span>";
	echo "<div class='wdp-color-picker-wrap'></div>";
	echo "</div>";
}

// Display the admin options page
function options_page_fn() {
?>
	<div class="wdp-settings wrap">
		<div class="icon32" id="icon-options-general"><br></div>
		<h2>Wiredrive Player Settings</h2>
		You can config the Wiredrive Player's appearance below.
		<form action="options.php" method="post">
		<?php settings_fields('wdp_options'); ?>
		<?php do_settings_sections(__FILE__); ?>
		<p class="submit">
			<input name="Submit" type="submit" class="button-primary" value="<?php esc_attr_e('Save Changes'); ?>" />
		</p>
		</form>
	</div>
<?php
}

// Validate user data for some/all of your input fields
function wdp_options_validate($input) {
	// Check our textbox option field contains no HTML tags - if so strip them out
	$input['wdp_width'] =  wp_filter_nohtml_kses($input['wdp_width']);	
	return $input; // return validated input
}
?>