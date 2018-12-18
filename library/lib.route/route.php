<?php
namespace QIC;
/**
 * Simple route object
 */
class Route
{
	/**
	 * Method of route
	 *
	 * @var string
	 */
	private $method;
	/**
	 * Url of route
	 *
	 * @var string
	 */
	private $url;
	/**
	 * Action that the route will use when called
	 *
	 * @var string|function
	 */
	private $action;
	/**
	 * Namespace for the route
	 *
	 * @var string
	 */
	/**
	 * Options required for the route
	 *
	 * @var string|array
	 */
	private $options;
	/**
	 * Namespace for the route
	 *
	 * @var string
	 */
	private $namespace;
	/**
	 * Route constructor
	 *
	 * @param string         $url
	 * @param array          $method
	 * @param string|closure $action
	 */
	public function __construct($url = null, $action = null,$options=array())
	{
		$this->setOptions($options);
		$this->setUrl($url);
		$this->setAction($action);
	}
	/**
	 * Get the request method of the current route
	 *
	 * @return array
	 */
	public function getMethod()
	{
		return $this->method;
	}
	/**
	 * Set the method of the current route
	 *
	 * @param array $method
	 */
	public function setMethod($method)
	{
		if ($method === null || !is_array($method) || empty($method)) {
			die('No method provided');
		}
		foreach ($method as $m) {
			if (!in_array($m, array('GET','POST','PUT','PATCH','DELETE'))) {
				die('Method not allowed. allowed methods: GET, POST, PUT, PATCH, DELETE');
			}
		}
		$this->method = $method;
	}
	
	/**
	 * Get the url of the current route
	 *
	 * @return string
	 */
	public function getUrl()
	{
		return $this->url;
	}
	/**
	 * Set url
	 *
	 * @param string $url
	 */
	public function setUrl($url)
	{
		if ($url === null) {
			die('No url provided, for root use /');
		}
		$this->url = $url;
	}
	/**
	 * Set url
	 *
	 * @param string $url
	 */
	public function setOptions($options)
	{
		if (!\is_array($options)) {
			die('Options must be in an array format.');
		}
		$this->options = $options;
	}
	/**
	 * Get the request method of the current route
	 *
	 * @return array
	 */
	public function getOptions()
	{
		return $this->options;
	}
	
	/**
	 * Get the action of the current route
	 *
	 * @return string|function
	 */
	public function getAction()
	{
		return $this->action;
	}
	/**
	 * Set action 
	 * 
	 * @param string|function $action
	 */
	public function setAction($action)
	{
		if (!(is_object($action) && ($action instanceof \Closure)) && ($action === null || $action === '')) {
			die('Action should be a Closure or a path to a function');
		}
		$this->action = $action;
	}
	/**
	 * Get namespace
	 *
	 * @return string
	 */
	public function getNamespace()
	{
		return $this->namespace;
	}
	/**
	 * Set namespace
	 *
	 * @param string $namespace
	 */
	public function setNamespace($namespace)
	{
		$this->namespace = $namespace;
	}
}