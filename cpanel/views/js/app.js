
function setSizes() {
    var $height = $(window).height();
    var $width = $(window).width();
    var $snavWidth = $('.side-nav').width();
    var $scWidth = $('.stage .stage-content').width();
    var $toolbarHeight = $('.toolbar').height();
    $('.side-nav').css({ height: $height + "px" });
    $('.stage').css({ height: parseInt($height - $toolbarHeight) + "px" });
    if ($('.stage .stage-sidebar').length) {
        $('.stage .stage-content').css({ "margin-left": "250px", height: parseInt($height-50) +"px" });
        $('.stage .stage-content .ui.placeholder.segment').css({ "width": parseInt($scWidth)+"px" })
    }
    setTimeout(() => {
        $(".scroll-area").niceScroll({cursorwidth:'8px'});
    $(".scroll-area").getNiceScroll().resize();
    }, 100);
    $('[data-content]').popup();
}


$(document).ready(function () {

    setSizes();

    $(window).resize(function () {
        setSizes();
    });

    $(document).on('click', '.stage .list li', function (e) {
        $('.stage .list li').removeClass('active');
        $(this).addClass('active');
    })

    $.ajax({
        url: AJAX_URL + 'system/init/',
        dataType: 'json',
        success: function (res) {
            res.currentPage = '';
            res.pageTitle = 'Dashboard';
            initVue(res)
            setTimeout(function () {
                $('body').removeClass('show-preloader');
                setSizes();
            }, 1000);
        },
        error: function (res) {
            app.message.toast("error", "System Info", "App could not start properly. Please try again later")
        }
    });

    function initVue($data){
        app.vue = new Vue({
            el: '#app',
            data: $data,
            components: {
                'not-found': {
                    created: function(){
                        app.vue.$data.pageTitle = '404 Error';   
                        setTimeout(function () {
                            setSizes();
                        }, 10);
                    },
                    data: function(){
                        return {
                            title: '404 Error'
                        }
                    },
                    template: (`<div class="stage">
                                    <div class="container-404">
                                            <div class="wow bounce error-code infinite" data-wow-duration="5s" data-wow-delay="">4</div>
                                            <div class="wow bounce error-code infinite" data-wow-duration="5s" data-wow-delay="100ms">0</div>
                                            <div class="wow bounce error-code infinite" data-wow-duration="5s" data-wow-delay="400ms">4</div>
                                        <p>Sorry!! We can't find the page you are looking for.</p>
                                        <a href="./cpanel/#/dashboard/" class="ui button black">Back to Dashboard</a>
                                    </div>
                                </div>`)
                }
            },
            created: function () {                
                this.navigate()
            },
            computed: {},
            methods: {
                navigate: function () {
                    var $currentPage = window.location.hash.replace('#/', '');
                    $currentPage = ($currentPage ? $currentPage : '/dashboard/')
                    var $compName = $currentPage.replace(/[^a-zA-Z0-9]/g, '');
                    var $getView = false;
                    var $this = this;
                    if (!this.$root.$options.components[$compName]) {
                        $getView = true;
                    } else {
                        $getView = false;
                    }
                    $.ajax({
                        url: AJAX_URL + $currentPage,
                        dataType: 'json',
                        data: { view: $getView },
                        success: function (res) {
                            try {
                                if (!$this.$root.$options.components[$compName]) {
                                    $this.$root.$options.components[$compName] = {};
                                    $this.$root.$options.components[$compName].template = '<div class="stage">' + res.view + '</div>';
                                    if (res.options) {
                                        var $options = eval('(' + $.base64.decode(res.options) + ')');
                                        for (const key in $options) {
                                            if ($options.hasOwnProperty(key)) {
                                                const element = $options[key];
                                                $this.$root.$options.components[$compName][key] = element;
                                            }
                                        }
                                    }
                                }
                                $this.pageTitle = (res.title ? res.title : 'Dashboard');
                                $this.data = res.data;
                                $this.$root.$options.components[$compName].data = function () {
                                    return { data: $this.data }
                                };
                                $this.currentPage = $compName;
                                setTimeout(function () {
                                    setSizes();
                                }, 10);

                            } catch (error) {
                                app.message.toast("error", "System Info", "Error rendering page content. Please try again.");
                            }
                        },
                        error: function (res) {
                            $this.currentPage = 'not-found';
                            app.message.toast("error", "System Info", "Please check internet connectivity.");
                        }
                    });

                }
            }
        });
    }

    

    $('[data-content]').popup();


    window.addEventListener("hashchange", function (e) {
        app.vue.navigate()
    }, false);

})
