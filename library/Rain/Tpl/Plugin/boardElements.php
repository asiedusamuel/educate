<?php
   // set the namespace
   namespace Rain\Tpl\Plugin;
   // require the Plugin class
   require_once __DIR__ . '/../Plugin.php';

   class boardElements extends \Rain\Tpl\Plugin
   {
	// hooks
	protected $hooks = array('beforeParse');
	// text that replace the image
	protected $replacement = "[IMAGE REPLACED]";

	/** 
	* Function called by the filter beforeParse
	**/
	public function beforeParse(\ArrayAccess $context){
		// get the html
		$html = $context->code;

		$context->code = $this->parseStr($html);
	}


}