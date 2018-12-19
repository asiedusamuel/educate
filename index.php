<?php
session_start();
if (isset($_SESSION["user"]['timestamp'])) {
    if (time() - $_SESSION["user"]['timestamp'] > 900) { //subtract new timestamp from the old one
        unset($_SESSION["user"]);
        echo "<script>window.location = 'http://" . str_replace("index.php", "", $_SERVER['HTTP_HOST'] . $_SERVER['PHP_SELF']) . "'</script>";
        exit;
    } else {
        $_SESSION["user"]['timestamp'] = time(); //set new timestamp
    }
}
// if the browser don't support gz compression init the regular output buffer
if (!ob_start("ob_gzhandler")) {
    ob_start();
}

if(isset($_REQUEST["cpanel"])){define('CPANEL',true);}else{define('CPANEL',false);}
if(isset($_REQUEST["ajaxRequest"])){define('AJAX',true);}else{define('AJAX',false);}
// include
require "library/utils.php";
require "library/controller.php";
require "library/configuration.php";
require "library/lib.route/lib.php";
require "library/lib.data/mysql.php";
require "library/view.php";
if(!AJAX){
    $view = new View;
    $view->registerAsset(array(
        /* System Stylesheets */
        "./assets/css/icon.min.css",
        "./assets/css/colors/colors.css",
        "./assets/css/semantic.min.css",
        "./assets/css/animated.css",
        "./assets/css/jquery.toast.min.css",
        "./assets/css/summernote/summernote-bs4.css",

        /* System JavaScripts */
        "./assets/js/jquery.min.js", 
        "./assets/js/semantic.min.js",
        "./assets/js/semanticfy.js",
        "./assets/js/jquery.form.serialize.js",
        "./assets/js/summernote-bs4.js",
        "./assets/js/jquery.toast.min.js",
        "./assets/js/wow.min.js",
        "./assets/js/jquery.simplefileupload.min.js",
        "./assets/js/system.js",
    ));
}

require (CPANEL?"cpanel":"pages")."/routes.php";
require "library/Rain/autoload.php";
if(!AJAX){
    // config
    $config = array(
        "tpl_dir"       => "templates/".(CPANEL?'cpanel':config::get('defaultTemplate'))."/",
        "cache_dir"     => "cache/",
        "debug"         => false, // set to false to improve the speed
    );

    Rain\Tpl::configure( $config );
    Rain\Tpl::registerPlugin( new Rain\Tpl\Plugin\PathReplace() );
    \Controller::processScriptsArray();

    // create the Tpl object
    $tpl = new Rain\Tpl;
    $html = $tpl->draw(config::get('templateFile'),true);
    $content = Controller::parseHTML($html) ;
}else{
    $content = Controller::parseHTML('<app:view />');
}
echo $content;
/* Load Required CSS and JS */
// namespace
