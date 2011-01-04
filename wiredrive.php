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
 * Wiredrive Plugin
 * Class that parses the shortcode and renders the html for the plugin
 *
 * Templates are run in this order: 
 *   player_start.php
 *   flash.php OR html5.php
 *   thumb_loop.php 
 *   Player_finish.php
 * 
 * Flash is used if the browser is Firefox or IE,
 * otherwise HTML5 is used.  Additional CSS is added is the
 * browser is on a mobile device (added in player_start.php)
 *
 * mRSS feeds are required to come from the Wiredrive CDN servers originating
 * from www.wdcdn.net, and are not cached locally (they are cached on the 
 * CDN already).
 *
 * mRSS is parsed by SimplePie built into Wordpress
 * 
 * HTML5 Video playback in controlled by a customized version of Video.js
 * http://videojs.com/
 *
 * Flash playback is controlled by a customized version of OVP
 * http://openvideoplayer.sourceforge.net/
 *
 */
 
class Wiredrive_Plugin
{

    /**
     * @string
     */
    protected $pluginUrl = NULL;
    protected $rss = NULL;
    protected $media = NULL;
    protected $template = NULL;

    /**
     * Contruct
     * Register the plugin and start the template class
     */
    function __construct()
    {
        if ( function_exists('plugins_url') ) {
            $this->pluginUrl = plugins_url('wiredrive-wordpress-video-player');
        }
        
        $this->template = new Wiredrive_Plugin_Template();
    }
	
	/**
	 * Load the various scripts and css that are required by the plugin.
	 */
	
    function wiredrive_player_enqueue_scripts()
    {
        if ( function_exists('plugins_url') ) {
            $plugin_url = plugins_url('wiredrive-wordpress-video-player');
        }

        wp_enqueue_script('jquery');

        wp_enqueue_script('swfobject');

        wp_register_script('jquery.scrollTo',
            ($plugin_url  . '/js/jquery.scrollTo-1.4.2-min.js'), 'jquery', '1.4.2');

        wp_enqueue_script('jquery.scrollTo');

        wp_register_script('jquery.externalinterface',
            ($plugin_url  . '/js/jquery.externalinterface.js'), 'jquery', '1.0');

        wp_enqueue_script('jquery.externalinterface');

        wp_register_script('videojs',
            ($plugin_url  . '/js/video.js'), false, '1.1.5-wdp');

        wp_enqueue_script('videojs');
        
        wp_register_script('player',
            ($plugin_url  . '/js/player.js'), 'jquery', '1');
            
       wp_enqueue_script('player');

        wp_enqueue_style('videojs_css',
            ($plugin_url  . '/css/video-js.css'));

        wp_enqueue_style('wirdrive_player_css',
            ($plugin_url  . '/css/wiredrive-player.css'));
    }


    /**
     * Render the player
     * Imports the RSS feed and builds the video player
     *
     * @return string
     */
    function render($atts, $content = null )
    {

        /*
         * Get the height and width from the URL
         */
        extract(shortcode_atts(array(
                    'height'            => '480px',
                    'width'             => '100%',
                    'hidethumbs'        => 'off',
                ), $atts));

        /*
         * Import the RSS feed
         */
        if (!$this->checkOrigin($content)) {
            $this->showError('Not a valid Wiredrive mRSS feed');
            return;
        }
        $this->setRss($content);

        /*
         * check if the RSS feed is invalid
         */
        if (is_null($this->getRss())) {
            $this->showError('Invalid Feed');
            return;
        }

        /*
         * Check if the RSS feed is empty
         */
        $items = $this->getRssItems();
        if (empty($items)) {
            $this->showError('Empty Feed');
            return;
        }

        /*
         * Get the media section for the first item of the rss feed
         */
        $first = current($this->getRssItems());
        $this->setMedia($first);
        
        /*
         * Make sure media section exists
         */
        if (is_null($this->getMedia())) {
            $this->showError('No Media section in feed');
            return;
        }

        /*
         * Begin Player Construction
         * This is calling player_start.php
         */
        $this->renderPlayerStart($height, $width, $hidethumbs);

        /*
         * Render out the video player
         */
        if ($this->useFlash()) {
            $this->renderFlash();
        } else {
            $this->renderHtml5($width, $height);
        }

        /*
         * Loop through all the items and show the thumbnails
         */
        $this->itemLoop();

        /*
         * Close off the player
         */
        $this->renderPlayerFinish();
        
        return $this->getOutput();

    }

    /**
     * Determine is user is on a mobile device
     *
     * @return bool
     */
    public function isMobile()
    {
        return (strpos($_SERVER['HTTP_USER_AGENT'], "iPhone")
            || strpos($_SERVER['HTTP_USER_AGENT'], "Android"));
    }

    /**
     * Determine if Flash player should be used
     *
     * @return bool
     */
    public function useFlash()
    {
        return strpos($_SERVER['HTTP_USER_AGENT'], "Firefox")
            || strpos($_SERVER['HTTP_USER_AGENT'], "IE");
    }

    /**
     * URL Path to this plugin
     *
     * @return string
     */
    public function getPluginUrl()
    {
        return $this->pluginUrl;
    }

    /**
     * Unique id for flash video attribute
     * @return string
     */
    public function getAttributeId()
    {
        return "content-id-".uniqid();
    }

    /**
     * Get the RSS feed and parse it with Wordpress built in
     * SimplePie fetch_feed() function
     */
    public function setRss($url)
    {        
        $rss = fetch_feed( $url );
        if (is_wp_error( $rss ) ) {
            $this->rss = NULL;
        } else {
            $this->rss = $rss;
			$rss->enable_order_by_date(false);
        }
    }
    
    /**
     * Make sure source of the feed is Wiredrive
     */
    private function checkOrigin($url) 
    {
        $domain = parse_url($url,PHP_URL_HOST);
        
        if ($domain != 'www.wdcdn.net') {
            return FALSE;
        }        
        return TRUE;
        
    }

    /**
     * @return SimplePie
     */
    public function getRss()
    {
        return $this->rss;
    }

    /**
     * @return SimplePie 
     */
    public function getRssItems()
    {
        return $this->getRss()->get_items();
    }

    /**
     * Get the Media enclosure from the rss feed
     */
    private function setMedia($item)
    {
        $this->media = $item->get_enclosure();
    }

    /**
     * @return SimplePie
     */
    private function getMedia()
    {
        return $this->media;
    }

    /**
     * Item Loop
     * Loop through every item in the rss feed and show 
     * the thumbnail and the credits
     */
    private function itemLoop()
    {

        //Item Loop Start
        if (  $this->getRss()->get_item_quantity() > 0 ) {

            $items = array();
            $this->template->setTpl('thumb_loop.php');

            foreach ( $this->getRssItems() as $row ) {

                $item = array();

                $this->setMedia($row);
                $item['title'] = $row->get_title();
                $item['link'] = (string) $this->getMedia()->get_link();
                $item['thumbnail'] = (string) $this->getMedia()->get_thumbnail(1);

                $credit = $this->getMedia()->get_credit();
                if (!is_null($credit)) {
                    $item['credit'] = $credit->get_name(0);
                    
                }
                $items[] = $item;

            }

            $this->template->set('items', $items)
                            ->render();

        }

    }

    /**
     * Render player start
     *
     * @var height int
     * @var widght int
     */
    private function renderPlayerStart($height, $width, $hidethumbs)
    {
   
        $this->template->setTpl('player_start.php')
                 ->set('height', $height)
                 ->set('width', $width)
                 ->set('hidethumbs', $hidethumbs)
                 ->set('mobile', $this->isMobile())
                 ->render();
    }

    /**
     * Render player finish
     */
    private function renderPlayerFinish()
    {
        
        $this->template->setTpl('player_finish.php')
                 ->render();
    }

    /**
     * Render the Flash embed
     */
    private function renderFlash()
    {
        
        $this->template->setTpl('flash.php')
            ->set('link', $this->getMedia()->get_link() )
            ->set('thumbnail', $this->getMedia()->get_thumbnail(0))
            ->set('attributeId', $this->getAttributeId())
            ->set('pluginUrl', $this->getPluginUrl())
            ->render();
                 

    }

    /**
     * Render the HTML5 video tag
     */
    private function renderHtml5($width, $height)
    {
        $this->template->setTpl('html5.php')
                 ->set('link', $this->getMedia()->get_link() )
                 ->set('thumbnail', $this->getMedia()->get_thumbnail(0))
                 ->set('attributeId', $this->getAttributeId())
                 ->set('pluginUrl', $this->getPluginUrl())
                 ->set('width', $width)
                 ->set('height', $height)
                 ->render();
            
    }

    /**
     * Render any error
     */
    private function showError($message)
    {
    
        $this->template->setTpl('error.php')
                 ->set('message',$message)
                 ->render();
                 
    }
    
    /**
     * Get Outout
     * @return string
     */
     private function getOutput() {
     
        return $this->template->getOutput();
     
     }

}