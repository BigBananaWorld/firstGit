const htmlTpl = require("Templates/viewsTemplate/projectNormalEdit.html");
const compSelect = require("Component/forform/tempSelect.js");
const compText = require("Component/forform/tempText.js");
const compFile = require("Component/forform/tempFile.js");
const compSingleFile = require("Component/forform/tempSingleFile.js");
const compColor = require("Component/forform/tempColor.js");

module.exports = Backbone.View.extend({
    tagName: "div",

    className: "panel panel-default",

    template: _.template(htmlTpl),

    events: {
      
    },

    initialize: function(code, upUrl,loginKey) {
        this.code = code || 0;
        this.key = loginKey;
        this.$el.html(this.template({
            back: upUrl
        }));

        this.textName = new compText();
        this.textKzPrice = new compText();
        this.textAppPrice = new compText();
        this.textMarketPrice = new compText();
        this.textScore = new compText();
        this.textFcPrice = new compText();
        this.textKeyword = new compText();
        this.color = new compColor();

        this.fileMin = new compSingleFile();
        this.fileMain = new compFile();

        this.selectType = new compSelect();

        this.initParamOfPage();

        this.listenTo(this, 'dataReady', this.fillPage);
        // this.listenTo(this, 'confirmSuccess',this.confirmFinish);//表单提交成功后的回调函数

    },

    render: function() {
        this.$('#main').append(this.textName.render().el);
        this.$('#main').append(this.textKzPrice.render().el);
        this.$('#main').append(this.textAppPrice.render().el);
        this.$('#main').append(this.textMarketPrice.render().el);
        this.$('#main').append(this.textScore.render().el);
        this.$('#main').append(this.textFcPrice.render().el);
        this.$('#main').append(this.textKeyword.render().el);
        this.$('#main').append(this.color.render().el);
        this.$('#main').append(this.selectType.render().el);
        this.$('#main').append(this.fileMin.render().el);
        this.$('#main').append(this.fileMain.render().el);
        return this;
    },

    /**
     * 主要用于配置页面各个组件的配置
     */
    initParamOfPage: function() {
        this.textName.setParam({
            title: "服务项目名称"
        });
        this.textKzPrice.setParam({
            title: "康展价",
            msg: "康展专属价格"
        });
        this.textAppPrice.setParam({
            title: "APP专享价"
        });
        this.textMarketPrice.setParam({
            title: "市场价"
        });
        this.textScore.setParam({
            title: "赠送消费积分",
            msg: "积分为整数"
        });
        this.textFcPrice.setParam({
            title: "分成金额",
            msg: ""
        });
        this.textKeyword.setParam({
            title: "关键字",
            msg: "尽量短写"
        });
        this.color.setParam({
            title: "图表颜色",
            msg : "选择在图表中显示的颜色(rgb格式)"
        });


        this.selectType.setParam({
            title: '项目分类',
            options: [{
                    value: 1,
                    content: "分类1"
                },
                {
                    value: 2,
                    content: "分类2"
                }
            ]
        });
        this.fileMin.setParam({
            title: "略缩图",
            msg : "只上传1个文件"
        });
        this.fileMain.setParam({
            title: "主图",
            msg : "上传文件数量小于5"
        });
        this.fillSelectOption();

    },

    fillPage: function(data) { //这里再进行数据的装配
        this.textName.setValue(data.items_name);
        this.textKzPrice.setValue(data.actual_price);
        this.textAppPrice.setValue(data.app_price);
        this.textMarketPrice.setValue(data.market_price);
        this.textScore.setValue(data.consumer_point);
        this.textFcPrice.setValue(data.divide);
        this.textKeyword.setValue(data.keyword);
        this.fileMin.setFile(data.thumbnail);
        // this.fileMain.getFiles();
        this.color.setValue(data.colour);
        this.selectType.setValue(data.category_id);
    },

    getFormData: function() {
        var name = this.textName.getValue();
        var kzPrice = this.textKzPrice.getValue();
        var appPrice = this.textAppPrice.getValue();
        var marketPrice = this.textMarketPrice.getValue();
        var score = this.textScore.getValue();
        var fcPrice = this.textFcPrice.getValue();
        var keyword = this.textKeyword.getValue();
        var colorValue = this.color.getValue();

        var min = this.fileMin.getFiles();
        var ossMin = this.fileMin.isChange();
        var main = this.fileMain.getFiles();
        var type = this.selectType.getValue();
        return {
            name:name,
            category_id: type,
            actual_price: kzPrice,
            market_price: marketPrice,
            keyword: keyword,
            thumbnail: min[0],
            main : main,
            oss_photo_notnull : ossMin,
            colour : colorValue
        }

    },

    fillSelectOption : function(){
        var me = this;
        $.ajax({
            url: "https://www.kziche.com/admin/Member/showServiceCate",
            type: 'get',
            dataType: 'json',
            data: {
                 key : me.key
            },
            success: function(res) {
                if (res.code == 200) {
                    me.selectType.setOptions(res.data);
                } else {
                    var temp = [];
                }
            }.bind(this),
            error: function() {
                console.log('页面出错');
            }.bind(this)
        });
    },

    onClickBack: function(e) {
        
    },

    onClickClear: function(e) {
        
    },

    removeEl: function() {
        this.remove();
    }

});