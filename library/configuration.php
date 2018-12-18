<?php

class config{
    
    private static $config = array(
        /* Template Configurations */
        'defaultTemplate' => 'educate',
        'templateFile' => 'main',

        /* Site Configurations */
        'sitename' => 'Smart Education',
        'url' => '127.0.0.1/educate',

        'activeView' => '',

        /* Database Configurations */
        'dbhost'=>'127.0.0.1',
        'dbname'=>'education',
        'dbuser'=>'root',
        'dbpass'=>'',
    );


    /* Do not edit code below */
    static function get($key){
        if(isset(self::$config[$key])){
            if($key == "url"){
                $value = self::$config[$key];
                return (self::isServerSecure()?"https://".$value."/":"http://".$value."/");
            }
            return self::$config[$key];
        }
    }

    private static function isServerSecure() {
        return (!empty($_SERVER['HTTPS']) && $_SERVER['HTTPS'] !== 'off') || $_SERVER['SERVER_PORT'] == 443;
    }

    static function set($key, $value){
        self::$config[$key] = $value;
    }
}