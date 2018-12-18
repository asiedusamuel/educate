<?php
$route = new \QIC\Router;
$route->add('/', function(){

});
$route->add('/course/{ans:flag}/',["controllers"=>["courses"]], function($flag){
    $view = new View('courses/course');
    $data["lessons"] = Courses::getLessons($flag);
    $course = Courses::getCourseDetails($flag);
    $data["overview"] =$course["overview"];
    $view->registerAsset(["ViewPath://courses/js/app.js"]);
    $view->render($data);
});

$route->Render();