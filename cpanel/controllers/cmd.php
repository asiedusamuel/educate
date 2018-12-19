<?php

class cmd{

    static function getView(){
        return (isset($_REQUEST["view"])?($_REQUEST["view"]=="true"?true:false):true);
    }

    static function getVueOptions($path){
        $path = __DIR__.'/../views/'.$path.'.js';
        if(file_exists($path)){
            $content = file_get_contents($path);
            $content = str_replace("export default","",$content);
            $content = base64_encode($content);
            return $content;
        }
        return null;
    }

    static function getStyleSheet($path){
        $path = __DIR__.'/../views/'.$path.'.css';
        if(file_exists($path)){
            $content = file_get_contents($path);
            $content = base64_encode($content);
            return $content;
        }
        return null;
    }
}