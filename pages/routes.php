<?php
use \MySQL\Data;
$route = new \QIC\Router;
$route->add('/', function(){
    \config::set('templateFile','main');
});
$route->add('/course/{ans:flag}/',["controllers"=>["courses","../../library/plugins/breadcrumb/plugin"]], function($flag){
    $view = new View('courses/course');
    $course = Courses::getCourseDetails($flag);
    breadcrumb::registerLinks(array(
        array("url"=>"./courses/","title"=>"Courses"),
        array("url"=>"","title"=>$course["course"])
    ));
    if(isset($course['id'])){
        $data["course"] = $course["course"];
        $data["lessons"] = Courses::getLessons($course['id']);
        $data["overview"] = Utils::decode($course["overview"]);
        $view->registerAsset([
            "ViewPath://courses/js/classie.js",
            "ViewPath://courses/js/modalEffects.js",
            "ViewPath://courses/js/plyr.min.js",
            "ViewPath://courses/js/jquery.barrating.min.js",
            "ViewPath://courses/js/app.js"
            ]);
        $view->render($data);
    }else{
        \config::set('templateFile','404');
    }
    
});

// AJAX Requests
$route->add('/course/{ans:course}/load-playlist/', ["content-type"=>'application/JSON'], function($course){
    $course = Utils::sanitize($course);
    $db = new Data;
    $res = ['900'];
    
    return json_encode($res);
});

$route->Render();