<?php
namespace QIC;

require dirname(__FILE__)."/route.php";
class Router{

    private $routes = array();
    private $flag = '';
    /**
	 * Patterns that should be replaced
	 *
	 * @var array
	 */
	private $patterns = array(
		'~/~',			     // slash
		'~{an:[^\/]+}~',     // placeholder accepts alphabetic and numeric chars
		'~{ans:[^\/]+}~',    // placeholder accepts alphanumeric and special chars
		'~{n:[^\/]+}~',      // placeholder accepts only numeric
		'~{a:[^\/]+}~',      // placeholder accepts only alphabetic chars
		'~{w:[^\/]+}~',      // placeholder accepts alphanumeric and underscore
		'~{\*:[^\/]+}~',     // placeholder match rest of url
		'~\\\/{\?:[^\/]+}~', // optional placeholder
		'~{[^\/]+}~',	     // normal placeholder
	);
    
    /**
	 * Replacements for the patterns index should be in sink
	 *
	 * @var array
	 */
	private $replacements = array(
		'\/', 			     // slash
		'([0-9a-zA-Z]++)',   // placeholder accepts alphabetic and numeric chars
		'([0-9a-zA-Z_\-,;@.]++)',   // placeholder accepts alphanumeric and special chars
		'([0-9]++)',		 // placeholder accepts only numeric
		'([a-zA-Z]++)',	     // placeholder accepts only alphabetic chars
		'([0-9a-zA-Z-_]++)', // placeholder accepts alphanumeric and underscore
		'(.++)',			 // placeholder match rest of url
		'\/?([^\/]*)',	     // optional placeholder
		'([^\/]++)',	 	 // normal placeholder
	);
    public function __construct(){
        if(isset($_REQUEST["flag"]) && !empty($_REQUEST["flag"])){
           $this->flag = $_REQUEST["flag"]; 
        }else{
          $this->flag = "/";  
        }        
    }

    public function add()
	{
		$args = \func_get_args();
		$options = array();
		if(\func_num_args() == 2){
			//No options provided
			$url = $args[0];
			$action = $args[1];
		}
		if(\func_num_args() == 3){
			// options provided
			$url = $args[0];
			$options = $args[1];
			$action = $args[2];
		}
		$route = new \QIC\Route($this->parseUrl($url), $action, $options);
        array_push($this->routes, $route);
	}

    private function parseUrl($url){		
		$newUrl = preg_replace($this->patterns, $this->replacements, $url);
		$newUrl = trim($newUrl, '\/');
		return $newUrl;
	}

	/**
	 * Get arguments
	 *
	 * @param  array $matches
	 *
	 * @return array
	 */
	private function getArguments($matches)
	{
		$arguments = array();

		foreach ($matches as $key => $match) {
			if ($key === 0) continue;

			if (strlen($match) > 0) {
				$arguments[] = $match;
			}
		}

		return $arguments;
	}

    public function Render(){
		foreach($this->routes as $route){
			$pattern = $this->flag;
			$matches = array();
			$requestedUri = trim(preg_replace('/\?.*/', '', $pattern), '/');
			if($route->getUrl() === $requestedUri || @preg_match('~^'.$route->getUrl().'$~', $requestedUri, $matches)){
				$arguments = $this->getArguments($matches);
				$options = $route->getOptions();
				if(isset($options["content-type"])){
					header('Content-Type:'.$options["content-type"]);
				}
				if(isset($options["protected"]) && $options["protected"] == true && !isset($_SESSION["user"]["id"])){
					$_REQUEST["return"] = @$_SERVER["REQUEST_URI"];
					if(AJAX){
						echo \json_encode(array("error"=>"Login required to proceed"));
					}else{
						\config::set('templateFile','login');
					}					
					return true;
				}else{
					if(isset($options["controllers"]) && is_array($options["controllers"])){
					foreach($options["controllers"] as $ctrl){
						if(!class_exists($ctrl)){
							$file = __DIR__.'/../../'.(CPANEL?'cpanel':'pages').'/controllers/'.$ctrl.'.php';
							if(file_exists($file)){
								require_once($file);
							}							
						}
						}
					}
					$return = call_user_func_array($route->getAction(), $arguments);
					if(AJAX){
						\config::set('activeView', $return);
					}else{
						return $return;
					}
					
				}				
			}			
		}
		\config::set('templateFile','404');
    }
}