const htmlTpl = require("Templates/viewsTemplate/example2.html");
const compTable = require("Component/tempTable.js");
const compPage = require("Component/tempPage.js");
const compSearch = require("Component/tempSearch.js");
const compBatch = require("Component/tempBatch.js");

var selectKindModel = Backbone.Model.extend({
    url: "https://www.kziche.com/admin/Member/showServiceCate"
});

module.exports = Backbone.View.extend({
    tagName: "div",

    className: "",

    template: _.template(htmlTpl),

    initialize: function(loginKey) {
        this.$el.html(this.template({
            titles: ["服务管理","服务项目列表"],
            back : false
        }));
        this.table = new compTable();
        this.pagement = new compPage();
        this.search = new compSearch({
            showAdd : true,
            addLink : "#views/project/form/projectEdit",
            showSearch : true,
            linesNum : 1
        });
        this.batch = new compBatch();
        this.key = loginKey;
        
        //通过model形式对数据进行更新
        this.kindModel = new selectKindModel()
        this.kindModel.on("change",this.fillSelectOption,this);

        this.listenTo(this.search, "goSearch", this.goSearch); //监听查询事件
        this.listenTo(this.pagement, "pageChange", this.pageChange);
        this.listenTo(this.batch,"goBatch",this.goBatch);
        this.listenTo(this, "dataReady", this.freshTable);
        this.initParamOfPage();

        this.url = 'https://www.kziche.com/admin/Member/serviceItems';
        this.tableParam = {
            key : this.key,
            searchCriteria: '',
            page: 1,
            pagesize: 15,
            keyword : '',
            shelves_state : '',
            category_id : ''
        }
        this.queryData(this.url, this.tableParam, true);
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
        var thead = ["服务项目","项目编码","所属门店","审核状态","是否上架"]; //表头
        var rows = ["items_name","code", { name: 'store_name', isSkip: false, link: "views/formExample", code: "id" }, 
        "examine_state_name","shelves_state_name" ]; //表列
        var opration = [{ name: '编辑', elID: 'id', elName: "bj",link:"views/project/form/projectEdit" }, 
        // { name: '上架', elID: 'id', elName: "sj" }, { name: '下架', elID: 'id', elName: "xj" }, 
        { name: '回收站', elID: 'id', elName: "hsz" }]; //操作的功能组
        this.table.setThead(thead);
        this.table.setRow(rows);
        this.table.setOpration(opration);
        this.table.setHasOpration(true);
        this.table.setHasCheckBox(true);
        this.table.setCheckId("id");

        //搜索栏配置
        var searchComponents = [
            {
                type: 'text',
                line : 0,
                param: {
                    title: "关键字",
                    value: "",
                    explain: "要查询的关键字",
                    name: "keyword"
                }
            },
            {
                type: 'select',
                line : 0,
                param: {
                    title: "服务状态",
                    options: [{
                        value: '1',
                        content: "上架"
                    }, {
                        value: '2',
                        content: "下架"
                    }],
                    name: "state"
                }
            },
            {
                type: 'select',
                line : 0,
                param: {
                    title: "服务分类",
                    options: [{
                        value: '1',
                        content: "分类1"
                    }, {
                        value: '2',
                        content: "分类2"
                    }],
                    name: "kind"
                }
            }
        ];
      
        this.search.setParam(searchComponents);
        this.kindModel.fetch({
            type: 'get',
            dataType: 'json',
            data: {
                 key : this.key
            },
        });
         /*
        批量操作组件配置
         */
        var batchOptions = [
            {value : "1",content : "上架"},
            {value : "2",content : "下架"},
            {value : "3",content : "放入回收站"}
        ]
        this.batch.setParam(batchOptions);
    },
    /**
     * 查询数据
     * @param  {string} url       [接口url]
     * @param  {object} param     [需要传入的参数]
     * @param  {boolean} firstTime [是否需要重新渲染分页]
     */
    queryData: function(url, param, firstTime, type) {
        $.ajax({
            url: url,
            type: type || 'get',
            dataType: 'json',
            data: param,
            success: function(res) {
                if (res.code == 200) {
                    this.trigger('dataReady', res.data);
                    if (firstTime) {
                        this.pagement.clearPage();
                        var totalPage = Math.ceil(res.count / this.pagement.getPageSize());
                        this.pagement.setParam({
                            totalPage: totalPage,
                            currentPage: 1,
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

    pageChange: function(currentPage) {
        this.tableParam.page = currentPage;
        this.queryData(this.url, this.tableParam, false);
    },

    goSearch: function(param) {
        var searchKind = this.search.getElByName('kind');
        var searchState = this.search.getElByName('state');
        var searchKeyword = this.search.getElByName('keyword');
       
        this.tableParam.keyword  = searchKeyword.getValue();
        this.tableParam.shelves_state  = searchState.getValue();
        this.tableParam.category_id = searchKind.getValue();
        this.tableParam.page = 1;
        this.queryData(this.url, this.tableParam, true);
    },

    goBatch: function(type){
       var ids = [];
       var url = "";
       var param = null;
       //获取选取的记录ID
       this.$("#cont tbody input[type='checkbox']:checked").each(function(index,e){
            ids.push($(e).attr("checkid"));
       });
    
       if(ids.length == 0){
            alert("未选取任何记录");
            return;
       }

       var idsString = ids.join(",");

       if(type == "1"){
            url ="https://www.kziche.com/admin/Member/serviceItemsShelves";
            param = {
                key : this.key,
                items_ids : idsString,
                type : type
            };
       }
       if(type == "2"){
            url ="https://www.kziche.com/admin/Member/serviceItemsShelves";
            param = {
                key : this.key,
                items_ids : idsString,
                type : type
            }
       }
       if(type == "3"){
            url ="https://www.kziche.com/admin/Member/delItems";
            param = {
                key : this.key,
                items_ids : idsString,
                type : 2
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

         /*
        绑定操作点击事件
         */
        var me = this;
        this.$('a[name="hsz"]').click(function(el){
            var ids = $(el.target).attr("elid");
            var text = $(el.target).text();
            var url ="https://www.kziche.com/admin/Member/delItems";
            var param = {
                key : me.key,
                items_ids : ids,
                type : 2
            };
            var sure = window.confirm("确定执行 "+text+" 操作?");
            if(sure){
                me.batchAjax(url,param);    
            }
            
        });

    },

    fillSelectOption : function(mod,option){
        var me = this;
        var searchKind = me.search.getElByName("kind");
        searchKind.setOptions(mod.get("data"));
    }

});