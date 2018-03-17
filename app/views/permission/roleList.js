const htmlTpl = require("Templates/viewsTemplate/example2.html");
const compTable = require("Component/tempTable.js");
const compSearch = require("Component/tempSearch.js");
const compBatch = require("Component/tempBatch.js");

module.exports = Backbone.View.extend({
    tagName: "div",

    className: "",

    template: _.template(htmlTpl),

    initialize: function(loginKey) {
        this.key = loginKey;
        this.$el.html(this.template({
            titles: ["权限管理","角色列表"],
            back : false
        }));
        this.table = new compTable();
        this.search = new compSearch({
            showAdd : true,
            addLink : "#views/permission/form/roleEdit",
            showSearch : false,
            linesNum : 0
        });
        this.batch = new compBatch();

        this.listenTo(this, "dataReady", this.freshTable);
        this.listenTo(this.batch,"goBatch",this.goBatch);
        this.initParamOfPage();

        this.url = 'https://www.kziche.com/admin/Order/roleList';
        this.tableParam = {
            key : this.key
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
        var thead = ["角色ID", "角色"]; //表头
        var rows = ["id","name" ]; //表列
        var opration = [ { name: '编辑', elID: 'id', elName: "bj", link:"views/permission/form/roleEdit"}, 
        { name: '删除', elID: 'id', elName: "del" }]; //操作的功能组
        this.table.setThead(thead);
        this.table.setRow(rows);
        this.table.setOpration(opration);
        this.table.setHasOpration(true);
        this.table.setHasCheckBox(true);
        this.table.setCheckId("id");

        var batchOptions = [
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
       if(type == "3"){
            url ="https://www.kziche.com/admin/Order/delrole";
            param = {
                key : this.key,
                role_ids : idsString
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
          var me =this;
        /*
        绑定操作点击事件
         */
        this.$('a[name="del"]').click(function(el){
            var ids = $(el.target).attr("elid");
            var text = $(el.target).text();
            var url ="https://www.kziche.com/admin/Order/delrole";
            var param = {
                key : me.key,
                role_ids : ids
            };
            var sure = window.confirm("确定执行 "+text+" 操作?");
            if(sure){
                me.batchAjax(url,param);    
            }
            
        })
    }

});