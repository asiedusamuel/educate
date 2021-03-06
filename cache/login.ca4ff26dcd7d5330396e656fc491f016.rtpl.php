<?php if(!class_exists('Rain\Tpl')){exit;}?><!DOCTYPE html>
<html>

<head>
    <meta charset="utf-8">
    <base href='<app:config field="url"/>' />
    <title><app:config field="sitename"/></title>
    <meta name="description" content="">
    <meta name="keywords" content="">
    <meta name="author" content="Asiedu Samuel">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <link rel="icon" href="<?php echo static::$conf['base_url']; ?>templates/cpanel/img/icon.png" type="image/png">

    <!-- Google Fonts -->
    <link href='http://fonts.googleapis.com/css?family=Montserrat:100,200,300,400,500,600,700,800,900' rel='stylesheet'
        type='text/css'>
    <app:stylesheets />

    <link rel="stylesheet" href="<?php echo static::$conf['base_url']; ?>templates/cpanel/css/bootstrap.min.css" type="text/css">
    <link rel="stylesheet" href="<?php echo static::$conf['base_url']; ?>templates/cpanel/css/login-style.css" type="text/css">
    <link rel="stylesheet" href="<?php echo static::$conf['base_url']; ?>templates/cpanel/css/login-theme.css" type="text/css">
</head>
<body>
    <div class="form-body">
        <div class="website-logo">
            <a href="<?php echo static::$conf['base_url']; ?>index.html">
                <div class="logo">
                    <img class="logo-size" src="<?php echo static::$conf['base_url']; ?>templates/cpanel//images/logo.png" alt="">
                </div>
            </a>
        </div>
        <div class="row">
            <div class="img-holder">
                <div class="bg"></div>
                <div class="info-holder">
                    <img src="<?php echo static::$conf['base_url']; ?>templates/cpanel/images/graphic1.svg" alt="">
                </div>
            </div>
            <div class="form-holder">
                <div class="form-content">
                    <div class="form-items">
                        <h3>Get more things done with the Control Panel.</h3>
                        <p>Access to the most powerfull tools to control your content.</p>
                        <div class="page-links">
                            <a class="active">Login</a>
                        </div>
                        <form class="ui form login">
                            <div class="field">
                                <input data-ui-validate data-ui-empty="" data-ui-email="" type="text" name="username" placeholder="E-mail Address">
                            </div>
                            <div class="field">
                                <input type="password" data-ui-validate data-ui-empty="" name="password" placeholder="Password">
                            </div>
                            
                            
                            <div class="form-button">
                                <button type="submit" class="ibtn">Login</button> <a href="javascript:;">Forget password?</a>
                            </div>
                        </form>
                        <div class="other-links center">
                            <span>Developed with <i class="icon heart" style="color:#f30;"></i> By <a href="http://fillycoder.com">Filly Coder</a></span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
<app:scripts />
<script src="<?php echo static::$conf['base_url']; ?>templates/cpanel//js/bootstrap.bundle.min.js"></script>
<script>
$(document).ready(function(){
    $('.ui.login.form').semanticfy();
    $('.ui.login.form').submit(function(e){
        var $this = $(this);
        var $data = $this.serializeJSON();
        $this.addClass('loading');
        $.ajax({
            url: AJAX_URL+'auth/validate/',
            data: $data,
            dataType:'json',
            success:function(res){
                if(res.hasOwnProperty('success')){
                    app.message.toast("success","Login Info",res.success);
                    setTimeout(() => {
                        window.location.reload();
                    }, 2000);
                }else{
                    $this.removeClass('loading');
                }
            },
            error:function(res){
                $this.removeClass('loading');
                app.message.toast("error","Login Info","An error occured while processing. Please try again after some time.")
            }
        })
        e.preventDefault();
    })
});
</script>
</body>
</html>