export default {
    // This function is called when courses page is created
    created: function () {
        setTimeout(() => {
            $('.menu .item').tab();
        }, 100);
    },
    methods: {
        // Make the course editor visible for edit/add
        openCourseEditor: function () {
            var dom = $(this.$el);
            var $id = this.data.courses.length;
            dom.find('.ui.placeholder.segment').hide();
            dom.find('.ui.form.course input[name=course]').val('').focus();
            dom.find('.ui.form.course').data("id", $id);
            dom.find('.ui.form.course .note-editable').html('<p></p>');
            dom.find('.ui.form.course input[name=alias]').val('');
            dom.find('.ui.form.course input[name=id]').val('');
            dom.find('.ui.form.course');
            var tpl = {
                id: "",
                flag: "",
                course: 'Untitled',
                overview: ''
            }
            Vue.set(this.data.courses, $id, tpl);
            this.$nextTick(function () {
                dom.find('.stage-sidebar .list li').removeClass('active')
                dom.find('.stage-sidebar .list li:last-child').addClass('active')
            });
            dom.find('.stage-content .ui.menu a[data-tab=edit]').click();
        },
        // This function deletes course from server and vue data
        deleteCourse: function (e) {
            var $el = $(e.target);
            var dom = $(this.$el);
            var $id = $el.data('id');
            var _id = this.data.courses[$id].id;
            var _title = this.data.courses[$id].course;
            var $this = this;
            var dialog = app.dialog({
                size: "small",
                approveText: "Delete",
                content: "<div class='col-lg-12 m-6' style='text-align:center;'><h3><i class='icon info circle big'></i><br/><br/>Are you sure you want to delete this course?</h3><p class='red mt-4'>Note: All data related to this course will also be delete.</p></div>",
            });
            // create a modal with semantic-ui
            dialog.modal({
                blurring: true,
                onApprove: function () {
                    $el.hide();
                    dom.find('.ui.placeholder.segment').show();
                    if (_id) {
                        $.ajax({
                            method: "POST",
                            url: AJAX_URL + 'course/delete/' + _id + '/',
                            dataType: 'json',
                            success: function (res) {
                                if (!res.error) {
                                    $this.data.courses = $this.data.courses.filter(function (el, i) { return i != $id });
                                    app.message.toast("success", "Course Processing", _title + " deleted successfully.");
                                } else {
                                    app.message.toast("error", "Course Processing", res.error);
                                    $el.show();
                                }
                            },
                            error: function () {
                                $el.show();
                            }
                        });
                    } else {
                        $this.data.courses = $this.data.courses.filter(function (el, i) { return i != $id });
                    }
                }
            }).modal('show');
            dialog.find('.ui.approve').toggleClass('primary red')
            dialog.find('.ui.cancel').toggleClass('red')
        },
        // Make course editor visible to display details of selected course
        viewCourse: function (e) {
            var dom = $(this.$el);
            var $el = $(e.target);
            if (!$el.hasClass('cmd')) {
                var $id = $el.data('id');
                var $course = this.data.courses[$id];
                dom.find('.ui.placeholder.segment').hide();
                dom.find('.ui.form.course').data("id", $id);
                dom.find('.ui.form.course input[name=course]').val($course.course);
                dom.find('.ui.form.course input[name=id]').val($course.id);
                dom.find('.ui.form.course input[name=alias]').val($course.flag);
                dom.find('.ui.form.course .trumbowyg-textarea').trumbowyg('html', $course.overview);
                if ($this.data.lessons[$id]) {
                    $this.data.lessons.selected = $this.data.lessons[$id];
                } else {
                    $this.data.lessons.selected = [];
                    if ($this.data.lessons.selected.length == 0) {
                        dom.find('.stage-content .ui.menu a[data-tab=edit]').click();
                    }
                }

            }

        },
        // This is an event handler which is triggered on inputs in the course editor.
        // It is triggered on keyup or value change
        textChange: function (stage, val, field) {
            var dom = $(stage);
            var $id = dom.find('.ui.form.course').data('id');
            this.data.courses[$id][field] = val;
        },
        // This is an event handler which is triggered on sumer note editor in the course editor.
        // It is triggered on keyup or value change
        onWYSIWYGChange: function (val) {
            var dom = $(this.$el);
            var $id = dom.find('.ui.form.course').data('id');
            this.data.courses[$id].overview = val;
        },
        // This function saves course either on edit or new entry
        saveCourse: function (form) {
            var $form = $(form.target);
            var $id = $form.data('id');
            $form.addClass('loading');
            var $this = this;
            var $formData = $form.serializeJSON();
            if (!$formData.id) $formData.id = 0;
            $.ajax({
                method: "POST",
                url: AJAX_URL + 'course/save/' + $formData.id + '/',
                dataType: 'json',
                data: $formData,
                success: function (res) {
                    $form.removeClass('loading')
                    if (!res.error) {
                        app.message.toast("success", "Course Processing", "Detailed saved successfully.");
                        if (res.id) {
                            $this.data.courses[$id].id = res.id;
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
        // This function loads lesson and renders when switched to the lesson tab
        loadLessons() {
            var dom = $(this.$el);
            var $id = dom.find('.stage-sidebar .list li.active a').data('id');
            var $course = this.data.courses[$id];
            var $this = this;
            if (this.data.lessons[$id]) {
                this.data.lessons.selected = this.data.lessons[$id];
            } else {
                if (!$course.id) {
                    app.message.toast("info", "Lessons", "Could not load lessons. Make sure the selected course details is saved.")
                    dom.find('.lesson-loader').hide();
                    return false;
                }
                $.ajax({
                    url: AJAX_URL + 'course/lessons/' + $course.id + '/',
                    dataType: 'json',
                    success: function (res) {
                        $this.data.lessons.selected = res;
                        $this.data.lessons[$id] = res
                        dom.find('.lesson-loader').hide();
                    },
                    error: function (res) {
                        dom.find('.lesson-loader').hide()
                        app.message.toast("error", "Lessons", "Could not load lessons. Please try again later")
                    }
                });
            }
            // Vue.set(this.data.lessons,$id,{tr:9,ffg:889})
        },
        // This function switches to the Lesson tab
        switchToLessons: function (e) {
            var dom = $(this.$el);
            dom.find('.stage-content .ui.menu a[data-tab=lessons]').click();
        },
        /** This function handles events on video upload with returning values (action, data)
        * @param action - Refers to the action of the event e.g. start, progress, success, error
        * @param data - This includes the element used for the upload, and data related to the action thrown
        */
        uploading: function (action, data) {
            var dom = $(this.$el)
            switch (action) {
                case 'success':
                    var $data = data[1];
                    var $input = data[0];
                    var config = this.$root.$data.config;
                    var source = document.createElement('source');
                    if (!$data.error) {
                        source.setAttribute('src', config.url + $data.file.substring(2))
                        if ($input.parent().hasClass("uploader720p")) {
                            dom.find('.error-720').hide();
                            dom.find('#videoPlayer720').show().find('source').remove();
                            dom.find('#videoPlayer720').append(source);
                        }
                        if ($input.parent().hasClass("uploader360p")) {
                            dom.find('.error-360').hide()
                            dom.find('#videoPlayer360').show().find('source').remove();
                            dom.find('#videoPlayer360').append(source);

                        }
                    }
                    break;
            }
        }
    },
    watch: {
        // Watch changes in the data.lesson object and trigger handler
        'data.lessons': {
            handler: function (newValue, oldValue) {
                var dom = $(this.$el);
                setTimeout(() => {
                    dom.find('.stage-content table.paginated').paginator('repaginate');
                    dom.find('[data-content]').popup();
                    dom.find('.ui.checkbox').checkbox();
                }, 100);
            },
            deep: true
        }
    },
    // Components for Courses Page
    components: {
        // The v-leeson component which list lessons for selected course
        'v-lessons': {
            // Methods for the v-lesson component
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
                // This function opens up a modal for edit/add lesson.
                openLessonEditor: function ($data) {
                    var dom = $(this.$parent.$el);
                    var $this = this;
                    var $courseKey = dom.find('.stage-sidebar .list li.active a').data('id');
                    var $cid = $this.$parent.data.courses[$courseKey].id;
                    if (!$cid) {
                        app.message.toast("info", "Lesson Alert", 'Can not add or edit lesson. Make sure the selected course detais is saved.')
                        return false;
                    }
                    var template = (`<div class="container">
                                        <div class="row">
                                            <div class="col-lg-12">
                                                <form class="ui form">
                                                    <input type="hidden" name="id"/>
                                                    <input type="hidden" name="course" value="`+ $cid + `"/>
                                                    <div class="field">
                                                        <label>Lesson Title</label>
                                                        <input type="text" name="lesson" />
                                                    </div>
                                                    <div class="field mb-0">
                                                        <div class="ui toggle checkbox">
                                                            <input type="hidden" value="0" name="visible">
                                                            <input type="checkbox" value="1" name="visible">
                                                            <label>Publish</label>
                                                        </div>
                                                    </div>
                                                    <small class="gray">Toggle to enable or disable lesson.</small>
                                                </form>
                                            </div>
                                        </div>
                                    </div>`);
                    var dialog = app.dialog({
                        size: "small",
                        approveText: "Save Lesson",
                        content: template,
                        title: "Lesson Editor"
                    });
                    dialog.modal({
                        blurring: true,
                        closable: false,
                        onApprove: function () {
                            var $approveBtn = dialog.find('.actions .ui.approve');
                            var $cancelBtn = dialog.find('.actions .ui.cancel');
                            dialog.find('.content .field').addClass('disabled');
                            $cancelBtn.hide();
                            $approveBtn.addClass('loading disabled');
                            var $formData = dialog.find('.content .ui.form').serializeJSON();
                            if (!$formData.id) $formData.id = 0;
                            $.ajax({
                                method: "POST",
                                url: AJAX_URL + 'course/lesson/save/' + $formData.id + '/',
                                dataType: 'json',
                                data: $formData,
                                success: function (res) {
                                    dialog.modal('hide');
                                    if (!res.error) {
                                        app.message.toast("success", "Lesson Processing", "Lessson saved successfully.");
                                        if (res.id) {
                                            // Update vue records if id is set for new lesson
                                            $this.$parent.data.lessons[$courseKey][$data.key].id = res.id;
                                        }
                                        // Update relevant vue records
                                        $this.$parent.data.lessons[$courseKey][$data.key].lesson = $formData.lesson;
                                        $this.$parent.data.lessons[$courseKey][$data.key].visible = $formData.visible;
                                    } else {
                                        app.message.toast("error", "Lesson Processing", res.error)
                                    }
                                },
                                error: function (res) {
                                    dialog.modal('hide');
                                    app.message.toast("error", "Lesson Processing", "Please check your internet connection and try again later")
                                }
                            });
                            return false;
                        }
                    }).modal('show');

                    // Set passed data to modal
                    if ($data.id) {
                        // Set lesson ID value if set
                        dialog.find('.content input[name=id]').val($data.id);
                    }
                    if ($data.lesson) {
                        // Set lesson value if set
                        dialog.find('.content input[name=lesson]').val($data.lesson);
                    }
                    if ($data.visible && $data.visible == 1) {
                        // Set lesson value if set
                        dialog.find('.content input[name=visible]').prop("checked", true);
                    }
                },
                // This function populates the required data for adding a lesson and pops up the lesson editor modal
                addLesson: function (el) {
                    var dom = $(this.$parent.$el);
                    var $this = this;
                    var $courseKey = dom.find('.stage-sidebar .list li.active a').data('id');
                    var $cid = $this.$parent.data.courses[$courseKey].id;

                    var $id = this.$parent.data.lessons.selected.length;
                    var tpl = {
                        id: "",
                        lesson: "Untitled Lesson",
                        course: $cid,
                        questions: 0,
                        visible: 0,
                    }
                    Vue.set($this.$parent.data.lessons[$courseKey], $id, tpl);
                    this.openLessonEditor({
                        lesson: tpl.lesson,
                        visible: tpl.visible,
                        id: tpl.id,
                        key: $id,
                    })
                },
                // This function populates the data from the selected lesson and pops up the lesson editor modal for editing
                editLesson: function (e) {
                    var $btn = $(e.target);
                    var $data = {
                        lesson: $btn.attr('data-lesson'),
                        visible: $btn.attr('data-visible'),
                        id: $btn.attr('data-id'),
                        key: $btn.data('key'),
                    }
                    this.openLessonEditor($data) // Open Lesson editor for selected lesson to be edited.
                },
                // This function deletes a lesson from server and vue data object
                deleteLesson: function (e) {
                    var $el = $(e.target);
                    var dom = $(this.$parent.$el);
                    var $courseKey = dom.find('.stage-sidebar .list li.active a').data('id');
                    var $id = $el.data('key');
                    var _id = this.$parent.data.lessons.selected[$id].id;
                    var _title = this.$parent.data.lessons.selected[$id].lesson;
                    var $this = this;
                    var dialog = app.dialog({
                        size: "small",
                        approveText: "Delete",
                        content: "<div class='col-lg-12 m-6' style='text-align:center;'><h3><i class='icon info circle big orange'></i><br/><br/>Are you sure you want to delete this lesson?</h3><p class='red mt-4'>Note: All data related to this lesson will also be delete.</p></div>",
                    });
                    dialog.modal({
                        blurring: true,
                        onApprove: function () {
                            $el.hide();
                            if (_id) {
                                $.ajax({
                                    method: "POST",
                                    url: AJAX_URL + 'course/lesson/delete/' + _id + '/',
                                    dataType: 'json',
                                    success: function (res) {
                                        if (!res.error) {                                          

                                            $this.$parent.data.lessons[$courseKey] = $this.$parent.data.lessons[$courseKey].filter(function (el, i) { return i != $id });
                                            $this.$parent.data.lessons.selected = $this.$parent.data.lessons[$courseKey];
                                            app.message.toast("success", "Lesson Alert", _title + " deleted successfully.");
                                        } else {
                                            app.message.toast("error", "Lesson Alert", res.error);
                                            $el.show();
                                        }
                                    },
                                    error: function () {
                                        $el.hide();
                                    }
                                });
                            } else {
                                $this.$parent.data.lessons[$courseKey] = $this.$parent.data.lessons[$courseKey].filter(function (el, i) { return i != $id });
                            }
                        }
                    }).modal('show');
                    dialog.find('.ui.approve').toggleClass('primary red')
                    dialog.find('.ui.cancel').toggleClass('red')
                },
                // This function switches from lesson to the video tab for checking and uploading videos to lesson
                switchToVideoPane: function (e) {
                    var config = this.$root.$data.config;
                    var dom = $(this.$parent.$el);
                    var $btn = $(e.target);
                    var $id = $btn.data('id');
                    $btn.addClass('loading disabled')
                    $.ajax({
                        url: AJAX_URL + 'course/lessons/' + $id + '/check-videos/',
                        dataType: 'json',
                        success: function (res) {
                            if (!res.error) {
                                dom.find('.uploader360p input[type=file]').attr('data-url', 'course/lessons/' + $id + '/upload-video/360p/')
                                dom.find('.uploader720p input[type=file]').attr('data-url', 'course/lessons/' + $id + '/upload-video/720p/')
                                var source360 = document.createElement('source');
                                var source = document.createElement('source');
                                dom.find('#videoPlayer360').append(source360);
                                if (res.has720p == true) {
                                    dom.find('.error-720').hide();
                                    source.setAttribute('src', config.url + 'videos/' + res.course + '/' + $id + '/720p.mp4')
                                    dom.find('#videoPlayer720').show().append(source);
                                } else {
                                    source360.setAttribute('src', 'nomedia.mp4')
                                    dom.find('#videoPlayer720').hide().append(source);
                                    dom.find('.error-720').show();
                                }
                                if (res.has360p == true) {
                                    dom.find('.error-360').hide();
                                    source360.setAttribute('src', config.url + 'videos/' + res.course + '/' + $id + '/360p.mp4')
                                    dom.find('#videoPlayer360').show().append(source360);
                                } else {
                                    source360.setAttribute('src', 'nomedia.mp4')
                                    dom.find('#videoPlayer360').hide().append(source360);;
                                    dom.find('.error-360').show();
                                }
                                $btn.removeClass('loading disabled');
                                $.tab('change tab', 'lesson-video');
                            } else {
                                $btn.removeClass('loading disabled');
                                app.message.toast("error", "Lesson Videos", res.error)
                            }
                        },
                        error: function (res) {
                            $btn.removeClass('loading disabled')
                            app.message.toast("error", "Lesson Videos", "Could not check lesson videos. Please try again later")
                        }
                    });

                }
            },
            /**
             * The v-lessons component template structure.
             * @object v-bubble-loader is a general component responsible of showing a loading state of the lesson table
              */
            template: (`<div clas="lessons-table">
                            <table class="table responsive lessons-list paginated">
                                <thead>
                                    <tr>
                                        <th colspan="6">
                                            <span class="d-none bulk-actions">
                                                Bulk Actions: <button class="ui mini button red">Delete</button>
                                            </span>
                                            <button @click="addLesson($event)" class="ui mini button icon" style="float:right"><i class="icon plus"></i> Add New Lesson</button>

                                            <div class="ui search mini mr-2" style="float:right">
                                                <div class="ui icon input">
                                                    <input class="prompt" type="text" placeholder="Search...">
                                                    <i class="search icon"></i>
                                                </div>
                                                <div class="results"></div>
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
                                        <th>Lesson</th>
                                        <th>Published</th>
                                        <th>Questions</th>
                                        <th></th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr v-for="(item, key) in $parent.data.lessons.selected">
                                        <td>
                                            <div class="ui checkbox sub">
                                                <input v-on:change="showBulkActions" type="checkbox" />
                                            </div>
                                        </td>
                                        <td>{{item.id}}</td>
                                        <td><a v-bind:href="'./cpanel/#/course/lesson/' + item.id + '/questions/'">{{item.lesson}}</a></td>
                                        <td>
                                            <span v-if="item.visible == '1'">Yes</span>
                                            <span v-else>No</span>
                                        </td>
                                        <td>{{item.questions}} </td>
                                        <td>
                                        <button :data-id="item.id" @click="switchToVideoPane" data-content="Manage Video" data-variation="mini inverted" data-position="left center" class="ui button icon circular mini red"><i class="icon video"></i></button>
                                        <button @click="editLesson" :data-key="key" :data-lesson="item.lesson" :data-id="item.id" :data-visible="item.visible" class="ui button icon circular mini black"><i class="icon pencil"></i></button>
                                        <button @click="deleteLesson" :data-key="key" class="ui button icon circular mini"><i class="icon trash"></i></button>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                            <v-bubble-loader classes="lesson-loader"></v-bubble-loader>
                            <br/>
                            <br/>
                            <br/>
                        </div>`)
        }
    }
}