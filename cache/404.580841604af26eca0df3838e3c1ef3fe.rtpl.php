<?php if(!class_exists('Rain\Tpl')){exit;}?><!DOCTYPE html>
<html>

<head>
    <meta charset="utf-8">
    <base href='<app:config field="url" />' />
    <title><app:config field="sitename" /></title>
    <meta name="description" content="">
    <meta name="keywords" content="">
    <meta name="author" content="Asiedu Samuel">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <link rel="icon" href="<?php echo static::$conf['base_url']; ?>templates/educate/img/icon.png" type="image/png">

    <!-- Google Fonts -->
    <link href='http://fonts.googleapis.com/css?family=Montserrat:100,200,300,400,500,600,700,800,900' rel='stylesheet'
        type='text/css'>
    <link rel="stylesheet" href="<?php echo static::$conf['base_url']; ?>templates/educate/css/icon.min.css" type="text/css">
    <link rel="stylesheet" href="<?php echo static::$conf['base_url']; ?>templates/educate/css/owl.carousel.min/owl.carousel.min.css" type="text/css">
    <link rel="stylesheet" href="<?php echo static::$conf['base_url']; ?>templates/educate/css/bootstrap.min.css" type="text/css">
    <link rel="stylesheet" href="<?php echo static::$conf['base_url']; ?>templates/educate/css/style.css" type="text/css">
    <link rel="stylesheet" href="<?php echo static::$conf['base_url']; ?>templates/educate/css/menu.css" type="text/css">
</head>

<body>
    <section class="wrap-content">
        <header class="wrap-header start_bg_zoom random-bg">
            <div class="info-box-01">
                <div class="container">
                    <div class="row">
                        <div class="col-sm-12 col-md-4 col-lg-4 text-sm-center">
                            <ul class="social-list-01">
                                <li>
                                    <a href="<?php echo static::$conf['base_url']; ?>#">
                                        <i class="icon facebook f" aria-hidden="true"></i>
                                    </a>
                                </li>
                                <li>
                                    <a href="<?php echo static::$conf['base_url']; ?>#">
                                        <i class="icon twitter" aria-hidden="true"></i>
                                    </a>
                                </li>
                                <li>
                                    <a href="<?php echo static::$conf['base_url']; ?>#">
                                        <i class="icon instagram" aria-hidden="true"></i>
                                    </a>
                                </li>
                                <li>
                                    <a href="<?php echo static::$conf['base_url']; ?>#">
                                        <i class="icon google plus g" aria-hidden="true"></i>
                                    </a>
                                </li>
                            </ul>
                        </div>
                        <div class="col-sm-12 col-md-8 col-lg-8 text-sm-center text-right">
                            <div class="contact-block-01">
                                <a class="contact-block-01__email" href="mailto:#"><i class="icon mail"></i>
                                    smartedu@localhost</a>
                                <p class="contact-block-01__phone"><i class="icon phone"></i> 020 000 0000</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="main-nav">
                <div class="container">
                    <div class="row">
                        <div class="col-lg-2 col-sm-12 col-md-2 cssmenu-btn-placeholder">
                            <a href="<?php echo static::$conf['base_url']; ?>./" class="logo">
                                <img src="<?php echo static::$conf['base_url']; ?>templates/educate/img/logo_white.png" alt="">
                            </a>
                        </div>
                        <div class="col-lg-10 col-sm-12 col-md-10" id='cssmenu'>
                            <ul class="main-nav-list mainmenu">
                                <li class="active"><a href='#'>Home</a></li>
                                <li class='has-sub'><a href='#'>Explore</a>
                                    <app:plugin shortcode="navigation" execute="renderExplore" />
                                </li>
                                <li><a href='#'>About</a></li>
                                <li><a href='#'>Contact</a></li>
                                <li class="user-auth-link login"><a href="<?php echo static::$conf['base_url']; ?>#"><i class="icon unlock small"></i> Sign In</a></li>
                                <li class="user-auth-link register"><a href="<?php echo static::$conf['base_url']; ?>#"><i class="icon user small"></i>
                                        Register</a></li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </header>
    </section>

    <section class="content-row">
        <div class="container">
            <div class="row text-center center text">
                <h3 class="page404-title">404</h3>
                <p class="page404-subtitle">Oops! Page Not Found!</p>
                <p class="page404-text">Either Something Went Wrong or the Page Doesn't Exist Anymore.</p>
                <form action="<?php echo static::$conf['base_url']; ?>./" class="page404-form">
                    <div class="page404-form-box">
                        <input class="page404-form-text" placeholder="Search..." type="text" name="inp-text">
                        <button class="page404-form-btn" type="button">Search</button>
                    </div>
                    <br/>
                    <br/>
                    <a class="btn-custom" href="<?php echo static::$conf['base_url']; ?>/">Take me home</a>
                </form>
            </div>
        </div>
    </section>

    <section class="footer">
        <div class="container">
            <div class="row">
                <div class="col-lg-1">
                    <a href="<?php echo static::$conf['base_url']; ?>./" class="logo">
                        <img src="<?php echo static::$conf['base_url']; ?>templates/educate/img/logo_white.png" alt="">
                    </a>
                </div>
                <div class="col-lg-11">
                    <ul class="footer-links">
                        <li>&copy; Smart Education 2018</li>
                        <li><a href="<?php echo static::$conf['base_url']; ?>#">Privacy Policy</a></li>
                        <li><a href="<?php echo static::$conf['base_url']; ?>#">Terms of Use</a></li>
                        <li class="author"><a href="http://filycoder.com" target="_blank">Developed by Filly Coder</a></li>
                    </ul>
                </div>
            </div>
            
        </div>
        
    </section>
    <script type="text/javascript" src="<?php echo static::$conf['base_url']; ?>templates/educate/js/jquery.min.js"></script>
    <script type="text/javascript" src="<?php echo static::$conf['base_url']; ?>templates/educate/js/menu.js"></script>
    <script type="text/javascript" src="<?php echo static::$conf['base_url']; ?>templates/educate/js/owl.carousel.min.js"></script>
    <script type="text/javascript" src="<?php echo static::$conf['base_url']; ?>templates/educate/js/script.js"></script>
</body>

</html>