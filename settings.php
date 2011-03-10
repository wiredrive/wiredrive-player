<?php

/*********************************************************************************
* Copyright (c) 2010 IOWA, llc dba Wiredrive
* Authors Drew Baker and Daniel Bondurant
*
* This program is free software: you can redistribute it and/or modify
* it under the terms of the GNU Lesser General Public License as published by
* the Free Software Foundation, either version 3 of the License, or
* (at your option) any later version.
*
* This program is distributed in the hope that it will be useful,
* but WITHOUT ANY WARRANTY; without even the implied warranty of
* MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
* GNU General Public License for more details.
*
* You should have received a copy of the GNU General Public License
* along with this program. If not, see <http://www.gnu.org/licenses/>.
********************************************************************************/

/**
 * Wiredrive Plugin Settings
 *
 * Build the global plugin settings and save in the database.
 */
class Wiredrive_Plugin_Settings
{
	private $defaults = array();
	private $options = array();

	public function __construct()
	{
		/*
         * Set up default values for plugin
         */
		$this->defaults = array(
			'wdp_width'                      => '100%',
			'wdp_height'                     => '480px',
			'wdp_stage_color'                => '#000000',
			'wdp_credit_container_border'    => '#2C2C2C',
			'wdp_credit_container_color'     => '#373636',
			'wdp_thumb_bg_color'             => '#141414',
			'wdp_arrow_color'                => '#EAEAEA',
			'wdp_active_item_color'          => '#FFFFFF',
			'wdp_title_color'                => '#FFFFFF',
			'wdp_credit_color'               => '#999999',
			'wdp_credit_container_alignment' => 'center',
		);

		/*
		 * Get options saved to the database
		 */
		$this->options = get_option('wdp_options');

	}

	/**
	 * Sample Options Init
	 * Register our settings. Add the settings section, and settings fields
	 */
	public function sampleoptions_init()
	{

		register_setting('wdp_options',
			'wdp_options',
			array($this, 'options_validate')
		);

		add_settings_section('main_section',
			'Main Settings',
			array($this, 'section_text'),
			__FILE__
		);

		add_settings_field('wdp_width',
			'Default Width',
			array($this, 'width'),
			__FILE__,
			'main_section'
		);

		add_settings_field('wdp_height',
			'Default Height',
			array($this, 'height'),
			__FILE__,
			'main_section'
		);

		add_settings_field('wdp_stage_color',
			'The color of the stage',
			array($this, 'stage_color'),
			__FILE__,
			'main_section'
		);

		add_settings_field('wdp_credit_container_border',
			"Credit Container's Top Border Color",
			array($this, 'credit_container_border'),
			__FILE__,
			'main_section'
		);

		add_settings_field('wdp_credit_container_color',
			'Credit Container Color',
			array($this, 'credit_container_color'),
			__FILE__,
			'main_section'
		);

		add_settings_field('wdp_credit_container_alignment',
			'Credit Text Alignment',
			array($this, 'credit_container_alignment'),
			__FILE__,
			'main_section'
		);

		add_settings_field('wdp_thumb_bg_color',
			'Thumb Tray Background Color',
			array($this, 'thumb_bg_color'),
			__FILE__,
			'main_section'
		);

		add_settings_field('wdp_arrow_color',
			'Next & Previous Arrow Colors',
			array($this, 'arrow_color'),
			__FILE__,
			'main_section'
		);

		add_settings_field('wdp_active_item_color',
			'Active Item Color',
			array($this, 'active_item_color'),
			__FILE__,
			'main_section'
		);

		add_settings_field('wdp_title_color',
			'Title Text Color',
			array($this, 'title_color'),
			__FILE__,
			'main_section'
		);

		add_settings_field('wdp_credit_color',
			'Credit Text Color',
			array($this, 'credit_color'),
			__FILE__,
			'main_section'
		);

	}

	/**
	 * Section Text
	 * Defaults to main_section on plugin page
	 */
	function section_text() { }

	/**
	 * Sample Options Add
	 * Add sub page to the Settings Menu
	 */
	public function sampleoptions_add_page()
	{
		add_options_page('Wiredrive Player Settings', '
		                  Wiredrive Player', 
		                 'administrator', 
		                 __FILE__, 
		                 array($this, 'options_page')
		                 );
	}

	/**
	 * Width
	 * input type      : textbox
	 * name            : wdp_options[wdp_width]
	 */
	public function width()
	{
		$width = $this->getValue('wdp_width');

		echo "<input id='wdp_width' name='wdp_options[wdp_width]' size='10' type='text' value='" .
			$width . "' />";
	}

	/**
	 * Height
	 * input type      : textbox
	 * name            : wdp_options[wdp_height]
	 */
	public function height()
	{
		$height = $this->getValue('wdp_height');

		echo "<input id='wdp_height' name='wdp_options[wdp_height]' size='10' type='text' value='" .
			$height . "' />";
	}

	/**
	 * Stage Color
	 * input type      : textbox
	 * name            : wdp_options[wdp_stage_color]
	 */
	public function stage_color()
	{
		$wdp_stage_color = $this->getValue('wdp_stage_color');

		echo "<div class='wdp-color-input-wrap'>";
		echo "<input id='wdp_stage_color' class='wdp-colorpicker' name='wdp_options[wdp_stage_color]' size='10' type='text' value='" .
			$wdp_stage_color . "' />";
		echo "<span class='wdp-color-button'></span>";
		echo "<div class='wdp-color-picker-wrap'></div>";
		echo "</div>";
	}

	/**
	 * Credit Container Border
	 * input type      : textbox
	 * name            : wdp_options[wdp_credit_container_border]
	 */
	public function credit_container_border()
	{
		$wdp_credit_container_border = $this->getValue('wdp_credit_container_border');

		echo "<div class='wdp-color-input-wrap'>";
		echo "<input id='wdp_credit_container_border' name='wdp_options[wdp_credit_container_border]' size='10' type='text' value='" .
			$wdp_credit_container_border . "' />";
		echo "<span class='wdp-color-button'></span>";
		echo "<div class='wdp-color-picker-wrap'></div>";
		echo "</div>";
	}

	/**
	 * Credit Container Color
	 * input type      : textbox
	 * name            : wdp_options[wdp_credit_container_color]
	 */
	public function credit_container_color()
	{
		$wdp_credit_container_border = $this->getValue('wdp_credit_container_border');

		echo "<div class='wdp-color-input-wrap'>";
		echo "<input id='wdp_credit_container_color' class='wdp-colorpicker' name='wdp_options[wdp_credit_container_color]' size='10' type='text' value='" .
			$wdp_credit_container_border ."' />";
		echo "<span class='wdp-color-button'></span>";
		echo "<div class='wdp-color-picker-wrap'></div>";
		echo "</div>";
	}

	/**
	 * Credit Container Alignment
	 * input type      : radio
	 * name            : wdp_options[wdp_credit_container_alignment]
	 */
	public function credit_container_alignment()
	{
		$wdp_credit_container_border = $this->getValue('wdp_credit_container_border');

		$items = array("Left", "Center", "Right");
		foreach ($items as $item) {
			$checked = '';
			if ($wdp_credit_container_border == $item) {
				$checked = 'checked="checked"';
			}

			echo "<label><input ".
				$checked. " value='" .
				$item . "' name='wdp_options[wdp_credit_container_alignment]' type='radio' /> " .
				$item . "</label><br />";
		}
	}

	/**
	 * Thumb Background Color
	 * input type      : textbox
	 * name            : wdp_options[wdp_thumb_bg_color]
	 */
	public function thumb_bg_color()
	{
		$wdp_thumb_bg_color = $this->getValue('wdp_thumb_bg_color');

		echo "<div class='wdp-color-input-wrap'>";
		echo "<input id='wdp_thumb_bg_color' class='wdp-colorpicker' name='wdp_options[wdp_thumb_bg_color]' size='10' type='text' value='" .
			$wdp_thumb_bg_color ."' />";
		echo "<span class='wdp-color-button'></span>";
		echo "<div class='wdp-color-picker-wrap'></div>";
		echo "</div>";
	}
	/**
	 * Arrow Color
	 * input type      : textbox
	 * name            : wdp_options[wdp_arrow_color]
	 */
	public function arrow_color()
	{
		$wdp_arrow_color = $this->getValue('wdp_arrow_color');

		echo "<div class='wdp-color-input-wrap'>";
		echo "<input id='wdp_arrow_color' class='wdp-colorpicker' name='wdp_options[wdp_arrow_color]' size='10' type='text' value='" .
			$wdp_arrow_color ."' />";
		echo "<span class='wdp-color-button'></span>";
		echo "<div class='wdp-color-picker-wrap'></div>";
		echo "</div>";
	}
	/**
	 * Active Item Color
	 * input type      : textbox
	 * name            : wdp_options[wdp_active_item_color]
	 */
	public function active_item_color()
	{
		$wdp_active_item_color = $this->getValue('wdp_active_item_color');

		echo "<div class='wdp-color-input-wrap'>";
		echo "<input id='wdp_active_item_color' class='wdp-colorpicker' name='wdp_options[wdp_active_item_color]' size='10' type='text' value='" .
			$wdp_active_item_color ."' />";
		echo "<span class='wdp-color-button'></span>";
		echo "<div class='wdp-color-picker-wrap'></div>";
		echo "</div>";
	}
	/**
	 * Title Color
	 * input type      : textbox
	 * Name            : wdp_options[wdp_title_color]
	 */
	public function title_color()
	{
		$wdp_title_color = $this->getValue('wdp_title_color');

		echo "<div class='wdp-color-input-wrap'>";
		echo "<input id='wdp_title_color' class='wdp-colorpicker' name='wdp_options[wdp_title_color]' size='10' type='text' value='" .
			$wdp_title_color ."' />";
		echo "<span class='wdp-color-button'></span>";
		echo "<div class='wdp-color-picker-wrap'></div>";
		echo "</div>";
	}
	/**
	 * Create Color
	 * input type      : textbox
	 * name            : wdp_options[wdp_credit_color]
	 */
	public function credit_color()
	{
		$wdp_credit_color = $this->getValue('wdp_credit_color');

		echo "<div class='wdp-color-input-wrap'>";
		echo "<input id='wdp_credit_color' class='wdp-colorpicker' name='wdp_options[wdp_credit_color]' size='10' type='text' value='" .
			$wdp_credit_color ."' />";
		echo "<span class='wdp-color-button'></span>";
		echo "<div class='wdp-color-picker-wrap'></div>";
		echo "</div>";
	}

	/**
	 * Options Validate
	 * Validate user data for some/all of your input fields
	 */
	public function options_validate($input)
	{
		/*
		 * Filter textbox option fields to prevent HTML tags
		 */
		$input['wdp_width']             = wp_filter_nohtml_kses($input['wdp_width']);
		$input['wdp_height']            = wp_filter_nohtml_kses($input['wdp_height']);
		$input['wdp_stage_color']       = wp_filter_nohtml_kses($input['wdp_stage_color']);
		$input['wdp_credit_container_border'] = wp_filter_nohtml_kses($input['wdp_credit_container_border']);
		$input['wdp_credit_container_border'] = wp_filter_nohtml_kses($input['wdp_credit_container_border']);
		$input['wdp_thumb_bg_color']    = wp_filter_nohtml_kses($input['wdp_thumb_bg_color']);
		$input['wdp_arrow_color']       = wp_filter_nohtml_kses($input['wdp_arrow_color']);
		$input['wdp_active_item_color'] = wp_filter_nohtml_kses($input['wdp_active_item_color']);
		$input['wdp_title_color']       = wp_filter_nohtml_kses($input['wdp_title_color']);
		$input['wdp_credit_color']      = wp_filter_nohtml_kses($input['wdp_credit_color']);

		return $input;
	}

	/**
	 * Options Page
	 * Display the admin options page
	 */
	public function options_page()
	{
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

	private function getValue($option)
	{
		if (isset($this->options[$option])) {
			return $this->options[$option];
		}

		return $this->defaults[$option];
	}

}