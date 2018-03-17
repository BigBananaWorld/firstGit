const htmlTpl = require("Templates/viewsTemplate/example2.html");
const compTable = require("Component/tempTable.js");
const compPage = require("Component/tempPage.js");
const compSearch = require("Component/tempSearch.js");

var model = Backbone.Model.extend({
    url: "https://www.kziche.com/admin/Member/memberList",
    parse: function(response,param) {
        return response;
    }
})

module.exports = Backbone.View.extend({
    tagName: "div",

    className: "",

    template: _.template(htmlTpl),

    events: {
        "click #test2": "onClickTest2"
    },

    initialize: function() {
        this.modelMem = new model();

        this.$el.html(this.template({
            titles: ["管理中心","页面正式标题"],
            back : true
        }));
        this.table = new compTable();
        this.pagement = new compPage();
        this.search = new compSearch({
            showAdd: false,
            addLink: "",
            showSearch: true,
            linesNum: 2
        });

        this.listenTo(this.search, "goSearch", this.goSearch);
        this.listenTo(this.pagement, "pageChange", this.pageChange);
        this.listenTo(this, "dataReady", this.freshTable);
        this.initParamOfPage();

        this.tableParam = {
            isexport: 1,
            searchCriteria: '',
            page: 1,
            pagesize: 15,
            key: '1kzm151435708962984681'
        };

        this.modelMem.on("change", this.dataSuccess,this);
        this.modelMem.on("error",this.dataError,this);

        this.modelMem.fetch({
            type: 'get',
            dataType: 'json',
            data: this.tableParam,
            firstTime : true
        });
    },

    render: function() {
        this.$('#search').append(this.search.render().el);
        this.$('#cont').append(this.table.render().el);
        return this;
    },

    /**
     * 主要用于配置页面各个组件的配置
     */
    initParamOfPage: function() {
        //列表初始配置
        var thead = ["用户名", "性别", "用户来源", "车牌", "手机号", "会员等级", "积分", "余额", "赠送金额", "注册日期", "实名认证"]; //表头
        var rows = ['nickname', 'sex', 'source_name', 'license_plate', 'phone', 'grade_name', 'integral', 'balance', 'gift_amount', 'create_time', 'is_validate']; //表列
        var opration = [{ name: '编辑', elID: 'id', elName: "edt", link: "views/member/form/memberEdit" },
            { name: '订单', elID: 'id', elName: "ord", link: "views/order/orderList" },
            { name: '冻结', elID: 'id', elName: "dj" }
        ]; //操作的功能组
        this.table.setThead(thead);
        this.table.setRow(rows);
        this.table.setOpration(opration);
        this.table.setHasOpration(true);
        this.table.setHasCheckBox(true);
        this.table.setCheckId("id");

        //搜索栏配置
        var searchComponents = [{
            type: 'daterange',
            line : 0,
            param: {
                title: "时间范围",
                name: "daterange",
                startDate: this.getDate('month',3),
                endDate: this.getDate()
            }
        }, {
            type: 'text',
            line : 1,
            param: {
                title: "输入条件",
                value: "",
                explain: "用户名/手机号",
                name: "text"
            }
        }];
        this.search.setParam(searchComponents);
    },

    dataSuccess : function(mod, option){
            var code = mod.get("code");
            var firstTime = option.firstTime;
            if (code == 200) {
                this.trigger('dataReady', mod.get("data"));
                if (firstTime) {
                    this.pagement.clearPage();
                    var totalPage = Math.ceil(mod.get("count") / this.pagement.getPageSize());
                    this.pagement.setParam({
                        totalPage: totalPage,
                        currentPage: 1
                    })
                    this.$('#pg').append(this.pagement.render().el);
                }

            } else {
                var temp = [];
                this.trigger('dataReady', temp);
            }
    },

    dataError : function(mod,option){

    },

    pageChange: function(currentPage) {
        this.tableParam.page = currentPage;
        this.modelMem.fetch({
            type: 'get',
            dataType: 'json',
            data: this.tableParam,
            firstTime : false
        })
    },

    goSearch: function() {
        var dateRange = this.search.getElByName('daterange');
        var searchText = this.search.getElByName('text');
       
        this.tableParam.searchCriteria = searchText.getValue();
        this.tableParam.signStartTime = dateRange.getStartDate();
        this.tableParam.signEndTime = dateRange.getEndDate();
        this.tableParam.page = 1;
        this.modelMem.fetch({
            type: 'get',
            dataType: 'json',
            data: this.tableParam,
            firstTime : true
        })
    },

    removeEl: function() {
        this.remove();
    },

    freshTable: function(data) {
        if(data.length == 0){
            this.pagement.clearPage();
        }
        this.table.setData(data);
    },

    getDate : function(type,param){
        let date = new Date();
        if(type && type=="month"){
            date.setMonth(date.getMonth()-param);
        }
        if(type && type=="day"){
            date.setDate(date.getDate() - param);
        }
        let day = date.getDate();
        let month = date.getMonth() + 1;

        if(day < 10){
            day = "0" + day;
        }
        if(month < 10){
            month = "0" + month;
        }
        let year = date.getFullYear();
        let result = year + "-" + month + "-" + day;
        return result;
    }
});