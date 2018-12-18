<?php

class View{
    var $template = array();
    var $developerMode = false;
    var $array = array();
    var $raw_str = '';

    public function __construct($file='')
    {
        
        \config::set('templateFile', 'blank');
        $debug = debug_backtrace();
        $called_file = @$debug[0]["file"];
        
        $replacement = array(
            '\\'=> '/',
        );
        $called_file = strtr($called_file, $replacement);
        $checkType = explode("/",$called_file);
        $template_folder = dirname($called_file);
        if(in_array("pages",$checkType)){ 
            $this->template["folder"] = "pages/";
            $this->template["type"] = "module";
        }elseif(in_array("plugins",$checkType)){ 
            $this->template["folder"] ="plugins/";
            $this->template["type"] = "plugin";
        }else{
            $this->template["folder"] = $template_folder;
            $this->template["type"] = "non-component";
        } 
        $template_file = $this->template["folder"].'/views/'.$file.".html";
        if(file_exists($template_file)){           
            $this->template["content"] = file_get_contents($template_file);
        }else{
            $this->template["content"] = $file;
        }
        
    }

    
    function registerAsset($assetArray = array()){
        $this->AssetRegister($assetArray,($this->template["type"] == "plugin"?true:false));
    }
    
    private function AssetRegister($assetArray = array(), $is_plugin = false){
        foreach($assetArray as $asset){
            $replacement = array(
                "ModulePath://" =>$this->template["folder"]."/",
                "modulepath://" =>$this->template["folder"]."/",
                "MP://" =>$this->template["folder"]."/",
                "mp://" =>$this->template["folder"]."/",
                "ViewPath://" =>$this->template["folder"]."/views/",
                "viewpath://" =>$this->template["folder"]."/views/",
                "VP://" =>$this->template["folder"]."/views/",
                "vp://" =>$this->template["folder"]."/views/"
            );
            $assetPath = strtr($asset,$replacement);
            if($is_plugin){
                Controller::register_script($assetPath,true);
            }else{
                Controller::register_script($assetPath);
            }            
        }
    }
    
    function registerAssetAsPlugin($assetArray = array()){
        $this->AssetRegister($assetArray,true);
    }  

    public function Render($data = array()){
        //var_dump($this->template);
        $data["ViewPath"] = $this->template["folder"].'/views';
        $data["ViewPath"] = str_replace(@$_SERVER["DOCUMENT_ROOT"],"..",$data["ViewPath"]);
        $data["MVPath"] = $data["ViewPath"];
        $data["TemplatePath"] = "templates/".\config::get('defaultTemplate');
        $activeView = $this->renderViewData($data,$this->template["content"]);
        config::set('activeView', $activeView);
        return $activeView;
    }

    private function renderViewData(array $data, $content){
        $this->array = $data;
        $regex = '/<%(.*?)\%>/s';
        $replace = function( $matches ) {
            $this->raw_str = $matches[1];
            return self::String2Array();
        };
        $data_content = preg_replace_callback( $regex, $replace, $content);
        return $data_content;
    }
    
    private function String2Array(){
        $str = $this->raw_str;
        $array = $this->array;
        $return_arr = false;
        $return_base64 = false;
        if(substr($str,0,1) == "["&& substr($str,strlen($str)-1) =="]"){
            $str = str_replace("[","",$str);
            $str = str_replace("]","",$str);
            $str = trim($str);
            $return_arr = true;
        };
        if(substr($str,0,4) == "b64."){
            $str = str_replace("b64.","",$str);
            $return_base64 = true;
        };
        
        $arr = explode(".",$str);
        if(count($arr) >=1){
            if(!empty($array)){
                if(is_array($array)){
                    if(array_key_exists($arr[0], $array)){
                        $fkey = $arr[0];
                        unset($arr[0]);
                        if(is_array($array[$fkey])){
                            if($return_arr && count($arr) == 1){
                                $val = json_encode($array[$fkey]);
                                return ($return_base64?base64_encode($val):$val);
                            }
                            $primary = $array[$fkey];
                            foreach ($arr as $key){
                                if(isset($primary[$key])){
                                    if(is_array($primary[$key])){
                                        if($return_arr){
                                            if(isset($primary[$key])){
                                                $val = json_encode($primary[$key]);
                                                return ($return_base64?base64_encode($val):$val);
                                            }else{
                                                return false;
                                            }
                                        }
                                        $primary = $primary[$key];
                                    }else{
                                        $val = $primary[$key];
                                        return ($return_base64?base64_encode($val):$val);
                                    }
                                }else{
                                    return false;
                                }
                            }
                        }else{
                            $val = ($array[$fkey]);
                            return ($return_base64?base64_encode($val):$val);
                        }
                        
                    }
                }else{
                    return false;
                }
            }else{
                return false;
            }
            
        }
        if(isset($array[$str])){
            $val = json_encode($array[$str]);
            return ($return_base64?base64_encode($val):$val);
        }
        return false;
    }
}