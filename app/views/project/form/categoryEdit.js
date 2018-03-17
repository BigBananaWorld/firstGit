const htmlTpl = require("Templates/viewsTemplate/formExample.html");
const compCheckbox = require("Component/forform/tempCheckbox.js");
const compSelect = require("Component/forform/tempSelect.js");
const compText = require("Component/forform/tempText.js");
const compFile = require("Component/forform/tempSingleFile.js");
const compColor = require("Component/forform/tempColor.js");

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
           titles: ["服务管理"," 分类详情"],
            back : upUrl
        }));

        this.textCateName = new compText();
        this.textSort = new compText();
        this.textDescribe = new compText();

        this.checkboxIsShow = new compCheckbox();
        this.checkboxIsShowOnSide = new compCheckbox();

        this.color = new compColor();
        this.selectUpCate = new compSelect();
        this.filePhoto = new compFile();

        this.initParamOfPage();

        this.listenTo(this, 'dataReady', this.fillPage);
        this.listenTo(this, 'confirmFinish',this.confirmFinish);//表单提交成功后的回调函数

        this.url = 'https://www.kziche.com/admin/Member/serviceCateDetail';
        this.param = {
          key: this.key,
          cate_id : this.code
        }
        //如果传入参数则为编辑页面，没有则为添加页面
        if((typeof code) !== "undefined" && code != null){
            this.queryData(this.url, this.param)
        }
    },

    render: function() {
        this.$('#main').append(this.textCateName.render().el);
        this.$('#main').append(this.selectUpCate.render().el);
        this.$('#main').append(this.textSort.render().el);
        this.$('#main').append(this.checkboxIsShow.render().el);
        this.$('#main').append(this.checkboxIsShowOnSide.render().el);
        this.$('#main').append(this.color.render().el);
        
        this.$('#main').append(this.textDescribe.render().el);

        this.$('#main').append(this.filePhoto.render().el);
        return this;
    },

    /**
     * 主要用于配置页面各个组件的配置
     */
    initParamOfPage: function() {
        this.textCateName.setParam({
            title: "分类名称"
        });
        this.textDescribe.setParam({
            title: "分类描述",
            msg: "简要描述该分类"
        });
       
        this.textSort.setParam({
            title: '排序',
            msg: "该分类的排序"
        })
        this.selectUpCate.setParam({
            title: "上级分类",
            options: [{
                    value: 0,
                    content: "顶级分类"
                }
            ]
        });
        this.color.setParam({
            title: "图表颜色",
            msg : "选择在图表中显示的颜色(rgb格式)"
        });
         
        this.checkboxIsShow.setParam({
            title: "是否显示",
            options: [{
                    value: 1,
                    content: "是"
                },
                {
                    value: 2,
                    content: "否"
                }
            ]
        });
         this.checkboxIsShowOnSide.setParam({
            title: "是否显示在导航栏",
            options: [{
                    value: 1,
                    content: "是"
                },
                {
                    value: 2,
                    content: "否"
                }
            ]
        });
        this.filePhoto.setParam({
            title: "分类图片"
        })

    },

    /**
     * 根据条件过去数据
     * @param  {object} param [条件]
     * @return {[type]}       [description]
     */
    queryData: function(url, param, type) {
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

    fillPage: function(data) { //这里再进行数据的装配
        this.textCateName.setValue(data.name);
        this.textSort.setValue(data.sort);
        this.textDescribe.setValue(data.describe);
        this.checkboxIsShow.setValue(data.is_show);
        this.checkboxIsShowOnSide.setValue(data.is_navigation);
        this.selectUpCate.setValue(data.pid);
        this.filePhoto.setFile(data.pic);
        this.color.setValue(data.colour);
    },

    onClickClear: function(e){
      
    },

    confirmFinish : function(){
        alert("提交成功");
        window.history.back();
    },

    onClickConfirm: function(e){
        var name = this.textCateName.getValue();
        var sort = this.textSort.getValue();
        var describe = this.textDescribe.getValue();
        var isShow = this.checkboxIsShow.getValue();
        var isNavigation = this.checkboxIsShowOnSide.getValue();
        var pid = this.selectUpCate.getValue();
        var photo = this.filePhoto.getFiles();
        var ossPhoto = this.filePhoto.isChange();
        var color = this.color.getValue();

        var form = new FormData();
        form.append('id',this.code);
        form.append('key',this.key);
        form.append('name',name);
        form.append('colour',color);
        form.append('pic',photo[0]);    
        
        form.append('is_show',isShow);
        form.append('is_navigation',isNavigation);
        form.append('describe',describe);
        form.append('sort',sort);
        form.append('pid',pid);
        form.append('oss_photo_notnull', ossPhoto);

        $.ajax({
            url: 'https://www.kziche.com/admin/Member/addServiceCate',
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
        this.remove();
    }

});