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
    //if the request was successful.
    //The current way of checking for an error is the content body will simply be the string 'INVALID_URI'
    echo 'INVALID_URI'; die;
}

$contents = @file_get_contents($url, false, null, -1, 57344); //woooo magic numbers!
if ($contents == false) {
    echo 'INVALID_URI'; die;
}

// build out the shortcode for this player
$text = '[wiredrive';

foreach ($options as $key => $value) {
    if ($options[$key]) {
        $text .= ' ' . $key . '="' . $value . '"';
    }
}

$text .= ']' . $url . '[/wiredrive]';

echo $text;
