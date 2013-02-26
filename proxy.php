<?

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
 * Wiredrive Proxy 
 *
 * Super simple page to proxy a URL to validate the presentation and echo out the
 * shortcode for the requested player instance
 */
//keep the original shortcode conventions (attr="[on, off]"). It might not be neccessary for backwards
//compatibility, but for now it's probably just one less headache if we keep it the same
function filter_bool($bool) {
    $ret = filter_var($bool, FILTER_VALIDATE_BOOLEAN);

    return $ret ? 'on' : 'off';
}

function filter_theme($theme) {
    $ret = filter_var($theme, FILTER_SANITIZE_STRING);
    $validThemes = array('inline-player');

    return in_array($ret, $validThemes) ? $ret : 'inline-player';
}

function processUrl($url) {
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
    $isDispatch = stripos($urlParts['path'], 'pld') !== false ||
                  stripos($urlParts['path'], 'pr') !== false ||
                  stripos($urlParts['path'], 'plg') !== false ||
                  stripos($urlParts['path'], 'ppd') !== false ||
                  stripos($urlParts['path'], 'ppg') !== false;
    $isWD       = stripos($urlParts['host'], 'wiredrive') !== false;
    if (! $isWD && ! $isShort && ! $isDispatch) {
        $error = 'Invalid Wiredrive URL';
        echo json_encode(array(
            'error' => $error
        ));
        exit;
    }
    
    if (! $isShort && ! $isDispatch) {
        return $url;
    }
    
    /* fetch bitly url using curl */
    $curl    = curl_init(); 
    $headers = array();
    
    /* callback to stash headers instead of parsing */
    $headerCallback = function($curl, $header) use (&$headers){
        $parts = explode(': ', $header);
        if (count($parts) < 2) {
            return strlen($header);
        }
        $key            = trim($parts[0]);
        $value          = trim($parts[1]);
        $headers[$key]  = $value;
        return strlen($header);
    };
    curl_setopt_array(
        $curl,
        array(
            CURLOPT_HEADER => true,
            CURLOPT_RETURNTRANSFER => true,
            CURLOPT_TIMEOUT => 10,
            CURLOPT_URL => $url,
            CURLOPT_HEADERFUNCTION => $headerCallback
        )
    );
    if ($isShort) {
        curl_setopt($curl, CURLOPT_NOBODY, true);
        curl_exec($curl);
        if (! isset($headers['Location'])) {
            $error = 'Invalid wiredrive short url: ' . $url;
            echo json_encode(array(
                'error' => $error
            ));
            exit;
        }
        $dispatchUrl = $headers['Location'];
    } else {
        $dispatchUrl = $url;
    }

    /* app doens't support head request */
    curl_setopt($curl, CURLOPT_NOBODY, false);
    curl_setopt($curl, CURLOPT_URL, $dispatchUrl);
    $headers    = array();
    $result     = curl_exec($curl);
    if (! isset($headers['Location'])) {
        $error = 'Error fetching wiredrive email url: ' . $url;
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
            $error = 'Error parsing wiredrive url: ' . $url;
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

$url = filter_input(INPUT_GET, 'url', FILTER_VALIDATE_URL);
$options = array(
    'width' => filter_input(INPUT_GET, 'width', FILTER_VALIDATE_INT),
    'height' => filter_input(INPUT_GET, 'height', FILTER_VALIDATE_INT),
    'hidethumbs' => filter_input(INPUT_GET, 'hidethumbs', FILTER_CALLBACK, array('options' => 'filter_bool')),
    'autoslideshow' => filter_input(INPUT_GET, 'autoslideshow', FILTER_CALLBACK, array('options' => 'filter_bool')),
    'disablethumbs' => filter_input(INPUT_GET, 'disablethumbs', FILTER_CALLBACK, array('options' => 'filter_bool')),
    'theme' => filter_input(INPUT_GET, 'theme', FILTER_CALLBACK, array('options' => 'filter_theme')),
    'autoplay' => filter_input(INPUT_GET, 'autoplay', FILTER_CALLBACK, array('options' => 'filter_bool')),
    'loop' => filter_input(INPUT_GET, 'loop', FILTER_CALLBACK, array('options' => 'filter_bool')),
    'duration' => filter_input(INPUT_GET, 'slideshowduration', FILTER_VALIDATE_INT)
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
$url  = processUrl($url);
$curl = curl_init();
curl_setopt_array(
    $curl,
    array(
        CURLOPT_RETURNTRANSFER => true,
        CURLOPT_TIMEOUT => 10,
        CURLOPT_URL     => $url,
    )
);
$result   = curl_exec($curl);
$httpCode = curl_getinfo($curl, CURLINFO_HTTP_CODE);
switch($httpCode) {
    case 403:
        $error = 'Presentation is not valid';
        break;
    case 404:
        $error = 'Presentation is cannot be found';
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

// build out the shortcode for this player
$text = '[wiredrive';

foreach ($options as $key => $value) {
    if ($options[$key]) {
        $text .= ' ' . $key . '="' . $value . '"';
    }
}

$text .= ']' . $url . '[/wiredrive]';

echo json_encode(array(
    'shortcode' => $text,
));
