const htmlTpl = require("Templates/viewsTemplate/formExample.html");
const compCheckbox = require("Component/forform/tempCheckbox.js");
const compDate = require("Component/forform/tempDate.js");
const compFile = require("Component/forform/tempFile.js");
const compSelect = require("Component/forform/tempSelect.js");
const compText = require("Component/forform/tempText.js");

// require("/ueditor/ueditor.config.js");
// require("/ueditor/ueditor.all.js");
// require("/ueditor/lang/zh-cn/zh-cn.js");

module.exports = Backbone.View.extend({
    tagName: "div",

    className: "panel panel-default",

    template: _.template(htmlTpl),


    initialize: function(code) {  
        this.$el.html(this.template({
            title : "表单页面",
            sub : "这个页面用于生成表单"
        }));

        this.checkbox = new compCheckbox();
        this.text = new compText();
        this.select = new compSelect();
        this.fileEl = new compFile();
        this.dateEl = new compDate({
            date : '2017-10-10'
        });

        this.listenTo(this,'dataReady',this.fillPage);

        this.initParamOfPage();

        this.url = 'http://www.kzxueche.com/institutionapi/Baseinsti/security_guardList';
        this.param = {
            isexport: 1,
            searchCriteria: '',
            page: 1,
            pagesize: 15,
            key: '40kzm151243778659066910'
        }

        if((typeof code) !== "undefined"){
            this.queryData(this.url,this.param)

        }

    },

    render: function() {
        this.$('#main').append(this.checkbox.render().el);
        this.$('#main').append(this.text.render().el);
        this.$('#main').append(this.dateEl.render().el);

        this.$('#main').append(this.select.render().el);
        this.$('#main').append(this.fileEl.render().el);
        return this;
    },

    /**
     * 主要用于配置页面各个组件的配置
     */
    initParamOfPage: function() {
       
    },

    /**
     * 根据条件过去数据
     * @param  {object} param [条件]
     * @return {[type]}       [description]
     */
    queryData: function(url,param,type) {
        $.ajax({
            url: url,
            type: type || 'get',
            dataType: 'json',
            data: param,
            success: function(res) {
                console.log(res);
                if (res.code == 200) {
                    this.trigger('dataReady', res.data);
                } else {
                    var temp = {};
                    this.trigger('dataReady', temp);
                }
            }.bind(this),
            error: function() {
                console.log('页面出错');
            }.bind(this)
        })
    },

    fillPage : function(data){
       console.log(data);
    },

    removeEl: function() {
        this.remove();
    }

});