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
 * Wiredrive Plugin Admin
 *
 * Build the plugin admin panel.  Allows the users to add the Wiredrive player
 * shortcode within the MCE panel.
 */
 
class Wiredrive_Plugin_Admin
{
    
    protected $template = NULL;
        
    /**
     * Construct
     * Start the template class
     */
    public function __construct()
    {
        $this->template = new Wiredrive_Plugin_Template();
    }

    public function wiredrive_admin_enqueue_scripts()
    {
        if ( function_exists('plugins_url') ) {
            $plugin_url = plugins_url('wiredrive-player');
            
            wp_enqueue_script('jquery');
            wp_enqueue_script('jquery-ui-core');
            wp_enqueue_script('jquery-ui-dialog');
            wp_enqueue_style( 'wdp-jquery-ui', ($plugin_url  . '/css/jquery-ui.css'), false, '1.2-wdp');
        }
    }

    /**
     * Admin header
     *
     * @return string
     */
    public function wiredrive_admin_header()
    {        
        $this->template->setTpl('admin_header.php')
                 ->set('pluginUrl', plugins_url('wiredrive-player') )
                 ->render();
                 
        echo $this->getOutput();
                 
    }

    /**
     * Admin footer
     * This is the dialog box that opens when the TinyMCE button is clicked
     *
     * @return string
     */
    public function wiredrive_admin_footer()
    {
    
        $this->template->setTpl('admin_footer.php')
                 ->render();
           
        echo $this->getOutput();

    }
    
    /**
     * Get Outout
     * @return string
     */
     private function getOutput() {
     
        return $this->template->getOutput();
    
     }
     
}