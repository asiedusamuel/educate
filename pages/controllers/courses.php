<?php
use \MySQL\Data;
class Courses{
    static function getLessons($course){
        $db = new Data;
        $list = '';
        $db->Query("SELECT * FROM lessons WHERE course='$course'");
        if($db->Count() !=0){
            $list = '<ul class="module-items">';
            $data = $db->Results();
            $i = 0;
            foreach($data as $row){
                $i++;
                $list .= '<li>
                            <strong>Lesson '.$i.':</strong> '.$row["lesson"].'
                                <a href="javascript:void(0);" class="btn-custom small blue md-trigger take-test" data-modal="modal-take-test">Take
                                    Test
                                </a> 
                                <a href="#" class="start-lesson">
                                    <i class="icon play circular"></i> Start Lesson
                                </a>
                            </li>';
            }
            $list .= '</ul>';
        }        

        return $list;
    }

    static function getCourseDetails($course){
        $db = new Data;
        $db->Query("SELECT flag,course,image,overview FROM courses WHERE flag='$course' LIMIT 1");
        if($db->Count() !=0){
            return $db->Results();
        }else{
            return [];
        }
    }
}