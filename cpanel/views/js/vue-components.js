Vue.component('nav-item', {
    props: ["nav"],
    template: `<li v-bind:data-content="nav.title" data-variation="mini inverted" data-position="right center">
    <a v-bind:href="\'./cpanel/#\'+ nav.link" v-bind:title="nav.title" v-bind:class="nav.class"></a>
    </li>`
});

Vue.component('v-bubble-loader', {
    props: ["classes"],
    template: `<div v-bind:class="'bubblingG ' + classes">
                    <span id="bubblingG_1">
                    </span>
                    <span id="bubblingG_2">
                    </span>
                    <span id="bubblingG_3">
                    </span>
                </div>`
});


Vue.component('v-uploader', {
    props: ["classes", 'allowed', "name"],
    methods: {
        triggerUpload: function () {
            var $btn = $(this.$el);
            $btn.find('input[type=file]').click();
        },
        startUpload: function (e) {
            var dom = $(this.$el);
            var $input = $(e.target);
            var $allowed = $input.data('allowed');
            $allowed = $allowed.split(',')
            var $url = $input.data('url');
            var $this = this;
            var Upload = this.Upload($input[0].files[0]);
            Upload.setUrl(AJAX_URL + $url);
            Upload.setOptions({
                start: function (file) {
                    //upload started
                    $this.$emit('uploading','start',[$input, file])
                    dom.find('.progress-bars .ui.progress').show().progress({
                        percent: 0
                    });
                },
                progress: function (progress) {
                    dom.find('.progress-bars .ui.progress').progress({
                        percent: Math.round(progress)
                    });
                    $this.$emit('uploading','progress',[$input, progress])
                },
                success: function (data) {
                    //upload successful
                    dom.find('.progress-bars .ui.progress').hide();
                    app.message.toast("success", "Upload Alert", "File uploaded successfully")
                    $this.$emit('uploading','success',[$input, data])
                },
                error: function (error) {
                    //upload failed
                    $this.$emit('uploading','error',[$input, error])
                    dom.find('.progress-bars .ui.progress').hide()
                    app.message.toast("error", "Upload Alert", "Failed uploading file. Reason: " + error.message)
                }
            });
            Upload.execute();
            /* try {
                 $input.simpleUpload(AJAX_URL + $url, {
                allowedExts: $allowd,
                

            }); 
            } catch (error) {
                console.log(error)
            } */

        },
        Upload: function (file) {
            var $this = this;
            this.options = {
                start: function () { },
                progress: function () { },
                success: function () { },
                error: function () { },
            };
            var Upload = function (file) {
                this.file = file;
            };

            Upload.prototype.getType = function () {
                return this.file.type;
            };
            Upload.prototype.setUrl = function ($url) {
                this.url = $url;
            };

            Upload.prototype.setOptions = function ($options) {
                this.options = $.extend($options, this.options);
            };

            Upload.prototype.getSize = function () {
                return this.file.size;
            };
            Upload.prototype.getName = function () {
                return this.file.name;
            };
            Upload.prototype.execute = function () {
                var that = this;
                var formData = new FormData();
                // add assoc key values, this will be posts values
                formData.append("file", this.file, this.getName());
                formData.append("upload_file", true);
                this.options.start(this)

                $.ajax({
                    type: "POST",
                    url: that.url,
                    xhr: function () {
                        var myXhr = $.ajaxSettings.xhr();
                        if (myXhr.upload) {
                            myXhr.upload.addEventListener('progress', function (event) {
                                var percent = 0;
                                var position = event.loaded || event.position;
                                var total = event.total;
                                if (event.lengthComputable) {
                                    percent = Math.ceil(position / total * 100);
                                }
                                that.options.progress(percent)
                            }, false);
                        }
                        return myXhr;
                    },
                    success: function (data) {
                        that.options.success(data)
                    },
                    error: function (error) {
                        that.options.error(data)
                    },
                    async: true,
                    data: formData,
                    cache: false,
                    contentType: false,
                    processData: false,
                    dataType:'json',
                    timeout: 60000
                });
            };
            return new Upload(file);
        }
    },
    template: `<div class="v-uploader">
                    <button @click="triggerUpload" style="margin-bottom:12px;" v-bind:class="'ui button icon '+ classes">
                        <i class="icon upload"></i> Upload Video
                        <input @change="startUpload" v-bind:data-allowed="allowed" v-bind:name="name" style="display:none;" type="file" />
                    </button>
                    <div class="progress-bars">
                        <div class="ui progress" data-percent="0" style="display:none">
                            <div class="bar">
                                <div class="progress" style="background-color: transparent;left: 50%;margin-top: -12px;font-size: 11px;"></div>
                            </div>
                            <div class="label">Uploading File</div>
                        </div>
                    </div>
                    
                </div>`
});

Vue.component('v-summernote', {
    props: ["name"],
    template: '<textarea id="summernote" v-on:SNChange="onSNChange" v-bind:name="name"></textarea>',
    created: function (e) {
        var $this = this;
        setTimeout(function () {
            $($this.$el).summernote({
                minHeight: 100,
                callbacks: {
                    onChange: function (val) {
                        $this.$emit('SNChange', val)
                    }
                }
            });
        }, 100);
    },
    methods: {
        onSNChange: function () { }
    }
});