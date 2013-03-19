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
 * Wiredrive Button
 * Class to add the wiredrive link button to the mce plugin in the 
 * wordpress admin
 */

class Wiredrive_Button
{
    function init()
    {
        if (!is_admin()) {
            return;
        }

        if ( current_user_can('edit_posts')
            && current_user_can('edit_pages')
            && get_user_option('rich_editing') == 'true') {
            add_filter('tiny_mce_version',      array(&$this, 'tiny_mce_version') );
            add_filter("mce_external_plugins",  array(&$this, "mce_external_plugins"));
            add_filter('mce_buttons_2',         array(&$this, 'mce_buttons'));
        }
    }

    function mce_buttons($buttons)
    {
        array_push($buttons, "mce-wdp-button" );
        return $buttons;
    }

    function mce_external_plugins($plugin_array)
    {
        $plugin_array['wdpButton'] = plugins_url('/wiredrive-player/js/wd-mce-button.js');
        return $plugin_array;
    }

    function tiny_mce_version($version)
    {
        return ++$version;
    }

}
