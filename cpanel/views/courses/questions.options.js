export default {
    created: function () {
        setTimeout(() => {
            var dom = $(this.$el);
            var $this = this;
            dom.find('.stage-content table.paginated').paginator('repaginate');
            $this.setAnserStyle('text-list')
            dom.find('[data-content]').popup();
            dom.find('.ui.checkbox').checkbox();
            dom.find('.ui.dropdown').dropdown({
                onChange: function(val){
                    $this.setAnserStyle(val, {})
                }
            });
        }, 100);
    },
    methods: {
        setAnserStyle: function($style, $data){
            var dom = $(this.$el);
            if(!$data) $data = {};
            var $container = dom.find('.stage-content .answers-container');
            $container.html('');
            switch ($style) {
                case 'text-list':
                    var $master = $(`<div class="master">
                                        <label class="d-inline">Answer #<span class="num">1</span></label>
                                        <div class="ml-3 ui checkbox ">
                                            <input class="correct" name="options[answer]" value="0" type="checkbox"/>
                                            <label>Is answer</label>
                                        </div>
                                        <a href="javascript:;" class="red delete">Delete</a>
                                        <div class="ui input mb-2">
                                            <input class="answer" type="text" placeholder="Enter Answer" name="options[answers][]" />
                                        </div>
                                    </div>`);
                    $master.find('a.delete').click(function(){
                        $(this).parent().remove();
                    });
                    if($data.hasOwnProperty('answers')){
                        $data.answers.forEach(function(val, i){
                            var $clone = $master.clone();
                            $clone.find('a.delete').click(function () {
                                $(this).parent().remove();
                            });
                            if(i==0){
                                $clone.find('a.delete').hide();
                            }else{
                                $clone.toggleClass('master slave');
                            }
                            $clone.find('.answer').val(val)
                            $clone.find('.num').html(i+1)
                            $container.append($clone)
                            $clone.find('.correct').val(i)    
                            if(i==$data.answer){
                                $clone.find('.correct').prop('checked', true);
                            }
                        });
                    }else{
                        $master.find('a.delete').hide();
                        $container.html($master)
                    }
                    
                    break;
            
                default:
                    break;
            }
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
                editQuestion: function(el){
                    var dom = $(this.$parent.$el);
                    var $link = $(el.target);
                    var $key = $link.data('key');
                    var $id = this.$parent.data.questions[$key].id;
                    var $question = this.$parent.data.questions[$key].question;
                    dom.find('.ui.form.question #summernote').summernote('code', $question);
                    dom.find('.ui.form.question input[name=id]').val($id);
                    var $options = JSON.parse(this.$parent.data.questions[$key].options);
                    this.$parent.setAnserStyle($options.type, $options);                   
                    
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
                                    <td><a @click="editQuestion" :data-key="key" href="javascript:;">{{item.question}}</a></td>
                                    <td>
                                    <button :data-key="key" class="ui button icon circular mini"><i class="icon trash"></i></button>
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