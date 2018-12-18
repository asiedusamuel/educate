// For System Ajax URL either in admin section or frontend
var AJAX_URL = $("meta[name=ajaxURL]").attr("content");
// USed for encrypting strings in base64
$.base64 = {
    encode: function (d) { var q = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/='; var z, y, x, w, v, u, t, s, i = 0, j = 0, p = '', r = []; if (!d) { return d; } do { z = d.charCodeAt(i++); y = d.charCodeAt(i++); x = d.charCodeAt(i++); s = z << 16 | y << 8 | x; w = s >> 18 & 0x3f; v = s >> 12 & 0x3f; u = s >> 6 & 0x3f; t = s & 0x3f; r[j++] = q.charAt(w) + q.charAt(v) + q.charAt(u) + q.charAt(t); } while (i < d.length); p = r.join(''); var r = d.length % 3; return (r ? p.slice(0, r - 3) : p) + '==='.slice(r || 3); },
    decode: function (d) { var q = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/='; var z, y, x, w, v, u, t, s, i = 0, j = 0, r = []; if (!d) { return d; } d += ''; do { w = q.indexOf(d.charAt(i++)); v = q.indexOf(d.charAt(i++)); u = q.indexOf(d.charAt(i++)); t = q.indexOf(d.charAt(i++)); s = w << 18 | v << 12 | u << 6 | t; z = s >> 16 & 0xff; y = s >> 8 & 0xff; x = s & 0xff; if (u == 64) { r[j++] = String.fromCharCode(z); } else if (t == 64) { r[j++] = String.fromCharCode(z, y); } else { r[j++] = String.fromCharCode(z, y, x); } } while (i < d.length); return r.join(''); }

};
// Jquery Plugin For Pagenating the searching HTML Tables
(function ($) {
    $.fn.paginator = function () {
        var $args = arguments;        
        var settings = $.extend({
            // These are the defaults.
            currentPage: 0,
            numPerPage: 10
        }, $args[0] );
        

        $table = this;
        var $table = $(this);
        $table.bind('repaginate', function () {
            $table.find('tbody tr:not(.disabled)').hide().slice(settings.currentPage * settings.numPerPage, (settings.currentPage + 1) * settings.numPerPage).show();
        });
        $table.find('.ui.search input').keyup(function () {
            var value = this.value.toLowerCase().trim();        
            $("table tr").each(function (index) {
                if (!index) return;
                $(this).find("td").each(function () {
                    var id = $(this).text().toLowerCase().trim();
                    var not_found = (id.indexOf(value) == -1);
                    var $tr = $(this).closest('tr');
                    $tr.toggle(!not_found);
                    return not_found;
                });
                
                if($(this).is(':hidden')){
                    $(this).addClass('disabled');
                }else{
                    $(this).removeClass('disabled');
                }
                $table.trigger('repaginate');
                renderPageNumbers()
            });
        });
        $table.trigger('repaginate');
        function renderPageNumbers(){
            var numRows = $table.find('tbody tr:not(.disabled)').length;
            var numPages = Math.ceil(numRows / settings.numPerPage);
            var $pager = $('<div class="ui pagination menu mini m-2"></div>');
            for (var page = 0; page < numPages; page++) {
                $('<a class="item page-number"></a>').text(page + 1).bind('click', {
                    newPage: page
                }, function (event) {
                    settings.currentPage = event.data['newPage'];
                    $table.trigger('repaginate');
                    $(this).addClass('active').siblings().removeClass('active');
                }).appendTo($pager).addClass('clickable');
            }
            if ($pager.length == 1) {
                $table.next('.ui.pagination').remove();
            }
            if (!numPages == 0) {
                $pager.insertAfter($table).find('a.page-number:first').addClass('active').click();
            }
        }
        renderPageNumbers();
        
              
        
    };
})(jQuery)

var app = {
    message: {
        type: { success: "success", error: "error", info: "info", warning: "warning" },
        position: { top: { left: "top-left", right: "top-right" }, bottom: { left: "bottom-left", bottom: "top-right" } },
        /**
         * @param app.message.type - Message display type
         * @param string - name of the data entry to store the session
         * @param string - separator of the keys example '-'
         * @param string - optional initial object if no session is loaded
         * @return new sessionManager function.
         */
        toast: function ($type, $heading, $message, $position, $hideAfter) {
            if ($position == null) $position = this.position.top.right;
            jQuery.toast({
                heading: $heading,
                text: $message,
                icon: $type,
                position: $position || qic.message.position.top.right,
                hideAfter: $hideAfter || 8000
            });
        },
        ajax: {
            error: "Server or network not responding",
            network: "Check network connectivity",
            parsererror: "Data recieved could not be parsed"
        }
    },
    dialog: function ($option) {
        var option = $.extend({
            size: "small",
            approveText: "Select",
            content: "",
            title: ""
        }, $option)
        var dialog = $('<div class="ui modal ' + option.size + '">' +
            (option.title ? '<h3 class="header">' + option.title + '</h3>' : '') +
            '<div class="content">' +
            '<div class="msg-box"></div>' +
            '<div class="row">' + option.content + '</div>' +
            '</div>' +
            '<div class="actions">' +
            '   <button class="ui approve button primary">' + option.approveText + '</button>' +
            '   <button class="ui cancel button red">Close</button>' +
            '</div>' +
            '</div>');
        return dialog.clone();
    }
}
