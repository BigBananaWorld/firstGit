const htmlTpl = require("Templates/viewsTemplate/programEdit.html");
const normalEdit = require("./projectEditNormal.js");
const detailEdit = require("./projectEditDetail.js");

module.exports = Backbone.View.extend({
    tagName: "div",

    className: "",

    template: _.template(htmlTpl),

    events : {
        "click ul>li>a" : "onClickA",
        "click #allConfirm" : "onConfirm",
        "click #allClear" : "onClear"
    },

    initialize: function(code,upUrl,loginKey) {
        this.code = code || 0;
        this.key = loginKey;
        this.$el.html(this.template({
            titles: ["服务管理","服务项目详情"],
            back : upUrl
        }));

        this.normalProject = new normalEdit(this.code,upUrl,this.key);
        this.detailProject = new detailEdit(this.code,upUrl,this.key);

        this.listenTo(this.pagement, "pageChange", this.pageChange);
        this.listenTo(this, "dataReady", this.fillPage);
        this.listenTo(this, "renderFinish", this.renderPlugin);
        this.listenTo(this, 'confirmFinish',this.confirmFinish);//表单提交成功后的回调函数

        this.url = 'https://www.kziche.com/admin/Member/showServiceItems';
        this.param = {
            key : this.key,
            items_id : this.code
        }

       if((typeof code) !== "undefined" && code != null){
            this.queryData(this.url,this.param);
        }
    },

    render: function() {
        this.$("#normal").append(this.normalProject.render().el);
        this.$("#detail").append(this.detailProject.render().el);
        return this;
    },

    renderPlugin: function(){
        this.detailProject.trigger("renderFinish");
    },
/**
 * 查询数据
 * @param  {string} url       [接口url]
 * @param  {object} param     [需要传入的参数]
 * @param  {boolean} firstTime [是否需要重新渲染分页]
 */
    queryData: function(url, param,type) {
        $.ajax({
            url: url,
            type: type || 'get',
            dataType: 'json',
            data: param,
            success: function(res) {
                if (res.code == 200) {
                    this.trigger('dataReady', res.data);
                } else {
                    var temp = [];
                    this.trigger('dataReady', temp);
                }
            }.bind(this),
            error: function() {
                console.log('页面出错');
            }.bind(this)
        })
    },

    fillPage: function(data) {
       this.normalProject.fillPage(data);
       this.detailProject.fillPage(data);
    },
/**
 * 点击导航栏触发的回调函数
 */
    onClickA : function(e){
        this.$('ul').find('li').removeClass('active');
        $(e.target).closest('li').addClass('active');
        var targetId = $(e.target).attr('targetId');
        this.$('#myTabContent>div').removeClass('in').removeClass('active');
        this.$('#'+targetId).addClass('in').addClass('active');
    },

    onClear : function(e){
        
    },

    confirmFinish : function(){
        alert("提交成功");
        window.history.back();
    },

    onConfirm : function(e){
        var normal = this.normalProject.getFormData();
        var detail = this.detailProject.getFormData();
        var form = new FormData();
        form.append('key', this.key);
        form.append('id', this.code);
        form.append('name', normal.name);
        form.append('category_id', normal.category_id);
        form.append('actual_price', normal.actual_price);
        form.append('market_price', normal.market_price);
        form.append('keyword', normal.keyword);
        form.append('thumbnail', normal.thumbnail);
        form.append('oss_photo_notnull', normal.oss_photo_notnull);
        form.append('colour', normal.colour);
        for (let i = 0; i < (normal.main).length; i++) {
            form.append('pic[]', (normal.main)[i]);
        }

        form.append('describe', detail.describe);
        form.append('brief_introduction',detail.brief_introduction);
        $.ajax({
            url: 'https://www.kziche.com/admin/Member/addServiceItems',
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