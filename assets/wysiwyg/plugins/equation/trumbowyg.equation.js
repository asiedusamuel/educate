(function ($) {
    'use strict';

    // My plugin default options
    var defaultOptions = {
    };

    $.extend(true, $.trumbowyg, {
        // Add some translations
        langs: {
            en: {
                equation: 'Equation'
            }
        },
        // Add our plugin to Trumbowyg registred plugins
        plugins: {
            kotex: {
                init: function (trumbowyg) {                    
                    // Fill current Trumbowyg instance with my plugin default options
                    trumbowyg.o.plugins.kotex = $.extend(true,
                        defaultOptions,
                        trumbowyg.o.plugins.kotex || {}
                    );

                    var convertToKoTex = function(v){
                        var $element = $('<span class="kotext-equation" />')
                        var formatted = katex.renderToString(v.equation, {
                            throwOnError: false
                        });
                        var node = $(formatted)[0];
                        trumbowyg.range.deleteContents();
                        trumbowyg.range.insertNode(node);
                    }

                    function getSelectionText() {
                        var text = "";
                        if (window.getSelection) {
                            text = window.getSelection().toString();
                        } else if (document.selection && document.selection.type != "Control") {
                            text = document.selection.createRange().text;
                        }
                        return text;
                    }


                    var triggerEquationInsert= function(obj){
                        var selectedText = getSelectionText();
                        console.log(selectedText);
                        
                        
                        var $modal = trumbowyg.openModalInsert('Insert Equation',{
                            equation: {
                                label: 'Equation Syntax',
                                value: selectedText
                            },
                        }, convertToKoTex);
                        $modal.on('tbwconfirm', function(e){
                            // Do what you want
                            trumbowyg.closeModal();
                        });
                        $modal.on('tbwcancel', function(e){
                            trumbowyg.closeModal();
                        });
                    }

                    var ButtonDef = {
                        title: 'Insert Equation',
                        text: '<i style="font-size:0.8em" class="icon percent"></i>',
                        key: 'K',
                        hasIcon: false,
                        fn: triggerEquationInsert
                    }
                    // If my plugin is a paste handler, register it
                    trumbowyg.pasteHandlers.push(function (pasteEvent, g) {
                        // My plugin paste logic
                        
                    });

                    // If my plugin is a button
                    trumbowyg.addBtnDef('kotex', ButtonDef);
                },
                tagHandler: function (element, trumbowyg) {
                    return [];
                },
                destroy: function () {
                }
            }
        }
    })
})(jQuery);