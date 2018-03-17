const htmlTpl = require("Templates/viewsTemplate/example2.html");
const compTable = require("Component/tempTable.js");
const compPage = require("Component/tempPage.js");
const compSearch = require("Component/tempSearch.js");
const compBatch = require("Component/tempBatch.js");

module.exports = Backbone.View.extend({
    tagName: "div",

    className: "",

    template: _.template(htmlTpl),

    initialize: function(loginKey) {
        this.$el.html(this.template({
           titles: ["服务管理","次卡列表"],
            back : false
        }));
        this.table = new compTable();
        this.pagement = new compPage();
        this.search = new compSearch({
            showAdd : true,
            addLink : "#views/project/form/cardEdit",
            showSearch : false,
            linesNum : 0
        });
        this.batch = new compBatch();
        this.key = loginKey;

        this.listenTo(this.pagement, "pageChange", this.pageChange);
        this.listenTo(this, "dataReady", this.freshTable);
        this.listenTo(this.batch,"goBatch",this.goBatch);
        this.initParamOfPage();

        this.url = 'https://www.kziche.com/admin/Member/cardList';
        this.tableParam = {
            key : this.key,
            page: 1,
            pagesize: 15
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
        var thead = ['次卡名称', "使用类型", "使用方式", "价格", "次数","是否上架"]; //表头
        var rows = ['name', 'category_name', 'rule_name', 'price', 'number','state_name']; //表列
        var opration = [{ name: '编辑', elID: 'id', elName: "edt",link: "views/project/form/cardEdit" }];
        // ,{ name: '下架', elID: 'id', elName: "xj" }]; //操作的功能组
        this.table.setThead(thead);
        this.table.setRow(rows);
        this.table.setOpration(opration);
        this.table.setHasOpration(true);
        this.table.setHasCheckBox(true);
        this.table.setCheckId("id");

        // var searchComponents = [
        //     {
        //         type: 'text',
        //         param: {
        //             title: "条件查找",
        //             value: "",
        //             explain: "要查询的次卡名",
        //             name: "text"
        //         }
        //     }
        // ];
        // this.search.setParam(searchComponents);

        var batchOptions = [
            {value : "1",content : "上架"},
            {value : "2",content : "下架"}
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
        // var dateRange = this.search.getElByName('daterange');
        // console.log(dateRange.getStartDate());
        // console.log(dateRange.getEndDate());
        
        //this.tableParam 属性设置
        // this.queryData(this.url,this.tableParam,false);
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
            url ="https://www.kziche.com/admin/Member/cardShelves";
            param = {
                key : this.key,
                card_ids : idsString,
                type : type
            };
       }
       if(type == "2"){
            url ="https://www.kziche.com/admin/Member/cardShelves";
            param = {
                key : this.key,
                card_ids : idsString,
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
                console.log('页面出错');
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
    }

});