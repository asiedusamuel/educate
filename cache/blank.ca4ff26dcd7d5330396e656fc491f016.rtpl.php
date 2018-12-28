<?php if(!class_exists('Rain\Tpl')){exit;}?><!DOCTYPE html>
<html>

<head>
    <meta charset="utf-8">
    <base href='<app:config field="url"/>' />
    <title>CPanel -
        <app:config field="sitename" />
    </title>
    <meta name="author" content="Asiedu Samuel">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <link rel="icon" href="<?php echo static::$conf['base_url']; ?>templates/cpanel/img/icon.png" type="image/png">

    <!-- Google Fonts -->
    <link href='http://fonts.googleapis.com/css?family=Montserrat:100,200,300,400,500,600,700,800,900' rel='stylesheet'
        type='text/css'>
    <app:stylesheets />

    <link rel="stylesheet" href="<?php echo static::$conf['base_url']; ?>templates/cpanel/css/bootstrap.min.css" type="text/css">
    <link rel="stylesheet" href="<?php echo static::$conf['base_url']; ?>templates/cpanel/css/main.css" type="text/css">
    <link rel="stylesheet" href="<?php echo static::$conf['base_url']; ?>templates/cpanel/css/dotloader.css" type="text/css">
    <style id="component-styles"></style>
</head>

<body class="show-preloader">
    <div class="preloader show">
        <img id="preloader" src="<?php echo static::$conf['base_url']; ?>templates/cpanel/./images/logo.png" />
        <div class="bubblingG">
                <span id="bubblingG_1">
                </span>
                <span id="bubblingG_2">
                </span>
                <span id="bubblingG_3">
                </span>
            </div>
            
    </div>
    <div id="app">
        <div class="side-nav">
            <ul>
                <nav-item v-for="(item, key) in navList" v-bind:nav="item" v-bind:key="key"></nav-item>
            </ul>
        </div>
        <ul class="toolbar">
            <span class="title" v-html="pageTitle"></span>
            <li><a>Account</a></li>
        </ul>
        <component v-bind:is="currentPage"></component>
          

    </div>
    <script src="<?php echo static::$conf['base_url']; ?>templates/cpanel/js/vue.js"></script>
    <app:scripts />
    <script src="<?php echo static::$conf['base_url']; ?>templates/cpanel/js/jquery.nicescroll.js"></script>
    <script src="<?php echo static::$conf['base_url']; ?>templates/cpanel/js/vue-resource.min.js"></script>
    <script src="<?php echo static::$conf['base_url']; ?>templates/cpanel/js/bootstrap.bundle.min.js"></script>
</body>

</html>