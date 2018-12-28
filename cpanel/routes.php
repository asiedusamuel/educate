<?php
use MySQL\Data;
$route = new \QIC\Router;

// This route registers the vue and general vue component scripts
$route->add('/', ["protected"=>true, "controllers"=>["navigation"]], function(){
    $view = new View('');
    $view->registerAsset(array("ViewPath://js/app.js","ViewPath://js/vue-components.js"));
    $view->Render();
});

/* Initailise system */
$route->add('/system/init/', ["protected"=>true, "controllers"=>["navigation"]], function(){
    $arr = [];
    $arr["navList"] = navigation::get();
    $arr["config"] = array(
        "url"=> config::get('url')
    );
    return json_encode($arr);
});

// This if to restric unauthorize calling of routes
if(isset($_REQUEST["view"])){
    // Route which requires view parameter

    // This route gets the data, view and components of dashboard page
    $route->add('/dashboard/', ["protected"=>true, "content-type"=>'application/JSON', "controllers"=>["cmd"]], function(){
        $view = new View('dashboard/list');
        $res = [];
        $res['data'] = [];
        $res['view'] = (cmd::getView()?$view->Render():'');
        return json_encode($res);
    });

    // This route gets the data, view and components of courses page
    $route->add('/courses/', ["protected"=>true, "content-type"=>'application/JSON', "controllers"=>["cmd"]], function(){
        $view = new View('courses/list');
        $res = ["title"=>'Courses'];
        $db = new Data;
        $db->Query("SELECT id, flag, course, image, overview FROM courses");
        $res["data"]["courses"] = [];
        if($db->Count() > 0){
            $data = $db->Results();
            $i = 0;
            foreach($data as $course){
                $course["overview"] = Utils::decode($course["overview"]);
                array_push($res["data"]["courses"],$course);
            }
        }
        $res["data"]["lessons"] = array("selected"=>[]);
        if(cmd::getView()){
            $res["options"] = cmd::getVueOptions('courses/options');
            $res['view'] = $view->Render();
        }    
        return json_encode($res);
    });

    // This route gets the data, view and components of questions page
    $route->add('/course/lesson/{n:lessonID}/questions/', ["protected"=>true, "content-type"=>'application/JSON', "controllers"=>["cmd"]], function($lessonID){
        $view = new View('courses/questions');
        $res = ["title"=>'Questions Manager'];
        $dbl = new Data;
        $dbl->Query("SELECT id FROM lessons WHERE id=? LIMIT 1",[$lessonID]);
        if($dbl->Count() == 0) $res["data"]["error"] =true;
        $db = new Data;
        $res["data"]["questions"] = [];
        $res["data"]["addNew"] = true;
        $db->Query("SELECT id, question, options FROM questions WHERE lessonID=?",[$lessonID]);
        if($db->Count()>0){
            $data = $db->Results();
            foreach($data as $key => $question){
                $question["question"] = json_decode($question["question"]);
                $res["data"]["questions"][$key] = $question;;
            }
        }
        $res["data"]["option"] = ["answers"=>[], "question"=>""];
        
        if(cmd::getView()){
            $res["options"] = cmd::getVueOptions('courses/questions.options');
            $res['view'] = $view->Render();
            $res["style"] = cmd::getStyleSheet('courses/questions/styles');
        }    
        $db->Query("SELECT c.id as cid, c.course as title,l.lesson, l.id as lid FROM lessons l LEFT JOIN courses c ON c.id=l.course WHERE l.id=? LIMIT 1",[$lessonID]);
        if($db->Count() == 1){
            $res["data"]["course"] = $db->Results();
        }
        return json_encode($res);
    });
}else{
    // Route which requires no view parameter

    //This route returns lessons data
    $route->add('/course/lessons/{n:id}/', ["protected"=>true, "content-type"=>'application/JSON'], function($id){
        $id = Utils::sanitize($id);
        $db = new Data;
        $questions = "(SELECT COUNT(*) FROM questions q WHERE q.lessonID=l.id)";
        $db->Query("SELECT l.id, l.lesson, l.visible, $questions as questions FROM lessons l WHERE l.course = ?",[$id]);
        $res = [];
        if($db->Count() > 0){
            $res = $db->Results();
        }
        return json_encode($res);
    });

    // This route checks if all video formats have been uploaded and returns the status
    $route->add('/course/lessons/{n:id}/check-videos/', ["protected"=>true, "content-type"=>'application/JSON'], function($id){
        $id = Utils::sanitize($id);
        $db = new Data;
        $db->Query("SELECT c.flag FROM lessons l LEFT JOIN courses c ON c.id=l.course WHERE l.id = ? LIMIT 1",[$id]);
        $res = [];
        if($db->Count() == 1){
            $row = $db->Results();
            $course = $row["flag"];
            $res["course"] = $course;
            $res["has720p"] = file_exists(__DIR__.'/../videos/'.$course.'/'.$id.'/720p.mp4');
            $res["has360p"] = file_exists(__DIR__.'/../videos/'.$course.'/'.$id.'/360p.mp4');        
        }else{
            $res["error"] = 'Lesson do not exist';
        }
        return json_encode($res);
    });

    // This route uploads the video files to the server
    $route->add('/course/lessons/{n:id}/upload-video/{an:type}/', [ "content-type"=>'application/JSON', 'controllers'=>["uploader"]], function($id, $type){
        $id = Utils::sanitize($id);
        $type = Utils::sanitize($type);
        $res = [];
        $db = new Data;
        $db->Query("SELECT c.flag FROM lessons l LEFT JOIN courses c ON c.id=l.course WHERE l.id = ? LIMIT 1",[$id]);
        if($db->Count() > 0){
            $row = $db->Results();
            $course = $row["flag"];
            $dir = './videos/'.$course.'/'.$id;
            $uploadOptions = array(
                'uploadDir' => $dir."/", //Upload directory {String}
                'title' => $type,
                'replace'=>true
            );
            $uploader = new Uploader();    
            $data = $uploader->upload($_FILES['file'], $uploadOptions);
            if ($data['isComplete']) {
                $res = $data['data']["metas"][0];
            }
            if ($data['hasErrors']) {
                $errors = $data['errors'];
                return $res['error']= 'An error occured. '.implode(", ", $errors);
            }         
        }else{
            $res["error"] = 'Upload Failed. Invalid lesson ID.';
        }
        return json_encode($res);
    });

    // This route uploads the video files to the server
    $route->add('/course/{n:id}/upload-image/', [ "content-type"=>'application/JSON', 'controllers'=>["uploader"]], function($id=0){
        $id = Utils::sanitize($id);
        $res = [];
        $db = new Data;
        $db->Query("SELECT id,flag FROM courses WHERE id = ? LIMIT 1",[$id]);
        if($db->Count() > 0){
            $row = $db->Results();
            $dir = './uploads/courses';
            $uploadOptions = array(
                'uploadDir' => $dir."/", //Upload directory {String}
                'title' => $row["id"],
                'replace'=>true
            );
            $uploader = new Uploader();    
            $data = $uploader->upload($_FILES['file'], $uploadOptions);
            if ($data['isComplete']) {
                $res = $data['data']["metas"][0];
                $db->Query("UPDATE courses SET image=? WHERE id=? LIMIT 1",[$res['file'], $id]);
            }
            if ($data['hasErrors']) {
                $errors = $data['errors'];
                return $res['error']= 'An error occured. '.implode(", ", $errors);
            }         
        }else{
            $res["error"] = 'Upload Failed. Invalid Course ID. Make sure course has been save before uploading image';
        }
        return json_encode($res);
    });

    // This route saves course details to the database
    $route->add('/course/save/{n:id}/', ["protected"=>true, "content-type"=>'application/JSON', "controllers"=>["cmd"]], function($id){
        $pattern = '/<div (.* data-katex="(.*?)".*)>(.*?)<\/div>/s';
        $id = Utils::sanitize($id);
        $flag = Utils::sanitize(@$_POST["alias"]);
        $course = Utils::sanitize(@$_POST["course"]);
        $overview = @$_POST["overview"];
        $overview = Utils::encode($overview); 
        $res = [];
        $db = new Data;
        $db->Query("SELECT id FROM courses WHERE id = ? LIMIT 1",[$id]);
        if($db->Count() == 1){
            // Update course table
            // Check if Course title has already been added.
            $db->Query("SELECT id FROM courses WHERE id != ? AND course=? LIMIT 1",[$id,$course]);
            if($db->Count() == 1){
                $res["error"] = "Course title already exist.";
            }else{
                $db->Query("UPDATE courses SET flag=?, course=?, overview=? WHERE id=?",[$flag,$course,$overview,$id]);
                $res["succes"] = true;
            }
        }else{
            // Insert new course to course table
            // Check if Course title has already been added.
            $db->Query("SELECT id FROM courses WHERE course=? LIMIT 1",[$course]);
            if($db->Count() == 1){
                $res["error"] = "Course title already exist.";
            }else{
                $db->Query("INSERT INTO courses (flag,course,overview) VALUES (?,?,?)", [$flag,$course,$overview]);
                $res["succes"] = true;
                $res["id"] = $db->Results();
                
            }       
        }
        return json_encode($res);
    });

    // This route saves lesson details to the database
    $route->add('/course/lesson/save/{n:id}/', ["protected"=>true, "content-type"=>'application/JSON'], function($id){
        $id = Utils::sanitize($id);
        $course = Utils::sanitize(@$_POST["course"]);
        $lesson = Utils::sanitize(@$_POST["lesson"]);
        $visible = Utils::sanitize(@$_POST["visible"]);
        $res = [];
        $db = new Data;
        $db->Query("SELECT id FROM lessons WHERE id = ? AND course=? LIMIT 1",[$id,$course]);
        if($db->Count() == 1){
            // Update lesson table
            // Check if lesson title has already been added.
            $db->Query("SELECT id FROM lessons WHERE id != ? AND course=? AND lesson=? LIMIT 1",[$id,$course,$lesson]);
            if($db->Count() == 1){
                $res["error"] = "Lesson title already exist.";
            }else{
                $db->Query("UPDATE lessons SET lesson=?, visible=? WHERE id=?",[$lesson,$visible,$id]);
                $res["succes"] = true;
            }
        }else{
            // Insert new lesson to course table
            // Check if lesson title has already been added.
            $db->Query("SELECT id FROM lessons WHERE course=? AND lesson=? LIMIT 1",[$course,$lesson]);
            if($db->Count() == 1){
                $res["error"] = "Lesson title already exist.";
            }else{
                $db->Query("INSERT INTO lessons (course, lesson, visible) VALUES (?,?,?)", [$course, $lesson, $visible]);
                $res["succes"] = true;
                $res["id"] = $db->Results();
                
            }       
        }
        return json_encode($res);
    });

    // This route saves question details to the database
    $route->add('/course/lesson/save-question/{n:id}/', ["protected"=>true, "content-type"=>'application/JSON'], function($id){
        $id = Utils::sanitize($id);
        $course = Utils::sanitize(@$_POST["cid"]);
        $lesson = Utils::sanitize(@$_POST["lid"]);
        $question = json_encode(@$_POST["question"]);
        $options = json_encode(@$_POST["options"]);
        $res = [];
        $db = new Data;
        $db->Query("SELECT id FROM questions WHERE id = ? AND courseID=? AND lessonID=? LIMIT 1",[$id,$course,$lesson]);
        if($db->Count() == 1){
            // Update question table
            // Check if question title has already been added.
            $db->Query("SELECT id FROM questions WHERE id != ? AND question=? AND courseID=? AND lessonID=? LIMIT 1",[$id,$question,$course,$lesson]);
            if($db->Count() == 1){
                $res["error"] = "Lesson title already exist.";
            }else{
                $db->Query("UPDATE questions SET question=?, options=? WHERE id=?",[$question,$options,$id]);
                $res["succes"] = true;
            }
        }else{
            // Insert new question to lesson
            // Check if questio has already been added.
            $db->Query("SELECT id FROM questions WHERE courseID=? AND lessonID=? AND question=? LIMIT 1",[$course,$lesson,$question]);
            if($db->Count() == 1){
                $res["error"] = "Question already exist.";
            }else{
                $db->Query("INSERT INTO questions (courseID, lessonID, question, options) VALUES (?,?,?,?)", [$course, $lesson, $question,$options]);
                $res["succes"] = true;
                $res["id"] = $db->Results();
                
            }       
        }
        return json_encode($res);
    });

    // This route deletes course from the database
    $route->add('/course/lesson/delete-question/{n:id}/', ["protected"=>true, "content-type"=>'application/JSON'], function($id=null){
        $id = Utils::sanitize($id);
        $res = [];
        if($id){
            $db = new Data;
            $db->Query("DELETE FROM questions WHERE id=? LIMIT 1",[$id]);
            $res["success"] = true;
        }else{
            $res["error"] = "An error occured. Could not delete from server.";
        }
        return json_encode($res);
    });

    // This route deletes lesson fromo the database
    $route->add('/course/lesson/delete/{n:id}/', ["protected"=>true, "content-type"=>'application/JSON'], function($id=null){
        $id = Utils::sanitize($id);
        $res = [];
        if($id){
            $db = new Data;
            $db->Query("SELECT c.flag FROM lessons l LEFT JOIN courses c ON c.id=l.course WHERE l.id = ? LIMIT 1",[$id]);
            if($db->Count() == 1){
                $row = $db->Results();
                $course = $row["flag"];
                $vid1 = __DIR__.'/../videos/'.$course.'/'.$id.'/720p.mp4';
                $vid2 = __DIR__.'/../videos/'.$course.'/'.$id.'/360p.mp4';
                if(file_exists($vid1)) unlink($vid1);
                if(file_exists($vid2)) unlink($vid2);
            }
            $db->Query("DELETE FROM lessons WHERE id=? LIMIT 1",[$id]);
            $res["success"] = true;
        }else{
            $res["error"] = "An error occured. Could not delete from server.";
        }
        return json_encode($res);
    });

    // This route deletes course from the database
    $route->add('/course/delete/{n:id}/', ["protected"=>true, "content-type"=>'application/JSON'], function($id=null){
        $id = Utils::sanitize($id);
        $res = [];
        if($id){
            $db = new Data;
            $db->Query("SELECT image FROM courses WHERE id=? LIMIT 1",[$id]);
            if($db->Count()==1){
                $row = $db->Results();
                $img = $row['image'];
                if(file_exists($img)) unlink($img);
            }
            $db->Query("DELETE FROM courses WHERE id=? LIMIT 1",[$id]);
            $db->Query("DELETE FROM lessons WHERE course=? LIMIT 1",[$id]);
            $db->Query("DELETE FROM questions WHERE courseID=? LIMIT 1",[$id]);
            $res["success"] = true;
        }else{
            $res["error"] = "An error occured. Could not delete from server.";
        }
        return json_encode($res);
    });

}



/* Routes for Links */



/* Authentication: AJAX REQUEST */
$route->add('/auth/validate/', array("content-type"=>'application/JSON'), function(){
    $email = Utils::sanitize(@$_REQUEST["username"]);
    $password = Utils::sanitize(@$_REQUEST["password"]);
    
    // Validate email and password
    if(empty($email)){echo json_encode(array('error'=>'User email is required.')); return false;}
    if(empty($password)){echo json_encode(array('error'=>'User password is required.')); return false;}

    $password = Utils::encode($password);

    $db = new Data;
    $db->Query("SELECT email, id, type FROM users WHERE email='$email' AND password='$password' LIMIT 1");
    if($db->Count() == 1){
        $data = $db->Results();
        $_SESSION["user"]['timestamp'] = time();
        $_SESSION["user"]["id"] = $data["id"];
        $_SESSION["user"]["email"] = $data["email"];
        return json_encode(array("success"=>"Login successful. Please wait."));
    }else{
        return json_encode(array("error"=>"Login failed. Please try again later."));
    }
    
});
/* END Authentication: AJAX REQUEST */

$route->Render();