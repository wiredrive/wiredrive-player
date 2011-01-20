<?php
/*
Plugin Name: Wiredrive Player
Plugin URI: https://github.com/wiredrive/wiredrive-player
Description: Import a Wiredrive mRSS feed and display it as either a HTML5 or Flash based video player.
Author: Wiredrive, Drew Baker, Daniel Bondurant
Version: 1.0
Author URI: http://www.wiredrive.com/
*/

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
 
include_once 'wiredrive.php';
include_once 'button.php';
include_once 'template.php';
include_once ABSPATH . WPINC . '/feed.php';

$wiredrivePlugin = new Wiredrive_Plugin();
$wiredriveButton = new Wiredrive_Button();

/**
 * Register public actions
 */
if (!is_admin()) {
    load_plugin_textdomain(array($wiredrivePlugin, 'render'),
        NULL, dirname(plugin_basename(__FILE__)));
    add_action('init', array($wiredrivePlugin, 'wiredrive_player_enqueue_scripts'));
}

/**
 * Load admin class and register actions
 */
if (is_admin()) {
    include_once 'wiredrive_admin.php';
    $wiredriveAdmin = new Wiredrive_Plugin_Admin();

    add_action('init', array($wiredriveAdmin, 'wiredrive_admin_enqueue_scripts'));
    add_action('admin_head', array($wiredriveAdmin, 'wiredrive_admin_header' ));
    add_action('admin_footer', array($wiredriveAdmin, 'wiredrive_admin_footer'));
}

add_shortcode('wiredrive', array($wiredrivePlugin, 'render'));
add_action('init', array($wiredriveButton, 'init'));
add_filter('wp_feed_cache_transient_lifetime', create_function( '$a', 'return 5;' ) );