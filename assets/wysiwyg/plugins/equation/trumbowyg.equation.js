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
            equations: {
                elements: {
                    mathsPanel: $('<div class="trumbowyg-math-panel"></div>'),
                    mathsRenPanel: $('<div class="render-pane">Editor</div>'),
                    fnCatagory: $('<div class="functions-category"></div>'),
                    fnCatPanel: $('<div class="functions-category-pane"></div>'),
                    fnBtn: $('<div class="fnBtn"></div>'),
                    functions:{
                        accents:[
                            {
                                syntax:(`a'`),
                                regex: '/(*)\'/g'
                            },
                            {
                                syntax:(`\\tilde{a}`),
                                regex: '/(*)\'/g'
                            },
                            {
                                syntax:(`\\mathring{g}`),
                                regex: '/(*)\'/g'
                            },
                            {
                                syntax:(`a''`),
                                regex: '/(*)\'/g'
                            },
                            {
                                syntax:(`\\widetilde{ac}`),
                                regex: '/(*)\'/g'
                            },
                            {
                                syntax:(`\\overgroup{AB}`),
                                regex: '/(*)\'/g'
                            },
                            {
                                syntax:(`\\undergroup{AB}`),
                                regex: '/(*)\'/g'
                            },
                            {
                                syntax:(`a^{\\prime}`),
                                regex: '/(*)\'/g'
                            },
                            {
                                syntax:(`\\utilde{AB}`),
                                regex: '/(*)\'/g'
                            },
                            {
                                syntax:(`\\acute{a}`),
                                regex: '/(*)\'/g'
                            },
                            {
                                syntax:(`\\vec{F}`),
                                regex: '/(*)\'/g'
                            },
                            {
                                syntax:(`\\Overrightarrow{AB}`),
                                regex: '/(*)\'/g'
                            },
                            {
                                syntax:(`\\overleftarrow{AB}`),
                                regex: '/(*)\'/g'
                            },
                            {
                                syntax:(`\\overrightarrow{AB}`),
                                regex: '/(*)\'/g'
                            },
                            {
                                syntax:(`\\underrightarrow{AB}`),
                                regex: '/(*)\'/g'
                            },
                            {
                                syntax:(`\\underleftarrow{AB}`),
                                regex: '/(*)\'/g'
                            },
                            {
                                syntax:(`\\bar{y}`),
                                regex: '/(*)\'/g'
                            },
                            {
                                syntax:(`\\breve{a}`),
                                regex: '/(*)\'/g'
                            },
                            {
                                syntax:(`\\check{a}`),
                                regex: '/(*)\'/g'
                            },
                            {
                                syntax:(`\\overleftharpoon{ac}`),
                                regex: '/(*)\'/g'
                            },
                            {
                                syntax:(`\\overrightharpoon{ac}`),
                                regex: '/(*)\'/g'
                            },
                            {
                                syntax:(`\\dot{a}`),
                                regex: '/(*)\'/g'
                            },
                            {
                                syntax:(`\\ddot{a}`),
                                regex: '/(*)\'/g'
                            },
                            {
                                syntax:(`\\overleftrightarrow{AB}`),
                                regex: '/(*)\'/g'
                            },
                            {
                                syntax:(`\\underleftrightarrow{AB}`),
                                regex: '/(*)\'/g'
                            },
                            {
                                syntax:(`\\overbrace{AB}`),
                                regex: '/(*)\'/g'
                            },
                            {
                                syntax:(`\\underbrace{AB}`),
                                regex: '/(*)\'/g'
                            },
                            {
                                syntax:(`\\grave{a}`),
                                regex: '/(*)\'/g'
                            },
                            {
                                syntax:(`\\overline{AB}`),
                                regex: '/(*)\'/g'
                            },
                            {
                                syntax:(`\\underline{AB}`),
                                regex: '/(*)\'/g'
                            },
                            {
                                syntax:(`\\hat{\\theta}`),
                                regex: '/(*)\'/g'
                            },
                            {
                                syntax:(`\\overlinesegment{AB}`),
                                regex: '/(*)\'/g'
                            },
                            {
                                syntax:(`\\widehat{ac}`),
                                regex: '/(*)\'/g'
                            },
                            {
                                syntax:(`\\widecheck{ac}`),
                                regex: '/(*)\'/g'
                            },

                        ],
                        delimiters:[],
                        environments:[],
                        "letters-and-unicode":[],
                        annotation:[],
                        "line-break":[],
                        "vertical-layout":[],
                        "overlap-and-spacing":[],
                    }
                },
                init: function (trumbowyg) {
                    var $this = this;
                    // Fill current Trumbowyg instance with my plugin default options  
                    trumbowyg.o.plugins.equations = $.extend(true,
                        defaultOptions,
                        trumbowyg.o.plugins.equations || {}
                    );

                    var buildButtons = function($arr, $cat){ 
                        
                            $arr.forEach(function(el){
                            var $btn = $this.elements.fnBtn.clone();
                            var $btnText = katex.renderToString(el.syntax, {
                                throwOnError: false
                            });
                            $btn.html($btnText)
                            $cat.append($btn)
                        });
                         
                                             
                        
                    }

                    var buildMathFunctions = function(){
                        for (const key in $this.elements.functions) {
                            if ($this.elements.functions.hasOwnProperty(key)) {
                                const mcategory = $this.elements.functions[key];
                                var $cat = $this.elements.fnCatagory.clone();
                                var $title = $('<h5 />')
                                $title.html(key.replace(/-/g,' ')+ ' <em>('+mcategory.length+' functions)</em>')
                                $cat.append($title)
                                if(mcategory.length > 0){
                                    $this.elements.fnCatPanel.append($cat)
                                    buildButtons(mcategory, $cat)
                                }
                                
                            }
                        }
                    }
                    setTimeout(function () {
                        var $box = trumbowyg.$box;
                        var $editor = trumbowyg.$ed;
                        var $btnPane = trumbowyg.$btnPane;

                        var $boxHeight = $box.height() - $btnPane.height() + 'px';
                        var $boxWidth = $box.width() + 'px';
                        $this.elements.mathsPanel.css({height: $boxHeight })
                        $box.append($this.elements.mathsPanel)
                        $this.elements.mathsPanel.append($this.elements.mathsRenPanel)
                        $this.elements.mathsPanel.append($this.elements.fnCatPanel)
                        buildMathFunctions();
                    }, 100);


                    //$box.append()
                    var openMathsPane = function () {
                        $this.elements.mathsPanel.toggleClass('active')
                    }

                    var convertToKoTex = function (v) {
                        var $element = $('<span class="kotext-equation" />')
                        var formatted = katex.renderToString(v.equation, {
                            throwOnError: false
                        });
                        var node = $(formatted)[0];
                        trumbowyg.range.deleteContents();
                        trumbowyg.range.insertNode(node);

                        trumbowyg.$c.trigger("tbwchange");
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


                    var triggerEquationInsert = function (obj) {
                        var selectedText = getSelectionText();
                        var textarea = '<label>Equation Syntax</label><div class=" m-2"><textarea name="equation" class="form-control" placeholder="Enter Equation">' + selectedText + '</textarea></div>'

                        var $modal = trumbowyg.openModal('Insert Equation', textarea, convertToKoTex);
                        $modal.on('tbwconfirm', function (e, b) {
                            // Do what you want
                            var $form = $modal.find('form').serializeJSON()
                            convertToKoTex($form)
                            trumbowyg.closeModal();
                        });
                        $modal.on('tbwcancel', function (e) {
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

                    var ButtonMathsPan = {
                        title: 'Insert Equation',
                        text: '<i class="icon medium"></i>',
                        key: 'Alt + M',
                        hasIcon: false,
                        fn: openMathsPane
                    }
                    // If my plugin is a paste handler, register it
                    trumbowyg.pasteHandlers.push(function (pasteEvent, g) {
                        // My plugin paste logic

                    });

                    // If my plugin is a button
                    trumbowyg.addBtnDef('kotex', ButtonDef);
                    trumbowyg.addBtnDef('equations', ButtonMathsPan);
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