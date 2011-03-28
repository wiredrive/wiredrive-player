<?

/*********************************************************************************
* Copyright (c) 2010 IOWA, llc dba Wiredrive
* Authors Drew Baker and Daniel Bondurant
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
 * Super simple page to proxy a URL and echo out the contents. 
 */
$rss = filter_input( INPUT_GET  , 'url', FILTER_VALIDATE_URL);

if ($rss == false) {
    die;
}

$contents = @file_get_contents($rss, false, null, -1, 57344);
if ($contents != false) {
    echo $contents;
}