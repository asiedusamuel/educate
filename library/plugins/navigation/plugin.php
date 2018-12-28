<?php
use \MySQL\Data;
class navigation{

    function renderExplore($params){
        $db = new Data;
        $list = '<ul>';
        $db->Query("SELECT flag, course FROM courses WHERE active='1'");
        if($db->Count() > 0){
            $data = $db->Results();
            foreach($data as $row){
                $list .= '<li><a href="./course/'.$row["flag"].'/">'.$row["course"].'</a></li>';
            }
            $list .= '</ul>';
            return $list;
        }
        return;
    }
}