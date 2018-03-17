require("CSSdir/bootstrap/dist/css/bootstrap.min.css");
require("CSSdir/index.css");
require("CSSdir/formStyle.css");

// const defaultPage = require("Component/pageComponent.js");
const router = require("Utils/router.js");
const siderbar = require("Component/siderbar.js");
const headmenu = require("Component/headmenu.js");

var app = Backbone.View.extend({
    initialize: function(router) {
        this.currentView = null;
        this.routeEl = router;
        this.init();
        this.render();
    },

    render: function() {
        $('#siderbar').html(this.siderbar.el);
        $('#head').html(this.headmenu.render().el);
    },

    init: function() {

        this.key = window.localStorage.getItem("kzicar_key");
        this.isLogin(this.key);
        /*
        监听登陆状态
         */
        this.listenTo(this,"noLogin",this.loginOut);
        /*
        配置路由
         */
        this.listenTo(this.routeEl, "routerChange", this.onChangeRoute);
        this.listenTo(this.routeEl, "routerChangeWithCode", this.onChangeRouteWithCode);
        this.listenTo(this.routeEl, "routerOrderList", this.onChangeRouterOrderList);
        this.listenTo(this.routeEl, "routerWrong", this.wrongRoute);

        /*
        左侧菜单栏
         */
        this.siderbar = new siderbar();

        this.headmenu = new headmenu();
    },

    /**
     * 路由转换的时候渲染相关模块
     * @param  {Backbone.View} component [路由给出的视图控件]
     */
    onChangeRoute: function(component,url) {
        this.siderbar.showCurrentOption(url);
        if (this.currentView) {
            this.currentView.remove();
            this.currentView = null;
        }
        var tempView = new component(this.key);
        tempView.render();
        $('#container').append(tempView.el);
        tempView.trigger("renderFinish");//触发渲染完成事件，对于第三方组件有用
        this.currentView = tempView;
    },

    /**
     * 渲染带参数的路由
     * @param  {Backbone.View} component [路由给出的视图控件]
     * @param  {string} code      [传入的参数，一般是某ID]
     */
    onChangeRouteWithCode: function(component, code ,upUrl, url) {
        this.siderbar.showCurrentOption(url);
        if (this.currentView) {
            this.currentView.remove();
            this.currentView = null;
        }
        var tempView = new component(code,upUrl,this.key);
        tempView.render();
        $('#container').append(tempView.el);
        tempView.trigger("renderFinish");//触发渲染完成事件，对于第三方组件有用
        this.currentView = tempView;
    },

    /**
     * [onChangeRo]
     * @param  {[type]} component [description]
     * @param  {[type]} code      [description]
     * @param  {[type]} upUrl     [description]
     * @return {[type]}           [description]
     */
    onChangeRouterOrderList : function(component,code,upUrl){
        if (this.currentView) {
            this.currentView.remove();
            this.currentView = null;
        }
        var tempView = new component(this.key,code,upUrl);
        tempView.render();
        $('#container').append(tempView.el);
        this.currentView = tempView;
    },

    /**
     * 程序出现错误展现的页面
     * @param  {[type]} component [description]
     */
    wrongRoute: function(url) {
        console.error('发生错误'+url);
    },

    /**
     * 验证登陆状态
     * @type {[type]}
     */
    isLogin : function(key){
        if(!key){
            this.trigger('noLogin',"请先登陆");
        }
        $.ajax({
            url: 'https://www.kziche.com/admin/Member/isLogin',
            type: 'get',
            dataType: 'json',
            data: {
                key : key
            },
            success: function(res) {
                if (res.code == 200) {
                    // this.trigger('dataReady', res.data);
                } else {
                    this.trigger('noLogin',res.msg);
                }
            }.bind(this),
            error: function() {
                console.log('页面出错');
            }.bind(this)
        })
    },

    /**
     * 验证失败弹出至登陆页
     * @param  {[type]} msg [失败信息]
     * @return {[type]}     [description]
     */
    loginOut : function(msg){
        alert("请重新登录");
        window.location.href="../public/login.html";
    }
})

var routeEl = new router();
new app(routeEl);
Backbone.history.start(); //开启路由