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
 * Wiredrive Url Validator 
 *
 * Super simple class to proxy a URL to validate the presentation and echo out the
 * shortcode for the requested player instance
 */
//keep the original shortcode conventions (attr="[on, off]"). It might not be neccessary for backwards
//compatibility, but for now it's probably just one less headache if we keep it the same
class WdUrlValidator
{
    /**
     * Parsed Headers
     *
     * @var array
     */
    public $headers = array();
    
    public function filter_bool($bool) {
        $ret = filter_var($bool, FILTER_VALIDATE_BOOLEAN);

        return $ret ? 'on' : 'off';
    }

    public function filter_int_zero($int) {
        $ret = filter_var($int, FILTER_VALIDATE_INT) === 0 || !filter_var($int, FILTER_VALIDATE_INT) === False && $int >= 0;

        return $ret ? $int : 1;
    }

    public function filter_theme($theme) {
        $ret = filter_var($theme, FILTER_SANITIZE_STRING);
        $validThemes = array('inline-player', 'gallery-player');

        return in_array($ret, $validThemes) ? $ret : 'inline-player';
    }

    public function filter_thumbfit($fit) {
        $ret = filter_var($fit, FILTER_SANITIZE_STRING);
        $valid = array('crop', 'scale');

        return in_array($ret, $valid) ? $ret : 'scale';
    }

    public function processUrl($url) {
        $urlParts      = parse_url($url);
        if (! isset($urlParts['path']) ||
            ! isset($urlParts['host'])) {
            $error = 'Malformed URL';
            echo json_encode(array(
                'error' => $error
            ));
            exit;
        }
        $isShort    = stripos($urlParts['host'], 'wdrv.it') !== false;
        $isWD       = stripos($urlParts['host'], 'wiredrive') !== false;
        $isWDCDN    = stripos($urlParts['host'], 'wdcdn.net') !== false;
        $dispatchList = array(
            'pld',
            'pr', 
            'plg',
            'ppd',
            'ppg',
        );
        $routeList = array(
            'present-project-gallery',
            'present-project-detail',
            'present-library-gallery',
            'present-library-detail',
            'present-reel',
            'rss-presentation-projects', 
            'rss-presentation-library', 
        );
        $path       = trim($urlParts['path'], '/');
        $pathParts  = explode('/', $path);
        $queryParts = array();
        if (isset($urlParts['query'])) {
            parse_str($urlParts['query'], $queryParts);
        }
        $routeKey = $pathParts[0];
        if (isset($queryParts['routeKey'])) {
            $routeKey = $queryParts['routeKey'];
        }
        $dotPos = strpos($routeKey, '.');
        if ($dotPos !== false) {
            $routeKey = str_replace('.jsonp', '', $routeKey); 
        }
        $isWordPress = $routeKey == 'present-wordpress';
        $isRss      = $routeKey == 'rss';
        $isDispatch = in_array($routeKey, $dispatchList);
        $isPres     = in_array($routeKey, $routeList);
       
        if ($isWordPress) {
            return $url; 
        }
        
        if (! $isWDCDN && 
            ! $isRss && 
            ! $isShort && 
            ! ($isWD && ($isDispatch || $isPres))
            ) {
            
            $error = 'Invalid Wiredrive URL';
            echo json_encode(array(
                'error' => $error
            ));
            exit;
        }
        
        if (! $isShort && ! $isDispatch && ! $isRss) {
            if ($dotPos !== false) {
                $url = str_replace('.jsonp', '', $url);
            }
            return $url;
        }
     
        if (! $isRss) {
            return $this->processRedirectUrl($url, $isShort);
        } else {
            return $this->processRssUrl($url);
        }
    }

    public function processRssUrl($url) {
        $curl = curl_init();
        curl_setopt_array(
            $curl,
            array(
                CURLOPT_RETURNTRANSFER => true,
                CURLOPT_TIMEOUT => 10,
                CURLOPT_URL => $url,
                CURLOPT_SSL_VERIFYPEER => false,
                CURLOPT_SSL_VERIFYHOST => false,
            )
        );
        $rssFeed = curl_exec($curl);
        if (empty($rssFeed)) {
            $error = 'Invalid Wiredrive RSS URL';
            echo json_encode(array(
                'error' => $error
            ));
            exit;
        }
        try {
            $rss = new SimpleXmlElement($rssFeed);
        } catch (Exception $error) {
            $error = 'Error in Wiredrive RSS';
            echo json_encode(array(
                'error' => $error
            ));
            exit;
        }
        $channel = $rss->channel;
        if (! $channel) {
            $error = 'Error in Wiredrive RSS';
            echo json_encode(array(
                'error' => $error
            ));
            exit;
        }
        $presUrl = null;
        foreach ($channel->children() as $child) {
            if ('link' === $child->getName()) {
                $presUrl = (string)$child;
                break;
            }
        }
        if (! $presUrl) {
            $error = 'Error in Wiredrive RSS';
            echo json_encode(array(
                'error' => $error
            ));
            exit;
        }
        return $presUrl;
    }

    /**
     * Function to split headers and create an associated array
     */
    public function processHeader($curl, $header)
    {
        $parts = explode(': ', $header);
        if (count($parts) < 2) {
            return strlen($header);
        }
        $key            = trim($parts[0]);
        $value          = trim($parts[1]);
        $this->headers[$key]  = $value;
        return strlen($header);
    }

    public function processRedirectUrl($url, $isShort) {
        /* fetch bitly url using curl */
        $curl    = curl_init(); 
         
        if ($isShort) {
            $url = str_replace('http://', 'https://', $url);
            /* Otherwise we would be redirected to short url again */
        }

        curl_setopt_array(
            $curl,
            array(
                CURLOPT_HEADER => true,
                CURLOPT_RETURNTRANSFER => true,
                CURLOPT_TIMEOUT => 10,
                CURLOPT_URL => $url,
                CURLOPT_HEADERFUNCTION => array($this, 'processHeader'),
                CURLOPT_SSL_VERIFYPEER => false,
                CURLOPT_SSL_VERIFYHOST => false,
            )
        );
        if ($isShort) {
            curl_exec($curl);
            $headers = $this->headers;
            $this->headers = array();
            if (! isset($headers['Location'])) {
                $error = 'Invalid Wiredrive short url';
                echo json_encode(array(
                    'error' => $error
                ));
                exit;
            }
            $dispatchUrl = $headers['Location'];
        } else {
            $dispatchUrl = $url;
        }

        /* make sure ssl enabled */
        $dispatchUrl = str_replace('http://', 'https://', $dispatchUrl); 

        /* app doens't support head request */
        curl_setopt($curl, CURLOPT_URL, $dispatchUrl);
        $result     = curl_exec($curl);
        $headers = $this->headers;
        $this->headers = array();
        if (! isset($headers['Location'])) {
            $error = 'Error fetching Wiredrive email url';
            echo json_encode(array(
                'error' => $error
            ));
            exit;
        }
        $link = $headers['Location'];
       
        /* if missing domain information, use dispatch url for
         * missing data
         */
        if ($link[0] == '/') {
            $urlParts   = parse_url($dispatchUrl);
            if (! isset($urlParts['path']) ||
                ! isset($urlParts['scheme']) ||
                ! isset($urlParts['host'])) {
                $error = 'Error in Wiredrive url';
                echo json_encode(array(
                    'error' => $error
                ));
                exit;
            }
            $link = $urlParts['scheme'] . '://' . $urlParts['host'] .
                    $link;
        }
        return $link;
    }

    public function process()
    {
        $url = false;
        if (isset($_POST['url'])) {
            $url = trim($_POST['url']);
        }
        $url = filter_var($url, FILTER_VALIDATE_URL);
        $options = array(
            'width' => filter_input(INPUT_POST, 'width', FILTER_VALIDATE_INT),
            'height' => filter_input(INPUT_POST, 'height', FILTER_VALIDATE_INT),
            'hidethumbs' => filter_input(INPUT_POST, 'hidethumbs', FILTER_CALLBACK, array('options' => array($this, 'filter_bool'))),
            'autoslideshow' => filter_input(INPUT_POST, 'autoslideshow', FILTER_CALLBACK, array('options' => array($this, 'filter_bool'))),
            'disablethumbs' => filter_input(INPUT_POST, 'disablethumbs', FILTER_CALLBACK, array('options' => array($this, 'filter_bool'))),
            'theme' => filter_input(INPUT_POST, 'theme', FILTER_CALLBACK, array('options' => array($this, 'filter_theme'))),
            'autoplay' => filter_input(INPUT_POST, 'autoplay', FILTER_CALLBACK, array('options' => array($this, 'filter_bool'))),
            'loop' => filter_input(INPUT_POST, 'loop', FILTER_CALLBACK, array('options' => array($this, 'filter_bool'))),
            'duration' => filter_input(INPUT_POST, 'slideshowduration', FILTER_VALIDATE_INT),
            'linebreak' => filter_input(INPUT_POST, 'linebreak', FILTER_VALIDATE_INT),
            'creditcount' => filter_input(INPUT_POST, 'creditcount', FILTER_CALLBACK, array('options' => array($this, 'filter_int_zero'))),
            'creditlabel' => filter_input(INPUT_POST, 'creditlabel', FILTER_CALLBACK, array('options' => array($this, 'filter_bool'))),
            'thumbwidth' => filter_input(INPUT_POST, 'thumbwidth', FILTER_VALIDATE_INT),
            'thumbheight' => filter_input(INPUT_POST, 'thumbheight', FILTER_VALIDATE_INT),
            'letterbox' => filter_input(INPUT_POST, 'letterbox', FILTER_CALLBACK, array('options' => array($this, 'filter_bool'))),
            'thumbfit' => filter_input(INPUT_POST, 'thumbfit', FILTER_CALLBACK, array('options' => array($this, 'filter_thumbfit'))),
        );

        if ($url == false) {
            //I don't know of any way to have this page return a 404 status code if the url is
            //not found or invalid, so until someone finds a friendly way of doing so,
            //this page will always return 200 codes and the caller must parse the body to see
            //If the json response has an `error` key, then something went wrong, otherwise the
            //shortcode will be in json respons under the `shortcode` key
            $error = 'Error processing supplied URL. Please make sure it is valid.';
            echo json_encode(array(
                'error' => $error
            ));
            exit;
        }
        
        $url    = $this->processUrl($url);
        if ((strpos($url, 'wordpress') !== false) && 
            (strpos($url, 'wdcdn') !== false)) {
            /* if wordpress url, make sure no ssl */
            $url = str_replace('https://', 'http://', $url);
        } else {
            /* make sure ssl enabled in final presentation url */
            $url = str_replace('http://', 'https://', $url);
        }
        
        $curl   = curl_init();
        curl_setopt_array(
            $curl,
            array(
                CURLOPT_RETURNTRANSFER => true,
                CURLOPT_TIMEOUT => 10,
                CURLOPT_URL     => $url,
                CURLOPT_SSL_VERIFYPEER => false,
                CURLOPT_SSL_VERIFYHOST => false,
            )
        );
        $result   = curl_exec($curl);
        $httpCode = curl_getinfo($curl, CURLINFO_HTTP_CODE);
        switch($httpCode) {
            case 403:
                $error = 'Presentation is not valid';
                break;
            case 404:
                $error = 'Presentation cannot be found';
                break;
            case 410:
                $error = 'Presentation is expired';
                break;
            case 500:
                $error = 'Error processing supplied url';
                break;
            case 302:
                $error = 'Password protected presentation cannot be used';
                break;
            default:
                $error = null;
        }
        if ($error) {
            echo json_encode(array(
                'error' => $error
            ));
            exit;
        }

        if (strpos($url, 'wordpress') === false) {
            $dom = new DomDocument();
            @$dom->loadHtml($result);

            $playerUrl = null;
            foreach ($dom->getElementsByTagName('meta') as $meta) {
                $attribs = $meta->attributes;
                $item    = $attribs->getNamedItem('property');
                if (isset($item->value) && ($item->value == 'wiredrive:wp-data')) {
                    $content = $attribs->getNamedItem('content');
                    $playerUrl = $content->value;
                    break;
                }
            }
            if (! $playerUrl) {
                echo json_encode(array(
                    'error' => 'Error discovering player url'
                ));
                exit;
            }
        } else {
            $playerUrl = $url;
        }

        // build out the shortcode for this player
        $text = '[wiredrive';

        foreach ($options as $key => $value) {
            if (isset($options[$key])) {
                $text .= ' ' . $key . '="' . $value . '"';
            }
        }

        $text .= ']' . $playerUrl . '[/wiredrive]';

        echo json_encode(array(
            'shortcode' => $text,
        ));
    }
}
