const htmlTpl = require("Templates/viewsTemplate/formExample.html");
const compFile = require("Component/forform/tempSingleFile.js");
const compSelect = require("Component/forform/tempSelect.js");
const compText = require("Component/forform/tempText.js");
const compUeditor = require("Component/forform/tempUeditor.js");
const compMap = require("Component/forform/tempMap.js");
const compArea = require("Component/forform/tempArea.js");
const compDate = require("Component/forform/tempDate.js");

module.exports = Backbone.View.extend({
    tagName: "div",

    className: "",

    template: _.template(htmlTpl),

    events: {
        "click #confirm": "onClickConfirm",
        "click #clear": "onClickClear",
        "click #back": "onClickBack"
    },

    initialize: function(code,upUrl,loginKey) {
        this.code = code || 0;
        this.key = loginKey;
        this.$el.html(this.template({
            titles: ["门店管理","店铺详情"],
            back : upUrl
        }));

        this.textShopName = new compText();
        this.textPhone = new compText();
        this.textShopIntro = new compText();
        this.textShopAddr = new compText(); 
        this.selectShopType = new compSelect();
        this.selectShopRight = new compSelect();
        this.fileShopPic = new compFile();
        this.fileHeadPic = new compFile();
        this.selectArea = new compSelect();
        this.ueditorIntro = new compUeditor();
        this.mapShop = new compMap();
        this.area = new compArea(this.key);
        this.dateStart = new compDate();
        this.dateEnd = new compDate();
        

        this.listenTo(this,'dataReady',this.fillPage);
        this.listenTo(this, "renderFinish", this.renderPlugin);
        this.listenTo(this,'confirmFinish',this.confirmFinish);
        this.listenTo(this,'confirmFail',this.confirmFail);

        this.initParamOfPage();

        this.url = 'https://www.kziche.com/admin/Order/storeDetail';
        this.param = {
          key: this.key,
          store_id : this.code
        }

        if((typeof code) !== "undefined" && code != null){
            this.queryData(this.url,this.param);
        }

    },

    render: function() {
        this.$('#main').append(this.textShopName.render().el);
        this.$('#main').append(this.textShopIntro.render().el);
        this.$('#main').append(this.textPhone.render().el);
        this.$('#main').append(this.selectShopType.render().el);
        this.$('#main').append(this.selectShopRight.render().el);
        this.$('#main').append(this.area.render().el);
        this.$('#main').append(this.dateStart.render().el);
        this.$('#main').append(this.dateEnd.render().el);

        this.$('#main').append(this.fileShopPic.render().el);
        this.$('#main').append(this.fileHeadPic.render().el);

        this.$('#main').append(this.textShopAddr.render().el);
        this.$('#main').append(this.mapShop.render().el);

        this.$('#main').append(this.ueditorIntro.render().el);

        return this;
    },

    renderPlugin: function(){
        this.ueditorIntro.trigger("renderFinish");
        this.mapShop.trigger("renderFinish");
    },

    /**
     * 主要用于配置页面各个组件的配置
     */
    initParamOfPage: function() {
        this.textShopName.setParam({
            title : "门店名"
        });
        this.textShopIntro.setParam({
            title : "门店简介"
        });
        this.textPhone.setParam({
            title : "联系电话",
            err:"电话号码格式错误!",
            pattern:  /^1\d{10}$/
        });
        this.selectShopType.setParam({
            title : "门店类型",
            options: [
                {
                    value: 1,
                    content: "快洗"
                }
            ]
        });
        this.selectShopRight.setParam({
            title : "门店权限",
             options: [
                {
                    value: 1,
                    content: "直营"
                }
            ]
        });
        this.fileShopPic.setParam({
            title : "门店略缩图"
        });
        this.fileHeadPic.setParam({
            title : "门店头图"
        });
        this.ueditorIntro.setParam({
            title : "门店介绍",
            msg : "这里是门店对外页面的编辑器"
        });
        this.mapShop.setParam({
            title : "门店地理位置",
            msg : "点击地图标注门店的位置"
        });
        this.area.setParam({
            title : "所属城市"
        });
        this.textShopAddr.setParam({
            title : "门店详细地址",
            msg : "门店的具体地址"
        });
        this.dateStart.setParam({
            title : "每日营业开始时间",
            showTime : "show",
            showDate : "hide"
        });
         this.dateEnd.setParam({
            title : "每日营业结束时间",
            showTime : "show",
            showDate : "hide"
        })
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
        this.textShopName.setValue(data.store_name);
        this.textPhone.setValue(data.phone);
        this.selectShopType.setValue(data.category_id);
        this.selectShopRight.setValue(data.authority_id);
        this.mapShop.setPosition(data.longitude,data.latitude);
        this.area.setValue(data.province_id,data.city_id);
        this.fileShopPic.setFile(data.thumbnail);
        this.fileHeadPic.setFile(data.head_figure);
        this.textShopIntro.setValue(data.brief_introduction);
        this.ueditorIntro.setValue(data.introduce);
        this.textShopAddr.setValue(data.address);
        this.dateStart.setValue(data.start_time);
        this.dateEnd.setValue(data.end_time);
    },

    confirmFinish : function(){
        alert("提交成功");
        window.history.back();
    },

    confirmFail : function(msg){
        alert(msg);
    },

    onClickClear: function() {

    },

    onClickConfirm: function() {
        
        var name = this.textShopName.getValue();
        var phone = this.textPhone.getValue();
        var shopType = this.selectShopType.getValue();
        var shopRight = this.selectShopRight.getValue();
        var shopPic = this.fileShopPic.getFiles();
        var ossShop = this.fileShopPic.isChange();

        var headPic = this.fileHeadPic.getFiles();
        var ossHead = this.fileHeadPic.isChange();
        var area = this.area.getValue() ;
        var introduce = this.ueditorIntro.getValue();
        var positionObj = this.mapShop.getPosition()
        var lng = positionObj.lng || "112.9252020";
        var lat = positionObj.lat || "28.1980240";
        var brief = this.textShopIntro.getValue();
        var addr = this.textShopAddr.getValue();
        var starttime = this.dateStart.getValue();
        var endtime = this.dateEnd.getValue();

        var form = new FormData();
        form.append('id',this.code);
        form.append('key',this.key);
        form.append('name',name);
        form.append('phone',phone);
        form.append('thumbnail',shopPic[0]);
        form.append('oss_photo_notnull',ossShop);
        
        form.append('head_figure',headPic[0]);
        form.append('oss_photo_notnull1',ossHead);

        form.append('category_id',shopType);
        form.append('authority',shopRight);
        form.append('introduce',introduce);
        form.append('brief_introduction',brief);
        form.append('longitude',lng);
        form.append('latitude',lat);
        form.append('province_id',area.province);
        form.append('city_id',area.city);
        form.append('address',addr);
        form.append('start_time',starttime);
        form.append('end_time',endtime);
        
        $.ajax({
            url: 'https://www.kziche.com/admin/Order/addStore',
            type: 'post',
            data: form,
            contentType: false,  
            processData: false,  
            success: function(res) {
                if (res.code == 200) {
                    this.trigger('confirmFinish');
                } else {
                    alert(res.msg);
                    this.trigger('confirmFail',res.msg);
                }
            }.bind(this),
            error: function() {
                alert('页面出错');
            }.bind(this)
        })
    },

    removeEl: function() {
        // this.ueditorIntro.destroyUeditor();
        this.remove();
    }

});