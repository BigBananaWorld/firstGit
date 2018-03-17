const htmlTpl = require("Templates/viewsTemplate/example2.html");
const compTable = require("Component/tempTable.js");
const compPage = require("Component/tempPage.js");
const compSearch = require("Component/tempSearch.js");
const compBatch = require("Component/tempBatch.js");

module.exports = Backbone.View.extend({
    tagName: "div",

    className: "",

    template: _.template(htmlTpl),

    initialize: function(loginKey,code,upUrl) {
        this.$el.html(this.template({
            titles: ["回收站","订单回收"],
            back : false
        }));
        this.table = new compTable();
        this.pagement = new compPage();
        this.search = new compSearch({
            showAdd : false,
            addLink : "",
            showSearch : true,
            linesNum : 1
        });
        this.batch = new compBatch();
        this.key = loginKey;

        this.listenTo(this.search, "goSearch", this.goSearch);
        this.listenTo(this.pagement, "pageChange", this.pageChange);
        this.listenTo(this, "dataReady", this.freshTable);
        this.listenTo(this.batch,"goBatch",this.goBatch);
        this.initParamOfPage();

        this.url = 'https://www.kziche.com/admin/Order/orderList';
        this.tableParam = {
            key : this.key,
            searchCriteria: '',
            page: 1,
            pagesize: 15,
            signStartTime : this.getDate('month',3),
            signEndTime : this.getDate(),
            logical_deletion : 2
        }
        
        this.queryData(this.url, this.tableParam,true);
    },

    render: function() {
        this.$('#search').append(this.search.render().el);
        this.$('#cont').append(this.table.render().el);
        this.$('#batch').append(this.batch.render().el);
        return this;
    },

    /**
     * 主要用于配置页面各个组件的配置
     */
    initParamOfPage: function() {
        //列表初始配置
        var thead = ["会员", "订单号", "内容", "付款方式", "所属门店", "金额", "状态", "创建时间"];
        var rows = ["nickname", { name: 'order_sn', isSkip: false, link: "views/formExample",code:"id" }, "items_name", "pay_type_name", "store_name",
         "actual_money", "state_name", "create_time"]; //表列
        var opration = [ { name: '恢复', elID: 'order_id', elName: "rec" }]; //操作的功能组
        this.table.setThead(thead);
        this.table.setRow(rows);
        this.table.setOpration(opration);
        this.table.setHasOpration(true);
        this.table.setHasCheckBox(true);
        this.table.setCheckId("order_id");

        //搜索栏配置
        var searchComponents = [{
                type: 'daterange',
                line : 0,
                param: {
                    title: "时间范围",
                    startDate: this.getDate('month',3),
                    endDate: this.getDate(),
                    name : "daterange"
                }
            }, {
                type: 'text',
                line : 0,
                param: {
                    title: "搜索条件",
                    value: "",
                    explain: "要查询的会员名、订单号、状态、支付方式、内容",
                    name: "text"
                }
            }

        ];
        this.search.setParam(searchComponents);

        var batchOptions = [
            {value : "1",content : "恢复"}
        ]
        this.batch.setParam(batchOptions);
    },
/**
 * 查询数据
 * @param  {string} url       [接口url]
 * @param  {object} param     [需要传入的参数]
 * @param  {boolean} firstTime [是否需要重新渲染分页]
 */
    queryData: function(url, param,firstTime,type) {
        $.ajax({
            url: url,
            type: type || 'get',
            dataType: 'json',
            data: param,
            success: function(res) {
                if (res.code == 200) {
                    this.trigger('dataReady', res.data);
                    if(firstTime){
                        this.pagement.clearPage();
                         var totalPage =Math.ceil(res.count/this.pagement.getPageSize());
                    this.pagement.setParam({
                            totalPage : totalPage,
                            currentPage : 1,
                            total : res.count
                        })
                    this.$('#pg').append(this.pagement.render().el);
                    }
                   
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

    pageChange : function(currentPage){
        this.tableParam.page = currentPage;
        this.queryData(this.url,this.tableParam,false);
    },

    goSearch: function(param) {
        var dateRange = this.search.getElByName('daterange');
        var searchText = this.search.getElByName('text');
        var searchPay = this.search.getElByName('pay');//接口没有涉及
       
        this.tableParam.searchCriteria = searchText.getValue();
        this.tableParam.signStartTime = dateRange.getStartDate();
        this.tableParam.signEndTime = dateRange.getEndDate();
        this.tableParam.page = 1;
        this.queryData(this.url, this.tableParam, true);
    },

    goBatch: function(type){
       var ids = [];
       var url = "";
       var param = null;

       this.$("#cont tbody input[type='checkbox']:checked").each(function(index,e){
            ids.push($(e).attr("checkid"));
       });
    
       if(ids.length == 0){
            alert("未选取任何记录");
            return;
       }

       var idsString = ids.join(",");

       if(type == "1"){
            url ="https://www.kziche.com/admin/Order/delOrder";
            param = {
                key : this.key,
                order_ids : idsString,
                type : type
            }
       }
       this.batchAjax(url,param);
    },

    batchAjax: function(tempUrl,param){
        var me = this;
        $.ajax({
            url: tempUrl,
            type: 'get',
            dataType: 'json',
            data: param,
            success: function(res) {
                if (res.code == 200) {
                    alert(res.msg);
                    this.tableParam.page = 1;
                    this.queryData(me.url, me.tableParam,true);
                } else {
                    alert(res.msg);
                }
            }.bind(this),
            error: function() {
                alert('页面出错');
            }.bind(this)
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
        var me = this;
        this.$('a[name="rec"]').click(function(el){
            var ids = $(el.target).attr("elid");
            var text = $(el.target).text();
            var url ="https://www.kziche.com/admin/Order/delOrder";
            var param = {
                key : me.key,
                order_ids : ids,
                type : "1"
            };
            var sure = window.confirm("确定执行 "+text+" 操作?");
            if(sure){
                me.batchAjax(url,param);    
            }
            
        })
    },

    /**
 * 获取日期
 * @param  {string} type  [修改的类型month月份,day天数]
 * @param  {num} param [与当前日期回退的type数量]
 * @return {[type]}       [description]
 */
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