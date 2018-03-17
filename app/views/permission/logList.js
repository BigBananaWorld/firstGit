const htmlTpl = require("Templates/viewsTemplate/example2.html");
const compTable = require("Component/tempTable.js");
const compPage = require("Component/tempPage.js");
const compSearch = require("Component/tempSearch.js");


module.exports = Backbone.View.extend({
    tagName: "div",

    className: "panel panel-default",

    template: _.template(htmlTpl),

    initialize: function() {
        this.$el.html(this.template({
            title : "表格页面",
            sub : "页面说明"
        }));
        this.table = new compTable();
        this.pagement = new compPage();
        this.search = new compSearch();
        // var ue = UE.getEditor('editor');

         this.listenTo(this.search, "goSearch", this.goSearch); //监听查询事件
        this.listenTo(this.pagement, "pageChange", this.pageChange);
        this.listenTo(this, "dataReady", this.freshTable);
        this.initParamOfPage();

        this.url = 'http://www.kzxueche.com/institutionapi/Baseinsti/security_guardList';
        this.tableParam = {
            isexport: 1,
            searchCriteria: '',
            page: 1,
            pagesize: 15,
            key: '40kzm151243778659066910'
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
        var thead = ['安全员编号', "姓名", "性别", "身份证号", "联系电话", "联系地址", "驾驶证号", "在职状态", "入职日期", "同步状态"]; //表头
        var rows = ['secunum', { name: 'name', isSkip: true, link: "views/formExample",code:"id" }, 'sex', 'idcard', 'mobile', 'address', 'drilicence', 'employstatus_name', 'hiredate', 'synchro_flag']; //表列
        var opration = [{ name: '审核', elID: 'code', elName: "sh" }, { name: '编辑', elID: 'code', elName: "bj" }]; //操作的功能组
        this.table.setThead(thead);
        this.table.setRow(rows);
        this.table.setOpration(opration);
        this.table.setHasOpration(false);
        this.table.setHasCheckBox(true);

        //搜索栏配置
        var searchComponents = [{
                type: 'daterange',
                param: {
                    title: "时间范围",
                    startDate: "2017-11-27",
                    endDate: "2017-11-28",
                    startTime: "12:00:01"
                }
            }, {
                type: 'text',
                param: {
                    title: "搜索条件",
                    value: "",
                    explain: "要查询的姓名、订单",
                    name: "name"
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
                         var totalPage =Math.ceil(res.count/this.pagement.getPageSize());
                    this.pagement.setParam({
                            totalPage : totalPage,
                            currentPage : 1
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
        console.log(param);
        //this.tableParam 属性设置
        // this.queryData(this.url,this.tableParam,false);
    },

    removeEl: function() {
        this.remove();
    },

    freshTable: function(data) {
        this.table.setData(data);
    }

});