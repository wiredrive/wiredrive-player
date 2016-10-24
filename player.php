<?php
/*
Plugin Name: Wiredrive Player
Plugin URI: http://wordpress.org/extend/plugins/wiredrive-player/
Description: This plug-in allows you to embed Wiredrive video reels and image galleries into your WordPress-powered website.
Author: Wiredrive
Version:  3.1.0
Author URI: http://www.wiredrive.com/
*/

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
        
if (version_compare(PHP_VERSION, '5.0.0', '<')) {
            
    /**
     * Don't allow the plugin to activate if the server is running PHP below version 5.
     */
     
	$current = get_option('active_plugins');
	$plugin = 'wiredrive-player/player.php';
    
    if (in_array($plugin, $current)) {
		array_splice( $current, array_search( $plugin, $current ), 1 ); // Fixed Array-fu!
	}
	
	update_option('active_plugins', $current);

	add_action( 'admin_notices', create_function('', 'echo "<div class=\"error\">Your version of PHP does not support this plugin. Please contact your host. Plugin deactivated. </div>";'));

	return;
        
} else {

    include_once 'wiredrive-plugin.php';
    include_once 'wiredrive-button.php';
    include_once 'wiredrive-template.php';
    include_once 'wiredrive-settings.php';  
    include_once 'WdUrlValidator.php';  
    include_once ABSPATH . WPINC . '/feed.php';
    
    $wiredrivePlugin = new Wiredrive_Plugin();
    $wiredriveButton = new Wiredrive_Button();
            
    /**
     * Register public actions
     */
    if (!is_admin()) {
    	load_plugin_textdomain(array($wiredrivePlugin, 'render'),
    		                      NULL, dirname(plugin_basename(__FILE__)));
    	add_action('init', array($wiredrivePlugin, 'init'));
    	add_action('wp_head', array($wiredrivePlugin, 'header'));
    }
    
    /**
     * Load admin class and register actions
     */
    if (is_admin()) {    	  
        $wiredriveSettings = new Wiredrive_Plugin_Settings();	   
        add_action('admin_init', array($wiredriveSettings,'options_init' ));
        add_action('admin_menu', array($wiredriveSettings,'options_add_page'));

    	include_once 'wiredrive-admin.php';
    	$wiredriveAdmin = new Wiredrive_Plugin_Admin();
    	add_action('init', array($wiredriveAdmin, 'init'));
    	add_action('admin_head', array($wiredriveAdmin, 'header' ));
    	add_action('admin_footer', array($wiredriveAdmin, 'footer'));
        add_filter('plugin_action_links', array($wiredriveAdmin, 'settings_link'), 10, 2);    	
    
        $validator = new WdUrlValidator();  
        add_action('admin_action_wd-url-validator', array($validator, 'process'));
    }
    
    add_shortcode('wiredrive', array($wiredrivePlugin, 'render'));
    add_action('init', array($wiredriveButton, 'init'));
    add_filter('wp_feed_cache_transient_lifetime', create_function( '$a', 'return 5;' ) );

}
