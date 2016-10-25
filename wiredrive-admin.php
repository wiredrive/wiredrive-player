<?php

/*********************************************************************************
* Copyright (c) 2010 IOWA, llc dba Wiredrive
* Authors Wiredrive
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
 * Wiredrive Plugin Admin
 *
 * Build the plugin admin panel.  Allows the users to add the Wiredrive player
 * shortcode within the MCE panel.
 */

class Wiredrive_Plugin_Admin
{

	protected $template = NULL;

	/**
	 * Construct
	 * Start the template class
	 */
	public function __construct()
	{
		$this->template = new Wiredrive_Plugin_Template();
        $settings = new Wiredrive_Plugin_Settings();
        $this->options = $settings->getOptions();
	}

	/**
	 * Init
	 * Load the various scripts and css that are required by the plugin.
	 */
	public function init()
	{
		if ( function_exists('plugins_url') ) {
			$plugin_url = plugins_url('wiredrive-player');

			wp_register_script('wd-admin',
				($plugin_url  . '/js/wd-admin.js'), 'jquery', '1.0');

			wp_enqueue_script('jquery');
			wp_enqueue_script('farbtastic'); //color picker script
			wp_enqueue_script('jquery-ui-core');
			wp_enqueue_script('jquery-ui-dialog');
			wp_enqueue_script('wd-admin');

			wp_enqueue_style('farbtastic'); //color picker script
			wp_enqueue_style('wd-admin', ($plugin_url  . '/css/wd-admin.css'), false, '1.2');
		}
	}

	/**
	 * Header
	 *
	 * @return string
	 */
	public function header()
	{
		$this->template
		      ->setTpl('admin.php')
              ->set('pluginUrl', plugins_url('wiredrive-player'))
              ->set('height', $this->options['height'])
              ->set('width', $this->options['width'])
              ->set('slideshowDuration', $this->options['slideshow_duration'])
		      ->render();

		echo $this->getOutput();

	}

	/**
	 * Footer
	 * This is the dialog box that opens when the TinyMCE button is clicked
	 *
	 * @return string
	 */
	public function footer()
	{

		$this->template
		      ->setTpl('dialog.php')
              ->set('height', $this->options['height'])
              ->set('width', $this->options['width'])
              ->set('duration', $this->options['slideshow_duration'])
		      ->render();

		echo $this->getOutput();
	}
	

	/**
	* Add settings link on plugin page
	*/ 
    public function settings_link($links, $file) 
    {     
        static $plugin = 'wiredrive-player/player.php';
                
        if ($file == $plugin){
            $settings_link = '<a href="options-general.php?page=wiredrive-player/wiredrive-settings.php">'.__("Settings").'</a>';
            array_unshift($links, $settings_link);
        }
        return $links;
    }	



	/**
	 * Get Outout
	 *
	 * @return string
	 */
	private function getOutput()
	{

		return $this->template->getOutput();

	}

}
