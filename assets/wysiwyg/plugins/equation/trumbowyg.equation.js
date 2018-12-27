(function ($) {
    'use strict';

    // My plugin default options
    var defaultOptions = {
    };

    $.extend(true, $.trumbowyg, {
        // Add some translations
        langs: {
            en: {
                mapsto: 'Maps To',
                infty: 'Infinity',
                '\\\\':'Space'
            }
        },
        // Add our plugin to Trumbowyg registred plugins
        plugins: {
            equations: {
                elements: {
                    MQMathField: '',
                    functions: {
                        accents: ['a', "a''",'a^\\prime', '\\vec{F}', '\\overleftarrow{AB}',
                            '\\overrightarrow{AB}', '\\bar{y}', '\\overline{AB}', '\\underline{AB}'
                        ],
                        delimiters: ['\\mid', '\\parallel', '\\left\\{\\right\\}', '\\uparrow', '\\downarrow', '\\Uparrow', '\\Downarrow', '/', '\\angle', '\\lceil', '\\rceil', '\\lfloor', '\\rfloor'],
                        'set-and/or-logic-notation': ['\\exists', '\\rightarrow', '\\leftarrow', '\\forall', '\\mapsto', '\\neg', '\\implies', '\\Rightarrow', '\\leftrightarrow', '\\iff', '\\Leftrightarrow', '\\top', '\\land', '\\bot', '\\lor', '\\emptyset'],
                        "greek-letters": ['\\alpha', '\\beta', '\\gamma', '\\Gamma', '\\Delta', '\\delta', '\\epsilon', '\\varepsilon', '\\zeta', '\\eta', '\\Theta', '\\theta', '\\vartheta', '\\iota', '\\kappa', '\\varkappa', '\\Lambda', '\\lambda', '\\nu', '\\Xi', '\\xi', 'O', 'o', '\\pi', '\\Pi', '\\varpi', '\\phi', '\\Phi', '\\varphi', '\\mu', '\\rho', '\\varrho', '\\Sigma', '\\sigma', '\\varsigma', '\\tau', '\\Upsilon', '\\upsilon', '\\chi', '\\Psi', '\\psi', '\\Omega', '\\omega'],
                        'trigonometric-functions': ['\\cos', '\\sin', '\\tan', '\\cot', '\\arcsin', '\\arccos', '\\arctan', '\\arccot', '\\sinh', '\\cosh', '\\tanh', '\\coth', '\\sec', '\\csc'],
                        'relation-symbols': ['>', '<', '\\leq', '\\geq', '\\ll', '\\gg', '\\subset', '\\supset', '\\subseteq', '\\supseteq', '\\nsubseteq', '\\nsupseteq', '\\sqsubset', '\\sqsupset', '\\sqsubseteq', '\\sqsupseteq', '\\preceq', '\\succeq', '\\prec', '\\succ', '=', '\\doteq', '\\parallel', '\\asymp', '\\equiv', '\\vdash', '\\approx', '\\in', '\\smile', '\\cong', '\\simeq', '\\models', '\\sim', '\\perp', '\\propto', '\\neq', '\\sphericalangle', '\\nparallel', '\\bowtie', '\\dashv', '\\ni', '\\frown', '\\notin', '\\mid', '\\measuredangle'],
                        'binary-operations': ['\\pm', '\\mp', '\\times', '\\div', '\\ast', '\\star', '\\dagger', '\\ddagger', '\\cap', '\\cup', '\\uplus', '\\sqcap', '\\sqcup', '\\vee', '\\wedge', '\\cdot', '\\diamond', '\\bigtriangleup', '\\bigtriangledown', '\\triangleleft', '\\triangleright', '\\bigcirc', '\\bullet', '\\wr', '\\oplus', '\\ominus', '\\otimes', '\\ominus', '\\oslash', '\\odot', '\\circ', '\\setminus', '\\amalg'],
                        "other-symbols": ['\\partial', '\\hbar', '\\ell', '\\Re', '\\Im', '\\wp', '\\nabla', '\\infty'],
                        "simple-equations": ['\\cos (2\\theta) = \\cos^2 \\theta - \\sin^2 \\theta','\\sum_{i=1}^{10} t_i', '\\lim_{_{x\\to\\infty}}\\text{expo}\\left(-x\\right)=0', 'x\\equiv a\\text{ (mod b)}', 'k_{n+1} = n^2 + k_n^2 - k_{n-1}','f(n) = n^5 + 4n^2 + 2 |_{n=17}','\\frac{n!}{k!(n-k)!} = \\binom{n}{k}','\\frac{\\frac{1}{x}+\\frac{1}{y}}{y-z}','\\sum_{_{i=1}}^{10}t_i','\\int_0^{\\infty}\\ \\mathrm{e^{-x}}\\ dx'],
                        "fractions": ['\\frac{1}{x-y}','\\frac{1}{2}','^1/_2','1/2','\\left\\{\\frac{x^2}{y^3}\\right\\}'],
                        "roots": ['\\sqrt{\\frac{a}{b}}','\\sqrt[n]{x}','\\sqrt[n]{1+x+x^2+x^3+\\dots+x^n}'],
                        "overlap-and-spacing": ['\\\\'],
                    }
                },
                init: function (trumbowyg) {
                    var $this = this;
                    var MQ = MathQuill.getInterface(2);
                    // Fill current Trumbowyg instance with my plugin default options  
                    trumbowyg.o.plugins.equations = $.extend(true,
                        defaultOptions,
                        trumbowyg.o.plugins.equations || {}
                    );

                    var buildButtons = function ($arr, $tabName, $fnCatPanel) {
                        var $tabContent = $('<div class="tab-content"/>');
                        $arr.forEach(function (el) {
                            var $btn = $('<button type="button" class="fnBtn"></button>');
                            $tabContent.append($btn);
                            var title = el.replace(/[^a-zA-Z0-9]/g, '');
                            title = (trumbowyg.lang.hasOwnProperty(title) ? trumbowyg.lang[title] : title);
                            var mathField = MQ.StaticMath($btn[0]);
                            mathField.latex(el);
                            $btn.attr('data-syntax', el)
                            $btn.attr('title', title)
                            $btn.click(function (e) {
                                var $annotation = $(this).data('syntax');
                                $this.elements.MQMathField.write($annotation);
                                $this.elements.MQMathField.focus()
                                e.preventDefault();
                            })
                        });
                        $tabContent.attr('data-tab', $tabName)
                        $tabContent.appendTo($fnCatPanel);
                    }

                    var buildMathFunctions = function ($fnCatPanel, $fnTab) {
                        var $scrollLeft = $('<li class="scroller"/>');
                        var $scrollRight = $scrollLeft.clone();
                        var mouseEvent = ''
                        
                        $scrollLeft.mousedown(function () {
                            mouseEvent = setInterval(() => {
                                $fnTab.animate({
                                    scrollLeft: "-=100px"
                                }, "fast");
                            }, 100);

                        }).mouseup(function(){clearInterval(mouseEvent)});
                        $scrollRight.mousedown(function () {
                            mouseEvent = setInterval(() => {
                                $fnTab.animate({
                                    scrollLeft: "+=100px"
                                }, "fast");
                            }, 100);

                        }).mouseup(function(){clearInterval(mouseEvent)});
                        $fnCatPanel.append($fnTab)
                        $fnTab.append($scrollLeft)
                        for (const key in $this.elements.functions) {
                            if ($this.elements.functions.hasOwnProperty(key)) {
                                const mcategory = $this.elements.functions[key];
                                var $tab = $('<li/>');
                                $tab.attr("data-tab", key).click(function () {
                                    $(this).addClass('active').siblings().removeClass('active');
                                    $fnCatPanel.find('.tab-content').removeClass('active').siblings('.tab-content[data-tab="' + key + '"]').addClass('active');
                                }).html(key.replace(/-/g, ' ')).appendTo($fnTab)
                                if (mcategory.length > 0) {
                                    buildButtons(mcategory, key, $fnCatPanel)
                                }

                            }
                        }
                        $fnTab.find('li:not(.scroller):first').addClass('active')
                        $fnCatPanel.find('.tab-content:first').addClass('active')
                        $fnTab.append($scrollRight)
                    }

                    var PanelModal = function () {
                        var $panel = $('<div class="trumbowyg-math-panel"></div>');
                        var $mathsRenPanel = $('<div class="render-pane"><span id="math-field"></span></div>');
                        var $fnCatPanel = $('<div class="functions-category-pane"></div>');
                        var $fnTab = $('<ul class="functions-tab"></div>');

                        $panel.css({ height: '303px' });
                        $mathsRenPanel.appendTo($panel)
                        $panel.append($fnCatPanel);
                        $this.elements.MQMathField = MQ.MathField($mathsRenPanel.find('span#math-field')[0], {
                            spaceBehavesLikeTab: true, // configurable
                            handlers: {
                                edit: function () {
                                    $mathsRenPanel.find('span#math-field').attr('data-latex', $this.elements.MQMathField.latex())
                                }
                            }
                        });
                        buildMathFunctions($fnCatPanel, $fnTab);
                        return $panel;
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

                    var triggerEquationInsert = function () {
                        var selectedText = getSelectionText();
                        var $modalContent = PanelModal();
                        $this.elements.MQMathField.latex(selectedText)
                        var $modal = trumbowyg.openModal('Insert Equation', $modalContent);

                        $modal.on('tbwconfirm', function (e, b) {
                            var $rendered = '<span class=\'mq-math-mode\' style="font-family: Symbola, \'Times New Roman\', serif;">' + $this.elements.MQMathField.html() + '</span>'
                            trumbowyg.range.deleteContents();
                            trumbowyg.range.insertNode($($rendered)[0]);
                            trumbowyg.execCmd('insertHTML', '')
                            trumbowyg.closeModal();

                        });
                        $modal.on('tbwcancel', function (e) {
                            trumbowyg.closeModal();
                        });
                        $this.elements.MQMathField.focus()
                    }

                    var ButtonMathsPan = {
                        title: 'Insert Equation',
                        ico: 'mathml',
                        key: 'M',
                        hasIcon: true,
                        fn: triggerEquationInsert
                    }
                    // If my plugin is a paste handler, register it
                    trumbowyg.pasteHandlers.push(function (pasteEvent, g) {
                        // My plugin paste logic

                    });

                    // If plugin is a button
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