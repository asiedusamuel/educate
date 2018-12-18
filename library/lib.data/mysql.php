<?php
/**
 * Created by PhpStorm.
 * User: Sam Wise
 * Date: 3/1/2016
 * Time: 6:08 PM
 */
namespace MySQL;

class db{
    public $link;
    public $dsn, $username, $password, $database;

    public function __construct()
    {
        $this->dsn = \config::get("dbhost").":".\config::get("port");
        if(\config::get("port") == ""){
            $this->dsn = \config::get("dbhost");
        }
        $this->username = \config::get("dbuser");
        $this->password = \config::get("dbpass");
        $this->database = \config::get("dbname");
        $this->connect();
    }

    private function connect()
    {
        try{
            if(!$this->link){
                $this->link = new \PDO('mysql:host='.$this->dsn.';
                                    dbname='.$this->database.';
                                    charset=utf8',''.$this->username.'', ''.$this->password.'');
                $this->link->setAttribute(\PDO::ATTR_ERRMODE, \PDO::ERRMODE_EXCEPTION);
            }
            
        }catch(PDOException $e){
            $html = file_get_contents(__DIR__."/../install/install.html");
            $replace = array(
                        "[hostname]"=>$config->getConfig("hostname"),
                        "[port]"=>$config->getConfig("port"),
                        "[username]"=>$config->getConfig("username"),
                        "[password]"=>$config->getConfig("password"),
                        "[database]"=>$config->getConfig("database")
                        );
            $instal_content = strtr($html, $replace);
            echo $instal_content;
            exit;
        }
    }

    public function __sleep()
    {
        return array('dsn', 'username', 'password');
    }

    public function __wakeup()
    {
        $this->connect();
    }
}

$database = new db();
$db = $database->link;

class Data{
    var $return = '';
    var $params = [];
    var $db = '';
    public $statement = '';
    var $exe_statement = '';
    var $statements = array();
    var $limit1 = false;
    var $errors = array();
    var $insertTableName = '';

    function __construct(){
        $database = new db();
        $this->database = $database;
        $this->db = $database->link;
    }

    private function addError($error){
        array_push($this->errors, $error);
    }
    function params(){
        $this->params = \func_get_args();
        return $this;
    }
    
    /**
     * Required
     * ---
     * Set Param before calling query function
     */
    public function Query($query,$params=array()){
        if(empty($query)){
            $this->addError("Query was empty");
            return $this;
        }
        if(strpos($query, 'INSERT INTO') !== false){
            $split = \explode(" ",$query);
            if(isset($split[2])){
                $this->insertTableName = $split[2];
            }
        }
        if(substr($query,strlen($query)-1) !=";"){
            $query .= ';';
        }
        
        
        if(strpos($query, 'LIMIT 1;') !== false){
            $this->limit1 = true;
        }
        $this->statement = $query;
        $this->exe_statement = $this->db->prepare($this->statement);
        $this->exe_statement->execute($params);
        $this->errors = array();
        return $this;
    }


    public function Count(){
        if($this->exe_statement->errorCode() == 0) {
            return $this->exe_statement->rowCount();
        }
        return 0;
    }

    public function Results($field="id"){
        if($this->exe_statement->errorCode() == 0) {
            $result = ($this->insertTableName?$this->lastFieldValue($field):$this->exe_statement->fetchAll(\PDO::FETCH_ASSOC));
        } else {
            $result = array();
        }
        if(is_array($result) && count($result) !=0){
            $result = (!$this->limit1?$result:$result[0]);
        }
        return $result;
    }

    private function lastFieldValue($field = "id"){
        $data = new $this;
        $this->field = $field;
        $this->return = '';
        $data->Query("SELECT {$field} FROM {$this->insertTableName} ORDER BY id DESC LIMIT 1")->then(function($row){
            if($row["count"] == 1){
                $this->return = $row["result"][$this->field];
            }
        });
        return $this->return;
    }

    public function then(){
        $args = func_get_args();
        $fn = function(){};
        $return = array(
                "hasError"=>(count($this->errors) > 0?true:false),
                "Errors"=>$this->errors,
                "count"=>$this->Count()
        );
        if(func_num_args() == 1){
            // function only
            $fn = (is_callable($args[0])?$args[0]:$fn);
            $return["result"] = $this->Results();
        }
        if(func_num_args() == 2){
            // String and function
            $returnVal = $args[0];
            $fn = (is_callable($args[1])?$args[1]:$fn);
            $return["result"] = $this->Results($returnVal);
        }        
        $fn($return);        
    }

}
