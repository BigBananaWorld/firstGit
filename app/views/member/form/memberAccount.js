const htmlTpl = require("Templates/viewsTemplate/member/memberAccount.html");
const compTable = require("Component/tempTable.js");
const compPage = require("Component/tempPage.js");
const compSelect = require("Component/forsearch/select.js");

module.exports = Backbone.View.extend({
    tagName: "div",

    className: "",

    template: _.template(htmlTpl),

    events : {
        "change select[name='type']" : "onSelectChange"
    },

    initialize: function(code,upUrl,loginKey) {
        this.$el.html(this.template({
            titles: ["会员管理","会员列表","会员详情","会员账户"],
            back : true,
            code : code
        }));

        this.table = new compTable();
        this.pagement = new compPage();
        this.selectType = new compSelect();
        this.key = loginKey;

        this.listenTo(this.pagement, "pageChange", this.pageChange);
        this.listenTo(this, "tableDataReady", this.freshTable);
        this.listenTo(this, "pageDataReady", this.freshPage);
        this.initParamOfPage();

        this.url = 'https://www.kziche.com/admin/Member/memberAcount';
        this.tableParam = {
            member_id : code,
            type : 1,
            key : this.key,
        }
        this.queryTableData(this.url, this.tableParam,true);

       this.pageUrl = 'https://www.kziche.com/admin/Member/memberDetail';
       this.pageParam = {
            key : this.key,
            member_id : code,
        }
        this.queryPageData(this.pageUrl,this.pageParam);
    },

    render: function() {
        this.$('#cont').append(this.table.render().el);
        this.$('#op').append(this.selectType.render().el);
        return this;
    },

    /**
     * 主要用于配置页面各个组件的配置
     */
    initParamOfPage: function() {
        //列表初始配置
        var thead = ["金额", "金额产生原因", "产生时间"]; //表头
        var rows = ['amout', "reason", "create_time"]; //表列
        var opration = []; //操作的功能组
        this.table.setThead(thead);
        this.table.setRow(rows);
        this.table.setOpration(opration);
        this.table.setHasOpration(false);
        this.table.setHasCheckBox(false);

        this.selectType.setParam({
            title : "请选择查看类型",
            name : "type",
            options: [{
                    value: 1,
                    content: "账户明细"
                },
                {
                    value: 2,
                    content: "积分明细"
                },
                {
                    value: 3,
                    content: "次卡明细"
                },
                {
                    value: 4,
                    content: "优惠券明细"
                }
            ]
        })

    },
/**
 * 查询数据
 * @param  {string} url       [接口url]
 * @param  {object} param     [需要传入的参数]
 * @param  {boolean} firstTime [是否需要重新渲染分页]
 */
    queryTableData: function(url, param,firstTime,type) {
        var me = this;
        $.ajax({
            url: url,
            type: type || 'get',
            dataType: 'json',
            data: param,
            success: function(res) {
                if (res.code == 200) {
                    this.trigger('tableDataReady', res.data);
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
                    this.trigger('tableDataReady', temp);
                }
            }.bind(this),
            error: function() {
                console.log('页面出错');
            }.bind(this)
        })
    },

/**
 * 查询页面除表格以外数据
 * @param  {string} url       [接口url]
 * @param  {object} param     [需要传入的参数]
 * @param  {boolean} firstTime [是否需要重新渲染分页]
 */
    queryPageData: function(url, param,type) {
        var me = this;
        $.ajax({
            url: url,
            type: type || 'get',
            dataType: 'json',
            data: param,
            success: function(res) {
                if (res.code == 200) {
                    this.trigger('pageDataReady', res.data);
                   
                } else {
                    var temp = {};
                    this.trigger('pageDataReady', temp);
                }
            }.bind(this),
            error: function() {
                alert('页面出错');
            }.bind(this)
        })
    },

    pageChange : function(currentPage){
        this.tableParam.page = currentPage;
        this.queryTableData(this.url,this.tableParam,false);
    },

    onSelectChange : function(e){
        var type = $(e.target).val();
        this.tableParam.type = type;
        if(type != ""){
        this.queryTableData(this.url,this.tableParam,false);    
        }
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

    freshPage: function(data){
        this.$("#user").text(data.nickname);
        this.$("#money").text(data.balance);
        this.$("#score").text(data.integral);
    }

});