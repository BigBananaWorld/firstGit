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
        this.key = loginKey;
        this.$el.html(this.template({
            titles: ["权限管理","管理员列表"],
            back : false
        }));
        this.table = new compTable();
        this.pagement = new compPage();
        this.search = new compSearch({
            showAdd : true,
            addLink : "#views/permission/form/adminEdit",
            showSearch : true,
            linesNum : 1
        });
        this.batch = new compBatch();

        this.listenTo(this.search, "goSearch", this.goSearch); //监听查询事件
        this.listenTo(this.pagement, "pageChange", this.pageChange);
        this.listenTo(this, "dataReady", this.freshTable);
        this.listenTo(this.batch,"goBatch",this.goBatch);
        this.initParamOfPage();

        this.url = 'https://www.kziche.com/admin/Order/manageList';
        this.tableParam = {
            key : this.key,
            searchCriteria: '',
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
        var thead = ['用户名', "管理员归属", "加入时间", "最后登录时间", "操作人"]; //表头
        var rows = ['username','type_name', 'create_time', 'last_login_time', 'manage_name']; //表列
        var opration = [{ name: '编辑', elID: 'manage_id', elName: "bj",link:"views/permission/form/adminEdit" },
        { name: '封号', elID: 'manage_id', elName: "fh" }, { name: '解封', elID: 'manage_id', elName: "jf" }, 
        { name: '删除', elID: 'manage_id', elName: "del" }]; //操作的功能组
        this.table.setThead(thead);
        this.table.setRow(rows);
        this.table.setOpration(opration);
        this.table.setHasOpration(true);
        this.table.setHasCheckBox(true);
        this.table.setCheckId("manage_id");

        //搜索栏配置
        var searchComponents = [{
                type: 'text',
                line : 0,
                param: {
                    title: "搜索条件",
                    value: "",
                    explain: "要查询的用户名、手机号码",
                    name: "text"
                }
            }
        ];
        this.search.setParam(searchComponents);

        var batchOptions = [
            {value : "1",content : "解封"},
            {value : "2",content : "封号"},
            {value : "3",content : "删除"}
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
        var searchText = this.search.getElByName('text');
        this.tableParam.searchCriteria = searchText.getValue();
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
            url ="https://www.kziche.com/admin/Order/sealManage";
            param = {
                key : this.key,
                manage_ids : idsString,
                type : type
            };
       }
       if(type == "2"){
            url ="https://www.kziche.com/admin/Order/sealManage";
            param = {
                key : this.key,
                manage_ids : idsString,
                type : type
            }
       }
       if(type == "3"){
            url ="https://www.kziche.com/admin/Order/delManage";
            param = {
                key : this.key,
                manage_ids : idsString
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
    }

});