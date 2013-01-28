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
 * Wiredrive Plugin Template
 *
 * Very simple template class for rendering template files from php.
 * Nothing is send to the browser - this class uses output buffering
 * to build a string of rendered html
 */

class Wiredrive_Plugin_Template
{

	/**
	 * Array to hold all the template variables
	 */
	protected $vars = array();

	/**
	 * Template file
	 */
	protected $tpl = NULL;

	/**
	 * String for output to browser
	 */
	protected $output = '';

	/**
	 * Set Tpl
	 * Set the tpl to a new file
	 *
	 * @var $tpl string
	 */
	public function setTpl($tpl)
	{
		$dir =  dirname(__FILE__);
		$this->tpl = $dir .'/templates/'. $tpl;

		if (!is_file($this->tpl)) {
			throw new Exception('Template file does not exist : ' . $tpl);
		}

		return $this;

	}

	/**
	 * Set 
	 *
	 * @var $key string
	 * @var $value mixed
	 */
	public function set($key, $value)
	{
		$this->vars[$key] = $value;
		return $this;
	}

	/**
	 * Get
	 *
	 * @var $key string
	 * @var $value mixed
	 *
	 * @return mixed
	 */
	private function get($key)
	{

		if (isset($this->vars[$key])) {
			return $this->vars[$key];
		} else {
			return NULL;
		}

	}

	/**
     * Reset
	 * reset the array holding all the template vars
	 */
	public function reset($key)
	{
		$value = $this->get($key);
		if (is_array($value)) {
			reset($value);
			$this->set($key, $value);
		}
	}

	/**
	 * Clean
	 * Clear out all the set template vars
	 * and reset to the output to an empty
	 * string
	 */
	private function clean()
	{
		$this->vars = array();
		$this->output = '';

		return $this;
	}

	/**
	 * Render
	 * Render the template and substitute any variables
	 * Uses output buffering to build the string
	 */
	public function render()
	{

		ob_start();

		include $this->tpl;
		$this->addOutput(ob_get_contents());
		
		ob_end_clean();

	}

	/**
	 * Add Output
	 * Append to the output string
	 *
	 * @param unknown $out string
	 */
	private function addOutput($out)
	{

		$this->output .= $out;
	}

	/**
	 * Get Output
	 * Return the output string
	 *
	 * @return string
	 */
	public function getOutput()
	{

		$out = $this->output;
		$this->clean();
		return $out;

	}

}
