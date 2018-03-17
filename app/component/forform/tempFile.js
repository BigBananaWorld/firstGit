const htmlTpl = require("Templates/formTemplate/tempFile.html")

/** 文件上传组件，尽量用原生js编写 */
module.exports = Backbone.View.extend({
    tagName: "div",

    className: "formElement",

    template: _.template(htmlTpl),

    events: {
        // "click #test": "onClickTest",
        "change input[type='file']": "onChangeFile"
    },

    initialize: function(param) {
        this.filesArray = [];

        var param = param || {};
        this.setParam(param);
    },

    render: function() {
        this.$el.append(this.template({
            "title" : this.title,
            "msg" : this.msg
        }));
        return this;
    },
    /**
     * 设置组件参数
     */
    setParam: function(param) {
        this.title = param.title || "title";
        this.msg = param.msg || "";
    },

    /**
     * 获取文件对象
     * @return {[type]} [description]
     */
    getFiles: function() {
        return this.filesArray;
    },
    /**
     * 传入文件对象
     * @param {[type]} fileEl [description]
     */
    setFile: function(fileEl) {

    },

    onClickTest: function(e) {
        // var file = document.getElementById('file');
        // var ee = new FormData();
        // for(var i=0 ; i < file.files.length;i++){
        //     // console.log(file.files[i]);
        //     ee.append('files',file.files[i]);    
        // }
        // ee.append("name","wange");
        // console.log(ee.getAll('name'));
        // console.log(ee.getAll("files_"));
        // // console.log(ee.get("name"));
        // console.log(ee)
        // this.getFiles();
        console.log(this.filesArray)
    },

    onChangeFile: function(e) {
        var files = e.target.files;
        var me = this;

        if(files.length > (5-me.filesArray.length)){
            me.$('#msg').html('文件数量必须不多于5');
            return ;
        }

        for (let i = 0; i < files.length; i++) {
            if (e.target.files.length == 0) {
                return this;
            }
            let file = files[i];
            let reader = new FileReader();
            reader.onload = (function(e) {
                me.filesArray.push(file);
            }());
            reader.error = function(e) {
                console.log("读取异常");
            };
            reader.onloadstart = function() {
                console.log("开始读取...");
            };
            me.addImg(me.$el.find('.multFileMsg'), window.URL.createObjectURL(file));
        }

    },

    addImg: function(ele, src) {
        var img = '<div class="multFileView"><div><a name="del">删除</a></div><div><img style="max-width:150px;height:120px;" src="' + src + '" alt="图片" class="img-rounded"></div></div>';
        ele.append(img);
    }

});