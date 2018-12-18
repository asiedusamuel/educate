<?php
class navigation{

    public static function get(){
        return [
            array("link"=>"/dashboard/","title"=>"Dashboard","class"=>"dashboard"),
            array("link"=>"/courses/","title"=>"Courses","class"=>"courses"),
            array("link"=>"/students/","title"=>"Students","class"=>"students"),
        ];
    }
}