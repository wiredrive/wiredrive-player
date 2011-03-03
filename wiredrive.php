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
 * HTML5 Video playback in controlled by a the native browser player.
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
    protected $items = NULL;
    protected $isImageReel = FALSE;
    protected $isSwfReel = FALSE;
    protected $rewriteBase = 'wdp-assets';
    protected $postId = NULL;

    /**
     * Contruct
     * Register the plugin and start the template class
     */
    function __construct()
    {
        if ( function_exists('plugins_url') ) {
            $this->pluginUrl = plugins_url('wiredrive-player');
        }
        
        $this->template = new Wiredrive_Plugin_Template();
        
        /*
         * Get the post id from wordpress
         */
        $this->postId = the_Id();
    }
	
	/**
	 * Load the various scripts and css that are required by the plugin.
	 */
	
    function wiredrive_player_enqueue_scripts()
    {
        $plugin_url = plugins_url('wiredrive-player');

        wp_enqueue_script('jquery');

        wp_enqueue_script('swfobject');

        wp_register_script('jquery.scrollTo',
            ($plugin_url  . '/js/jquery.scrollTo-1.4.2-min.js'), 'jquery', '1.4.2');

        wp_enqueue_script('jquery.scrollTo');
        
        wp_register_script('player',
            ($plugin_url  . '/js/player.js'), 'jquery', '1.1');
            
        wp_enqueue_script('player');
        
        wp_enqueue_style('wirdrive_player_css',
            ($plugin_url . '/css/wiredrive-player.css'));
    }
	
	/**
	 * Load the custom CSS.
	 */

    function wiredrive_player_header() 
    {
        $plugin_basename = plugin_basename('wiredrive-player');
        $options = get_option('wdp_options');
        include_once WP_PLUGIN_DIR . '/' . $plugin_basename . '/css/wiredrive-player-custom-css.php';
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
        $options = get_option('wdp_options');
        extract(shortcode_atts(array(
                    'height'            => $options['wdp_player_height'],
                    'width'             => $options['wdp_player_width'],
                    'hidethumbs'        => 'off',
                    'autoslideshow'     => 'off',
                    'theme'             => 'player'
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
         * Loop through all the RSS items and build an 
         * array for use in the templates
         */
        $this->itemLoop();

        /*
         * Begin Player Construction
         * This is calling player_start.php
         */
        $this->renderPlayerStart($width, $height, $hidethumbs, $autoslideshow, $theme);

        /*
         * Render out the video player or image slideshow
         */
        $this->renderMediaPlayer($width, $height);

        /*
         * Loop through all the items and show the thumbnails
         */
        if ($this->getIsSwfReel() == 0) {
            $this->renderThumbnails();
        }

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
            || strpos($_SERVER['HTTP_USER_AGENT'], "IE")
            || strpos($_SERVER['HTTP_USER_AGENT'], "Chrome");
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
     * Add rewrite rules to wordpress wp_rewrite object
     * so the plugin can create permalinks for assets 
     * in the RSS feeds
     */
    function setRewrite($rules)
    {
    	$newrules = array();
        $rule = $this->rewriteBase .'/(\d*)/(.*)$';
    	$newrules[$rule] = 'index.php?'. $this->rewriteBase. '=$matches[2]&p=$matches[1]';
    	return $newrules + $rules;
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
    private function getRss()
    {
        return $this->rss;
    }

    /**
     * @return SimplePie 
     */
    private function getRssItems()
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
     * Items from the RSS formated as an array
     * for the template top display
     */ 
    private function setItems($items)
    {
        $this->items = $items;
    }
    
    /**
     * @return array
     */
    private function getItems()
    {
        return $this->items;
    } 
    
    /**
     * RSS feed consists entirely of images
     */ 
    private function setIsImageReel($isImageReel)
    {
        $this->isImageReel = $isImageReel;
    }
    
    /**
     * @return bool
     */
    private function getIsImageReel()
    {
        return $this->isImageReel;
    } 
    
    /**
     * RSS feed consists entirely of swf or flv
     */ 
    private function setIsSwfReel($isSwfReel)
    {
        $this->isSwfReel = $isSwfReel;
    }
    
    /**
     * @return bool
     */
    private function getIsSwfReel()
    {
        return $this->isSwfReel;
    } 
    
    /**
     * Render the media player.
     * If RSS feed is entirely image then use image.php
     * otherwise use Flash or HTML5 depending on the browser 
     */
    private function renderMediaPlayer($width, $height)
    {
        
    
        if ($this->getIsImageReel()) {
            $this->renderImage($width, $height);
        } elseif ($this->getIsSwfReel()) {
            $this->renderSwf($width, $height);
        } else if ($this->useFlash()) {
            $this->renderFlash();
        } else {
            $this->renderHtml5($width, $height);
        }
        
    }

    /**
     * Item Loop
     * Loop through every item in the rss feed and show 
     * the thumbnail and the credits
     */
    private function itemLoop()
    {

        $isImage = 0;
        $isSwf = 0;
        
        if (  $this->getRss()->get_item_quantity() > 0 ) {

            $items = array();

            foreach ( $this->getRssItems() as $row ) {

                $item = array();
                
                /*
                 * parse the first part of the mime type to check
                 * if the item is an image.
                 */
                $mime_type = (string) $this->getMedia()->get_type();
                $mime_type_parts = explode('/',$mime_type);
        
                if ($mime_type_parts[0] == 'image') {
                    $isImage = 1;
                } else {
                    $isImage = 0;
                }
                
                /*
                 * parse the second part of the mime type to check
                 * if the item is an swf or flv.
                 */ 
                if ($mime_type_parts[1] == 'x-shockwave-flash' || $mime_type_parts[1] == 'x-flv') {
                    $isSwf = 1;
                } else {
                    $isSwf = 0;
                }   
            
                $this->setMedia($row);
                $media = $this->getMedia();
                
                $item['title'] = $row->get_title();
                $item['link'] = $media->get_link();
                $item['height'] = $media->get_height();
                $item['width'] = $media->get_width();
                $item['thumbnail_sm'] = $media->get_thumbnail(1);
                $item['thumbnail_lg'] = $media->get_thumbnail(0);
                $item['description'] = $row->get_description();

                $credits = $media->get_credits();
                
                if (!is_null($credits)) {
                    foreach($media->get_credits() as $credit) {                        
                        $item['credits'][$credit->get_role()] = $credit->get_name();
                    }
                }
                  
                $items[] = $item;

            }
            
            $this->setItems($items);
            
            /*
             * This will be set to 1 if all mime types for the feed are images
             */          
            $this->setIsImageReel($isImage);
            $this->setIsSwfReel($isSwf);
            
        }

    }

    /**
     * Render player start
     *
     * @var height int
     * @var widght int
     */
    private function renderPlayerStart($width, $height, $hidethumbs, $autoslideshow, $theme)
    {
   
        $this->template->setTpl('player_start.php')
                 ->set('height', $height)
                 ->set('width', $width)
                 ->set('hidethumbs', $hidethumbs)
                 ->set('autoslideshow', $autoslideshow)
                 ->set('theme', $theme)
                 ->set('mobile', $this->isMobile())
                 ->set('slideshow', ($this->getIsImageReel()))
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
        
        /*
         * Get the first item from the item list
         */
        $items = $this->getItems();
        $first = $items[0];
        
        $this->template->setTpl('flash.php')
                 ->set('link', $first['link'])
                 ->set('thumbnail', $first['thumbnail_lg'])
                 ->set('attributeId', $this->getAttributeId())
                 ->set('pluginUrl', $this->getPluginUrl())
                 ->set('width', $first['width'])
                 ->set('height', $first['height'])
                 ->render();
                 

    }

    /**
     * Render the HTML5 video tag
     */
    private function renderHtml5($width, $height)
    {
    
        /*
         * Get the first item from the item list
         */
        $items = $this->getItems();
        $first = $items[0];
        
        $this->template->setTpl('html5.php')
                 ->set('link', $first['link'])
                 ->set('thumbnail', $first['thumbnail_lg'])
                 ->set('attributeId', $this->getAttributeId())
                 ->set('pluginUrl', $this->getPluginUrl())
                 ->set('width', $width)
                 ->set('height', $height)
                 ->render();
            
    }

    /**
     * Render the image tag
     */
    private function renderImage($width, $height)
    {
    
        /*
         * Get the first item from the item list
         */
        $items = $this->getItems();
        $first = $items[0];
        
        $this->template->setTpl('image.php')
                 ->set('link', $first['link'])
                 ->set('thumbnail', $first['thumbnail_lg'])
                 ->set('attributeId', $this->getAttributeId())
                 ->set('pluginUrl', $this->getPluginUrl())
                 ->set('width', $first['width'])
                 ->set('height', $first['height'])
                 ->render();
            
    }
    
    /**
     * Render the image tag
     */
    private function renderSwf($width, $height)
    {
        /*
         * Get the first item from the item list
         */
        $items = $this->getItems();
        $first = $items[0];
        
        $this->template->setTpl('swf.php')
                 ->set('base_url', get_bloginfo('url'))
                 ->set('asset_dir', $this->rewriteBase)
                 ->set('title', $first['title'])
                 ->set('attributeId', $this->getAttributeId())
                 ->set('pluginUrl', $this->getPluginUrl())
                 ->set('width', $first['width'])
                 ->set('height', $first['height'])
                 ->set('postId',$this->getPostId())
                 ->render();
            
    }
    
    /**
     * Render thumbnail bar
     */
    private function renderThumbnails()
    {
        $this->template->setTpl('thumb_loop.php');
        $this->template->set('items', $this->getItems())
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
    
    /**
     * Get Post id
     */
    private function getPostId() {
    
        return $this->postId;
        
    }

}