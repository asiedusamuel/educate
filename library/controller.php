<?php

class Controller{

    static protected $_scriptsArray = array();
    static protected $_scripts = '';
    static protected $_stylesheets = '';
    
	static protected $pattern = '/<app:(.*?) (.*?)(\/>|<\/app:(.*?)>)/s';
          
    static public function register_script($path,$is_plugin=false){
        $path2 = explode("/",$path);
        foreach($path2 as $key => $val){
            if($val == ".."){
                unset($path2[($key-1)]);
                unset($path2[($key)]);
            }
        }
            //-$path = \implode("/",$path2);
                        
        //$developerMode = self::appConfig("app.development")=="true"?true:false;
        $array = explode('?', $path);
        $array = explode('.', $array[0]);
        $extension = end($array);
        $key = base64_encode($path);
        if(isset(self::$_scriptsArray[$key]) || isset($_SESSION["pluginsJS"][$key])) return;
        switch($extension){
            /* case "css":
                if($is_plugin){return '<link rel="stylesheet" href="'.($developerMode?"file://":"").$path.'?timestamp='.$timestamp.'" />'.PHP_EOL;}
                self::$_scriptsArray[$key] = $path;
            break;
            case "scss":
                if($is_plugin){return '<link rel="stylesheet" href="'.($developerMode?"file://":"").$path.'?timestamp='.$timestamp.'" />'.PHP_EOL;}
                self::$_scriptsArray[$key] = $path;
            break; */
            default:
            
            case "js":
            if($is_plugin){
                $_SESSION["pluginsJS"][$key] = $path;
            }else{
                self::$_scriptsArray[$key] = $path; 
            }
            
            break;
        }
        return false;
    }

    static function processScriptsArray(){
        //$developerMode = self::appConfig("app.development")=="true"?true:false;
        if(is_array(self::$_scriptsArray)){
            if(CPANEL){
                self::$_stylesheets .= '<meta name="ajaxURL" content="./ajax/cpanel/">';
            }else{
                self::$_stylesheets .= '<meta name="ajaxURL" content="./ajax/site/">';
            }
            foreach (self::$_scriptsArray as $script){
                $array = explode('?', $script);
                $array = explode('.', $array[0]);
                $extension = end($array);
                $script = str_replace(@$_SERVER["DOCUMENT_ROOT"],"..",$script);
                if($extension == "css" || $extension == "scss"){
                    self::$_stylesheets .= '<link rel="stylesheet" href="'.$script.'" />'.PHP_EOL;
                }elseif($extension == "js"){
                    self::$_scripts .= '<script src="'.$script.'"></script>'.PHP_EOL;
                }else{
                    self::$_scripts .= '<script src="'.$script.'"></script>'.PHP_EOL;
                }
            }
        }
        config::set('headStylesheets',self::$_stylesheets);
        config::set('footerScripts',self::$_scripts);
    }

    
	static function parseHTML($str){
		return preg_replace_callback(self::$pattern, 'self::tagReplacer', $str);
	}
	
	public static function tagReplacer($matches){
		$pattern = '/([0-9a-zA-Z_\-]++)\s*=\\s*("[^"]*"|\'[^\']*\'|[^"\'\\s>]*)/';
		preg_match_all($pattern, $matches[2], $attr, PREG_SET_ORDER);
		$params = array();
		foreach ($attr as $match) {
			if (($match[2][0] == '"' || $match[2][0] == "'") && $match[2][0] == $match[2][strlen($match[2])-1]) {
				$match[2] = substr($match[2], 1, -1);
			}
			$name = strtolower($match[1]);
			$value = html_entity_decode($match[2]);
			$params[$name] = $value;        
		}
		
		if(isset(self::$_data[$matches[1]])){
			return self::$_data[$matches[1]];
		}
		if(isset($matches[1])){
			switch ($matches[1]){
				case "config":
				if(isset($params["field"])) {
					return \config::get($params["field"]);
				}
				break;
				case "plugin":
                if(isset($params["shortcode"],$params["execute"])){
                    $plg = self::renderPlugin($params);
                    return self::parseHTML($plg);
				}
				break;
				case "view":
					return \config::get('activeView');
				break;
				case "scripts":
					return \config::get('footerScripts');
				case "stylesheets":
					return \config::get('headStylesheets');
				break;
			}
		}
	}

	private static function renderPlugin($params){
        $shortcode = $params["shortcode"];
        $execute = $params["execute"];
        $pluginFile = dirname(__FILE__).'/plugins/'.$shortcode.'/plugin.php';
        if(file_exists($pluginFile)){
            if(!class_exists($shortcode)) include_once($pluginFile);
            $plugin = new $shortcode;
            if(method_exists($plugin,$execute)){
                return $plugin->$execute($params);
            }
        }
		return;
	}
}