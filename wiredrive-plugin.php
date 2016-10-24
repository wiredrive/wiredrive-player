<?php

/*********************************************************************************
* Copyright (c) 2010 IOWA, llc dba Wiredrive
* Authors Wiredrive
*
* This program is free software: you can redistribute it and/or modify
* it under the terms of the GNU Lesser General Public License as published by
* the Free Software Foundation, either version 3 of the License, or* (at your option) any later version.
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
	protected $pluginUrl = NULL;
	protected $rss = NULL;
	protected $media = NULL;
	protected $template = NULL;
	protected $items = NULL;
	protected $isImageReel = FALSE;
	protected $rewriteBase = 'wdp-assets';
	protected $postId = NULL;
	protected $mediaGroup = array();
    protected $jsonpUrl = '';
    protected $curl = null;
    protected $isCurlInit = false;

	/**
	 * Contruct
	 * Register the plugin and start the template class
	 */
	public function __construct()
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
	public function init()
	{
		$plugin_url = plugins_url('wiredrive-player');

		wp_enqueue_script('jquery');
		wp_enqueue_script('swfobject');

		wp_register_script(
            'wd-player', 
            ($plugin_url  . '/js/wd-player.js'), 
            'jquery', 
            '3.1.0'
        );
		wp_enqueue_script('wd-player');
		wp_enqueue_style(
            'wd-player', 
            ($plugin_url . '/css/wd-player.css')
        );
	}

	/**
	 * Header
	 * Load the custom CSS.
	 */
	public function header()
	{
		$plugin_basename = plugin_basename('wiredrive-player');
		$options = get_option('wdp_options');
		
		echo $this->renderHead();
	}

	/**
	 * Render the player
	 * Imports the RSS feed and builds the video player
	 *
	 * @return string
	 */
	public function render($atts, $content = null )
	{

        /*
         * Get the settings for the plugin
         */
        $wiredriveSettings = new Wiredrive_Plugin_Settings();
        $options =  $wiredriveSettings->getOptions();

		/*
         * Get the height and width from the shortcode
         */

        $shortcode = shortcode_atts(array(
            'theme' => 'inline-player',
            'height' => $options['height'],
            'width' => $options['width'],
            'autoslideshow' => 'off',
            'loop' => 'off',
            'autoplay' => 'off',
            'disablethumbs' => 'off',
            'hidethumbs' => 'off',
            'duration' => $options['slideshow_duration'],
            'linebreak' => '0',
            'thumbwidth' => '180',
            'thumbheight' => '180',
            'letterbox' => 'off',
            'thumbfit' => 'scale',
            'creditcount' => '1',
            'creditlabel' => 'off',
        ), $atts);

        //BACKWARDS COMPATABILITY
        //translate grid and grid-box themes. They don't mean anything anymore, but have
        //replacement options in the gallery-player:
        //
        // `grid` should be the same as `gallery-player` with default settings
        // `grid-box` should be the same as `gallery-player` with default settings + letterbox='on'
        //
        //the additional options were not available when grid and grid-box themes were, so
        //we shouldn't need to worry about removing old settings
        if ($shortcode['theme'] !== 'inline-player' && $shortcode['theme'] !== 'gallery-player') {
            if ($shortcode['theme'] === 'grid-box') {
                $shortcode['letterbox'] = 'on';
            }

            $shortcode['theme'] = 'gallery-player';
        }

        //legacy sometimes saved the 'px' with the height and width. remove it if they did.
        //the new frontend injects the px all on its own whereever it needs to.
        $shortcode['height'] = str_replace('px', '', $shortcode['height']);
        $shortcode['width'] = str_replace('px', '', $shortcode['width']);

		/*
         * Import the RSS feed
         */
		if (!$this->checkOrigin($content)) {
			$this->showError('Not a valid Wiredrive mRSS feed');
			return;
		}
		
        /*
         * check if the RSS feed is invalid
         */
		$result = $this->setUrl($content);
        if (! $result) {
			$this->showError('Invalid Feed');
			return;
		}

        $pluginUrl = $this->getPluginUrl();
        $attributeId = $this->getAttributeId();

        $this->template->setTpl('player.php')
             ->set('theme', $shortcode['theme'])
             ->set('linebreak', $shortcode['linebreak'])
             ->set('isLetterbox', $shortcode['letterbox'] === 'on')
             ->set('thumbWidth', $shortcode['thumbwidth'])
             ->set('thumbHeight', $shortcode['thumbheight'])
             ->set('slideshow', $shortcode['autoslideshow'] === 'on')
             ->set('duration', $shortcode['duration'])
             ->set('autoplay', $shortcode['autoplay'] === 'on')
             ->set('disableThumbs', $shortcode['disablethumbs'] === 'on')
             ->set('collapseThumbs', $shortcode['hidethumbs'] === 'on')
             ->set('loop', $shortcode['loop'] === 'on')
             ->set('options', $options)
             ->set('creditLabel', $shortcode['creditlabel'] === 'on')
             ->set('creditCount', $shortcode['creditcount'])
             ->set('attributeId', $attributeId)
             ->set('height', $shortcode['height'])
             ->set('width', $shortcode['width'])
             ->set('pluginUrl', $pluginUrl)
             ->set('thumbfit', $shortcode['thumbfit'])
             ->set('options', $options)
             ->set('jsonpUrl', $this->jsonpUrl)
             ->render();

        $this->closeCurl();
		return $this->getOutput();
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
	 *
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
	public function setUrl($url)
	{
        /* 
         * if rss url, parse the feed for the original presentation
         * url
         */
        if (strpos($url, 'rss') !== false) {
            $rss = fetch_feed($url);
            if (is_wp_error($rss)) {
                return false;
            }
            $tags = $rss->get_feed_tags(
                'http://wwww.wiredrive.com/rss/1/dtd', 'wp-data'
            );
            $tag  = current($tags);
            if (! $tag) {
                throw new RuntimeException(
                    'Rss feed is out of date, please update the feed'
                );
            }
            if (! isset($tag['data'])) {
                throw new RuntimeException('Invalid wd player url tag found');
            }
            $link = $tag['data'];
        } else {
            $link = $url;
        }
    
        $this->jsonpUrl = $link; 
        return true;
    }

	/**
	 * Make sure source of the feed is Wiredrive
	 */
	private function checkOrigin($url)
	{
	    $isCdn = strpos($url, 'wdcdn') !== false;
        $isApp = strpos($url, 'wiredrive') !== false;
        $isShort = strpos($url, 'wdrv.it') !== false;
        return $isCdn || $isApp || $isShort;
    }

	/**
	 * Set Media
	 * Get the Media enclosure from the rss feed
	 */
	private function setMedia($item)
	{
		$this->media = $item->get_enclosure();
	}

	/**
	 * Get Media
	 *
	 * @return SimplePie
	 */
	private function getMedia()
	{
		return $this->media;
	}
	
    /**
	 * Set Media Group
	 * Get the Media enclosure from the rss feed
	 *
	 * MediaGroup is an array of all the media:$group 
	 * elements for the item in the rss feed
	 */
	private function setMediaGroup($item, $group = 'thumbnail')
	{
		$this->mediaGroup = $item->get_item_tags(SIMPLEPIE_NAMESPACE_MEDIARSS,$group);
	}

	/**
	 * Get Media
	 *
	 * @return array
	 */
	private function getMediaGroup()
	{
		return $this->mediaGroup;
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
	 * Get Items
	 *
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
	 * Get Is image reel
	 *
	 * @return bool
	 */
	private function getIsImageReel()
	{
		return $this->isImageReel;
	}

	/**
	 * Render any error
	 */
	private function showError($message)
	{
		$this->template->setTpl('error.php')
                ->set('message', $message)
                ->render();
	}

	/**
	 * Render any error
	 */
	private function renderHead()
	{
	
	    /*
         * Get the settings for the plugin
         */
        $wiredriveSettings = new Wiredrive_Plugin_Settings();
		   	
        $this->template->setTpl('head.php')
                ->set('options', $wiredriveSettings->getOptions())
                ->set('pluginUrl', $this->getPluginUrl())
                ->render();
		  
        return $this->template->getOutput();

	}
	
	/**
	 * Get outout
	 *
	 * @return string
	 */
	private function getOutput()
	{
		return $this->template->getOutput();
	}

	/**
	 * Get post id
	 */
	private function getPostId()
	{
		return $this->postId;

	}
    
    /**
     * Initialize curl
     */
    private function initCurl()
    {
        $this->curl         = curl_init();
        $this->isCurlInit   = true;
        return $this;
    }

    /**
     * Get Curl resource, initializes if curl has not been started
     * yet.
     */
    private function getCurl()
    {
        if (! $this->isCurlInit) {
            $this->initCurl();
        }
        return $this->curl;
    }

    /**
     * Close the curl connection
     */
    private function closeCurl()
    {
        if (! $this->isCurlInit) {
            return $this;
        }
        curl_close($this->curl);
        return $this;
    }
}
