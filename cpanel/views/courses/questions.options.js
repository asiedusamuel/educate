export default {
    created: function () {
        setTimeout(() => {
            var dom = $(this.$el);
            var $this = this;
            dom.find('.stage-content table.paginated').paginator('repaginate');
            dom.find('[data-content]').popup();
            dom.find('.ui.checkbox').checkbox();
            dom.find('.ui.dropdown').dropdown({
                onChange: function (val) {

                }
            });
        }, 100);
        for (const key in this.data.questions) {
            if (this.data.questions.hasOwnProperty(key)) {
                const element = this.data.questions[key];
                this.data.questions[key].options = JSON.parse(element.options);
            }
        }
    },
    methods: {
        findClickable: function ($element, $findClass) {
            if (!$element.hasClass($findClass)) {
                return this.findClickable($element.parent(), $findClass);
            }
            return $element;
        },
        addOption: function () {
            var $id = this.data.option.answers.length;
            Vue.set(this.data.option.answers, $id, 'Click on <i class="icon pencil"></i> button to edit content.');
        },
        saveQuestion: function (form) {
            var $form = $(form.target);
            var $key = $form.attr('data-key');
            var $formData = $form.serializeJSON();
            if ($formData.question == "") {
                app.message.toast('error', "Question Form Alert", 'Enter a question.')
                return;
            }
            if (!$formData.options.answers) {
                app.message.toast('error', "Question Form Alert", 'No options added to this question.')
                return;
            }
            if (!$formData.options.answer) {
                app.message.toast('error', "Question Form Alert", 'You need to select one or more option as an answer')
                return;
            }
            $form.addClass('loading');
            $formData.cid = this.data.course.cid;
            $formData.lid = this.data.course.lid;
            if (!$formData.id) $formData.id = 0;
            $.ajax({
                method: "POST",
                url: AJAX_URL + 'course/lesson/save-question/' + $formData.id + '/',
                dataType: 'json',
                data: $formData,
                success: function (res) {
                    $form.removeClass('loading')
                    if (!res.error) {
                        app.message.toast("success", "Course Processing", "Detailed saved successfully.");
                        $this.data.questions[$key].question = $formData.question;
                        if (res.id) {
                            $this.data.questions[$key].id = res.id;
                            $form.find('input[name=id]').val(res.id);
                        }
                    } else {
                        app.message.toast("error", "Course Processing", res.error)
                    }
                },
                error: function (res) {
                    $form.removeClass('loading')
                    app.message.toast("error", "Course Processing", "Please check your internet connection and try again later")
                }
            });
        },
        checkIfMultiple: function () {
            var $checkboxes = $(this.$el).find('.small-editor .ui.checkbox input:checked');
            if ($checkboxes.length > 1) {
                $(this.$parent.$el).find('input.multiple').val(1)
            } else {
                $(this.$parent.$el).find('input.multiple').val(0)
            }
        },
        returnToList: function () {
            var dom = $(this.$el);
            this.data.addNew = true;
            dom.find('.question-editor, .questions-list').toggleClass('active');
            this.data.option = Object.assign({}, this.data.option, {});
        },
        editQuestion: function (el) {
            var dom = $(this.$el);
            var $link = this.findClickable($(el.target), 'clickable')
            var $key = $link.attr('data-key');
            var $id = this.data.questions[$key].id;
            var $this = this;
            dom.find('.ui.form.question').attr('data-key', $key);
            this.data.option = Object.assign({}, this.data.option, {
                answer: this.data.questions[$key].options.answer,
                answers: this.data.questions[$key].options.answers,
                question: this.data.questions[$key].question
            });
            dom.find('.ui.form.question input[name=id]').val($id);
            setTimeout(() => { $this.checkIfMultiple(); }, 100);

            dom.find('.question-editor, .questions-list').toggleClass('active');
            this.data.addNew = false;
        },
        addNewQuestion: function () {
            var dom = $(this.$el);
            var $id = this.data.questions.length;
            var $cid = this.data.course.cid;
            var $lid = this.data.course.lid;
            var $this = this;
            Vue.set(this.data.questions, $id, { id: '', courseID: $cid, lessonID: $lid, question: 'New Question (Unsaved)', options: { answers: ['Click on <i class="icon pencil"></i> button to edit content.'], answer: [], type: 'list-style', multiple: 0 } });
            setTimeout(() => { dom.find('.page-number:last').click(); }, 500);
        }
    },
    watch: {
        // Watch changes in the data.lesson object and trigger handler
        'data.questions': {
            handler: function (newValue, oldValue) {
                var dom = $(this.$el);
                setTimeout(() => {
                    dom.find('.stage-content table.paginated').paginator('repaginate');
                    dom.find('[data-content]').popup();
                    dom.find('.ui.checkbox').checkbox();
                    dom.find('.ui.dropdown').dropdown();
                }, 100);
            },
            deep: true
        }
    },
    components: {
        'vSmallEditor': {
            props: ['index', 'type', 'content', 'answer', 'name'],
            methods: {
                editWithWYSIWYG: function ($el) {
                    var dom = $(this.$parent.$el);
                    var $editor = $(this.$el);
                    var $this = this;
                    var $key = dom.find('.ui.form.question').attr('data-key');
                    var $modal = $('.ui.modal').modal({
                        closable: false,
                        onApprove: function (e, a) {
                            var $form = $modal.find('form').serializeJSON();
                            $editor.find('.value').val($form.editor);
                            $editor.find('.editor-field').html($form.editor);
                            $this.$parent.data.questions[$key].question = $form.editor;
                        }
                    }).modal('show')
                    $modal.find('form .trumbowyg-textarea').trumbowyg('html', $editor.find('.editor-field').html());
                    setTimeout(() => {
                        $modal.find('form .trumbowyg-editor').focus();
                    }, 100);

                },
                removeWYSIWYG: function ($el) {
                    $el = $($el.target)
                    if ($el.hasClass('icon')) $el = $el.parent();
                    var $key = $el.attr('data-id');
                    this.$parent.data.option.answers = this.$parent.data.option.answers.filter(function (el, i) { return i != $key; })
                },
                checkIfMultiple: function () {
                    this.$parent.checkIfMultiple();
                },
                checkAnswer: function ($key, $answers) {
                    return ($.inArray($key.toString(), $answers) != -1);
                }
            },
            template: (`<div class="small-editor">
                            <input type="hidden" class="value" :value="content" :name="name" />
                            <div class="editor-toolbar">
                                <a v-if="type=='answers'">Option #{{index+1}}</a>
                                <a @click="editWithWYSIWYG" title="Open in editor"><i class="icon pencil"></i></a>
                                <a v-if="type=='answers'" :data-id="index" @click="removeWYSIWYG" title="Remove Option"><i style="color:#ef6441;" class="icon trash"></i></a>
                                <a v-if="type=='answers'" :data-id="index" title="Only check if this option is an answer">
                                    <div class="ui checkbox">
                                        <input type="checkbox" @change="checkIfMultiple" :checked="checkAnswer(index, answer)" :value="index" name="options[answer][]" />
                                        <label>Is Answer</label>
                                    </div>
                                </a>
                            </div>
                            <div class="editor-field" v-html="content">
                                
                            </div>
                        </div>`)
        },
        'v-questions': {
            methods: {
                // This function make it possible to select all checkbox in the lessons rows when the [select all] checkbox is selected.
                selectSubCheckbox: function () {
                    var $state = $(this.$el).find('#select-all').is(':checked');
                    var $subCheckbox = $(this.$el).find('tbody .ui.checkbox input')
                    $subCheckbox.prop('checked', $state)
                    this.showBulkActions()
                },
                // This function calculates the number of lessons selected and if more than 1 lesson is selected then the bulk actions are enabled.
                showBulkActions: function () {
                    var $checkboxes = $(this.$el).find('tbody .ui.checkbox.sub input:checked');
                    if ($checkboxes.length > 1) {
                        $(this.$el).find('.bulk-actions').removeClass('d-none')
                    } else {
                        $(this.$el).find('.bulk-actions').addClass('d-none')
                    }
                },
                deleteQuestion: function (e) {
                    var $el = this.$parent.findClickable($(e.target), 'clickable');
                    var $key = $el.attr('data-key');
                    var _id = this.$parent.data.questions[$key].id
                    var $question = $el.parent().parent().find('a.question').html();
                    var $this = this;
                    var dialog = app.dialog({
                        size: "small",
                        approveText: "Delete",
                        content: "<div class='col-lg-12 m-6' style='text-align:center;'><h3><i class='icon info circle big'></i><br/><br/>Are you sure you want to delete this question?</h3><p>" + $question + "</p></div>",
                    });
                    // create a modal with semantic-ui
                    dialog.modal({
                        blurring: true,
                        onApprove: function () {
                            $el.hide();
                            if (_id) {
                                $.ajax({
                                    method: "POST",
                                    url: AJAX_URL + 'course/lesson/delete-question/' + _id + '/',
                                    dataType: 'json',
                                    success: function (res) {
                                        if (!res.error) {
                                            $this.$parent.data.questions = $this.$parent.data.questions.filter(function (el, i) { return i != $key });
                                            app.message.toast("success", "Delete Alert", "Question deleted successfully.");
                                        } else {
                                            app.message.toast("error", "Delete Alert", res.error);
                                            $el.show();
                                        }
                                    },
                                    error: function () {
                                        $el.show();
                                    }
                                });
                            } else {
                                $this.$parent.data.questions = $this.$parent.data.questions.filter(function (el, i) { return i != $key });
                            }
                        }
                    }).modal('show');
                    dialog.find('.ui.approve').toggleClass('primary red')
                    dialog.find('.ui.cancel').toggleClass('red')
                }
            },
            template: (`<div clas="lessons-table">
                            <table class="table responsive lessons-list paginated">
                            <thead>
                                <tr>
                                    <th colspan="5">
                                        <span class="d-none bulk-actions">
                                            Bulk Actions: <button class="ui mini button red">Delete</button>
                                        </span>
                                        <div class="ui search mini mr-2" style="float:right">
                                            <div class="ui icon input">
                                                <input class="prompt" type="text" placeholder="Search...">
                                                <i class="search icon"></i>
                                            </div>
                                        </div>
                                    </th>
                                </tr>
                                <tr>
                                    <th style="width:50px;">
                                        <div class="ui checkbox">
                                            <input v-on:change="selectSubCheckbox" type="checkbox" id="select-all" />
                                        </div>
                                    </th>
                                    <th style="width:50px;">ID</th>
                                    <th>Question</th>
                                    <th></th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr v-for="(item, key) in $parent.data.questions">
                                    <td>
                                        <div class="ui checkbox sub">
                                            <input v-on:change="showBulkActions" type="checkbox" />
                                        </div>
                                    </td>
                                    <td>{{item.id}}</td>
                                    <td><a @click="$parent.editQuestion" class="clickable question" :data-key="key" href="javascript:;" v-html="item.question"></a></td>
                                    <td>
                                    <button :data-key="key" @click="deleteQuestion" class="ui clickable button icon circular mini"><i class="icon trash"></i></button>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                        <br/>
                        <br/>
                        <br/>
                        </div>`)
        }
    }
}