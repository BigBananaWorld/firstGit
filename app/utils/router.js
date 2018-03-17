module.exports = Backbone.Router.extend({
	initialize : function(e){
		this.upUrl = "";//上一级页面路径，用于表单的返回路径
	},

	routes : {
		"" : "default",
		"views/order/orderList/code:p" : "changeToOrderList",
		":route/:route/:route/:route/code:p" : "changeUrlWithCode",//用于匹配带参数的路径
		":route/:route/:route/:route" : "changeUrlWithCode",//用于匹配不带参数的表单路径
		"*param" : "changeUrl"
	},

	default : function(){
		var defaultPage = "views/member/memberList";
		this.changeUrl(defaultPage);
	},

	changeUrl : function(param){
		this.upUrl = param;
		var compUrl = param || "views/member/memberList";
		try{
			var tempComponent = require('../' + compUrl + ".js");
			this.trigger("routerChange",tempComponent,compUrl);
		}catch(err){
			console.error(err);
			this.trigger("routerWrong",compUrl);
		}
	},

	changeUrlWithCode : function(route1,route2,route3,route4,code){
		var code = code || null;
		var upUrl = "#" + this.upUrl;
		var url = route1 + '/' + route2 +'/' + route3 +'/' + route4;
		try{
			var tempComponent = require('../' + url + ".js");
			this.trigger("routerChangeWithCode",tempComponent,code,upUrl,url);
		}catch(err){
			console.error(err);
			this.trigger("routerWrong",url);
		}	
	},

	changeToOrderList : function(code){
		var code = code || null;
		var upUrl = "#" + this.upUrl;
		try{
			var tempComponent = require("../views/order/orderList.js");
			this.trigger("routerOrderList",tempComponent,code,upUrl);
		}catch(err){
			console.error(err);
			this.trigger("routerWrong");
		}	
	}
})