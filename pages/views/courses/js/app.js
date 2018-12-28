$(document).ready(function(){
    var $ajax = {abort:function(){}};
    $('#rating').barrating({
        initialRating: 4.1,
        theme: 'fontawesome-stars-o',
        readyonly: true,
        hoverState: false,
    });
    
    $(".playlist li").click(function (e) {
        $(this).addClass('active').siblings().removeClass('active');
    });

    window.player = new Plyr('#player');
    $(document).on("md-close", function (a) {
        if(a.modal =="modal-start-lesson"){
            $ajax.abort();
        }        
    });
    $(document).on("md-opened", function (a) {
        var $target = $(a.ev.target);
        if($target.data('modal') == "modal-start-lesson"){
            setPanelSizes();
            $('#modal-start-lesson .video-panel').addClass('ui form loading');
            $('#modal-start-lesson .nav-panel ul li a:not(.md-close)').parent().hide();
            $('#player').hide();
            $ajax = $.ajax({
                method: 'GET',
                dataType:'json',
                url: AJAX_URL+'course/core-maths/load-playlist/'
            });      
        }
        
        /* window.player.source = {
            type: 'video',
            title: 'Example title',
            sources: [
                {
                    src: './videos/720p/vid.mp4',
                    type: 'video/mp4',
                    size: 720,
                },
                {
                    src: '/path/to/movie.webm',
                    type: 'video/webm',
                    size: 1080,
                },
            ]
        } */
    });
})