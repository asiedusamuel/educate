/*
     * ----------------------------------------------------------------------------------------
     *  TYPE EFFECT JS
     * ----------------------------------------------------------------------------------------
     */

var TxtType = function (el, toRotate, period) {
    this.toRotate = toRotate;
    this.el = el;
    this.loopNum = 0;
    this.period = parseInt(period, 10) || 1000;
    this.txt = '';
    this.tick();
    this.isDeleting = false;
};

TxtType.prototype.tick = function () {
    var i = this.loopNum % this.toRotate.length;
    var fullTxt = this.toRotate[i];

    if (this.isDeleting) {
        this.txt = fullTxt.substring(0, this.txt.length - 1);
    } else {
        this.txt = fullTxt.substring(0, this.txt.length + 1);
    }

    this.el.innerHTML = '<span class="wrap">' + this.txt + '</span>';

    var that = this;
    var delta = 150 - Math.random() * 100;

    if (this.isDeleting) {
        delta /= 2;
    }

    if (!this.isDeleting && this.txt === fullTxt) {
        delta = this.period;
        this.isDeleting = true;
    } else if (this.isDeleting && this.txt === '') {
        this.isDeleting = false;
        this.loopNum++;
        delta = 500;
    }

    setTimeout(function () {
        that.tick();
    }, delta);
};

function startTyper() {
    var elements = document.getElementsByClassName('typewrite');
    for (var i = 0; i < elements.length; i++) {
        var toRotate = elements[i].getAttribute('data-type');
        var period = elements[i].getAttribute('data-period');
        if (toRotate) {
            new TxtType(elements[i], JSON.parse(toRotate), period);
        }
    }
    // INJECT CSS
    var css = document.createElement("style");
    css.type = "text/css";
    css.innerHTML = ".typewrite > .wrap { border-right: 0.02em solid #fff}";
    document.body.appendChild(css);
}

function setPanelSizes() {
    var $screenHeight = $(window).height();
    var $screenWidth = $(window).width();

    var $descPanelWidth = parseInt($('.description-panel').width());
    if($('.description-panel').hasClass('d-none')) $descPanelWidth = 0;

    var $navPanelWidth = parseInt($('.nav-panel').width());
    if($('.nav-panel').hasClass('d-none')) $navPanelWidth = 0;
    console.log($descPanelWidth, $navPanelWidth);
    
    $('.video-panel').css({ height: $screenHeight + "px", width: ($screenWidth - $descPanelWidth - $navPanelWidth) });
    $('.description-panel').css({ height: $screenHeight + "px" });
    $('.nav-panel').css({ height: $screenHeight + "px" });
}
setPanelSizes();

$(document).ready(function () {
    var images = ['./templates/educate/img/home_section_2.jpg', './templates/educate/img/home_section_3.jpg'];
    $('.random-bg').css({ 'background-image': 'url(' + images[Math.floor(Math.random() * images.length)] + ')' });
    startTyper();    

    $(".course-brief-tab a").click(function (e) {
        var $href = $(this).attr("href").replace("#", "");
        $('.course-brief-tab a').removeClass('active')
        $(this).addClass('active')
        $('.course-brief-tab-content .tab-pane')
            .removeClass('show active')
            .parent().find('.tab-pane#' + $href)
            .addClass('show active');
            e.preventDefault();
    });

    $(".nav-panel a:not(.md-close)").click(function (e) {
        var $nav = $(this).data("nav")
        $('.nav-panel a').removeClass('active')
        $(this).addClass('active')

        $('.description-panel div[data-nav]').removeClass('active')
        $('.description-panel div[data-nav="' + $nav + '"]').addClass('active');
            
    });


    $(window).resize(function () {
        setPanelSizes();
    });



});

