const htmlTpl = require("Templates/formTemplate/tempSingleFile.html");

/** 文件上传组件，尽量用原生js编写 */
module.exports = Backbone.View.extend({
    tagName: "div",

    className: "formElement",

    template: _.template(htmlTpl),

    events: {
        "click #test": "onClickTest",
        "change input[type='file']": "onChangeFile",
        "click a[name='del']": "delImg"
    },

    initialize: function(param) {
        this.filesArray = [];
        this.fileChange = 0;
        this.fileLength = 0;//只能这样记录是否已有图片

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
    setFile: function(src) {
        if(src && src !="undefined" && src !="null"){
            var el = this.$el.find('.fileMsg');
            this.addImg(el,src);
            this.fileLength = 1;
        }
    },

    onClickTest: function(e) {
       // this.setFile(img);
       console.log(this.isChange());
    },

    onChangeFile: function(e) {
        var files = e.target.files;
        var me = this;

        if(me.filesArray.length >=1 || this.fileLength == 1){
            me.$('#msg').html('上传文件数不多于1.');
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
            me.addImg(me.$el.find('.fileMsg'), window.URL.createObjectURL(file));
            this.fileChange = 1;
            this.fileLength = 1;
        }

    },

    addImg: function(ele, src) {
        var img = '<div><div><a name="del">删除</a></div><div><img style="max-width:180px;" src="' + src + '" alt="图片" class="img-rounded"></div></div>';
        ele.append(img);
        this.fileChange = 1;
    },

    delImg : function(e){
        this.$("input[type=file]").val("");
        $(e.target).closest("div").parent("div").remove();
        this.filesArray = [];
        this.fileLength = 0;
        this.fileChange = 0;
    },

    isChange : function(){
        return this.fileChange;
    }
});