const htmlTpl = require("Templates/viewsTemplate/example2.html");
const compTable = require("Component/tempTable.js");
const compPage = require("Component/tempPage.js");
const compSearch = require("Component/tempSearch.js");

module.exports = Backbone.View.extend({
    tagName: "div",

    className: "",

    template: _.template(htmlTpl),

    initialize: function(code,upUrl,loginKey) {
        window.sessionStorage.setItem('position',code);
        this.key = loginKey;

        this.code = code || 0;
        this.$el.html(this.template({
            titles: ["广告管理","广告位列表","广告列表"],
            back : true
        }));
        this.table = new compTable();
        this.pagement = new compPage();
        this.search = new compSearch({
            showAdd : true,
            addLink : "#views/advertisement/form/advertEdit",
            showSearch : true,
            linesNum : 1
        });

        this.listenTo(this.search, "goSearch", this.goSearch); //监听查询事件
        this.listenTo(this.pagement, "pageChange", this.pageChange);
        this.listenTo(this, "dataReady", this.freshTable);
        this.initParamOfPage();

        this.url = 'https://www.kziche.com/admin/Ad/adList';
        this.tableParam = {
            key: this.key,
            searchCriteria: '',
            page: 1,
            getpage: 15,
            position_id : this.code
        }
        this.queryData(this.url, this.tableParam,true);
    },

    render: function() {
        this.$('#search').append(this.search.render().el);
        this.$('#cont').append(this.table.render().el);
        // this.$('#pg').append(this.pagement.render().el);
        return this;
    },

    /**
     * 主要用于配置页面各个组件的配置
     */
    initParamOfPage: function() {
        //列表初始配置
        var thead = ["广告标题","广告位","状态","显示类型"]; //表头
        var rows = ["title","position_name","status_name","type_name"]; //表列
        var opration = [{ name: '编辑', elID: 'id', elName: "bj",link:"views/advertisement/form/advertEdit" },
        { name: '隐藏', elID: 'id', elName: "hide" }, { name: '删除', elID: 'id', elName: "del" }]; //操作的功能组
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
                    title: "搜索条件",
                    value: "",
                    explain: "要查询的广告位名称",
                    name: "text"
                }
            }

        ];
        this.search.setParam(searchComponents);
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
        var searchText = this.search.getElByName('text');
        this.tableParam.searchCriteria = searchText.getValue();
        this.tableParam.page = 1;
        this.queryData(this.url,this.tableParam,true);
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