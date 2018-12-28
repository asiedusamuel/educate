<?php

class breadcrumb{
    static $links = array();
    static function registerLinks($links=array()){
        self::$links = $links;
    }

    function list($params=array()){
        $list = '<ol class="breadcrumb ">';
        $list .= '<li><i class="icon-home"></i><a href="./" title="Homepage">Home</a></li>';
        $lCount = count(self::$links);
        foreach(self::$links as $key => $link){
            if(isset($link["url"], $link["title"])){
                $list .= '<li><a '.($key ==($lCount-1)?'':'href="'.$link['url']).'"'.' title="'.$link['title'].'">'.$link['title'].'</a></li>';
            }
        }
        $list .= '</ol>';
        return $list;
    }
}