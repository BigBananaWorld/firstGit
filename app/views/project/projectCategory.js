const htmlTpl = require("Templates/viewsTemplate/example2.html");
const compTable = require("Component/tempProClassfication.js");
const compPage = require("Component/tempPage.js");
const compSearch = require("Component/tempSearch.js");

module.exports = Backbone.View.extend({
    tagName: "div",

    className: "",

    template: _.template(htmlTpl),

    initialize: function(loginKey) {
        this.$el.html(this.template({
            titles: ["服务管理","服务项目分类"],
            back : false
        }));
        this.table = new compTable();
        this.pagement = new compPage();
        this.search = new compSearch({
            showAdd : true,
            addLink : "#views/project/form/categoryEdit",
            showSearch : false,
            linesNum : 0
        });
        this.key = loginKey;

        this.listenTo(this.pagement, "pageChange", this.pageChange);
        this.listenTo(this, "dataReady", this.freshTable);
        this.initParamOfPage();

        this.url = 'https://www.kziche.com/admin/Member/serviceItemsCategory';
        this.tableParam = {
            key: this.key
        }
        this.queryData(this.url, this.tableParam);
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

    },
    /**
     * 查询数据
     * @param  {string} url       [接口url]
     * @param  {object} param     [需要传入的参数]
     * @param  {boolean} firstTime [是否需要重新渲染分页]
     */
    queryData: function(url, param, type) {
        $.ajax({
            url: url,
            type: type || 'get',
            dataType: 'json',
            data: param,
            success: function(res) {
                if (res.code == 200) {
                    this.trigger('dataReady', res.data);
                } else {
                    this.trigger("dataFail");
                }
            }.bind(this),
            error: function() {
                console.log('页面出错');
            }.bind(this)
        })
    },

    pageChange: function(currentPage) {
        this.tableParam.page = currentPage;
        this.queryData(this.url, this.tableParam);
    },

    goSearch: function(param) {
      
    },

    removeEl: function() {
        this.remove();
    },

    freshTable: function(data) {
        this.table.setData(data);
        var me = this;
        this.$('a[name="del"]').click(function(el) {
            var sure = confirm("是否删除该分类?");
            if(!sure){
                return ;
            }
            var cateid = $(el.target).attr("elid");
            var param = {
                key: me.key,
                cate_id: cateid
            }
            $.ajax({
                url: 'https://www.kziche.com/admin/Member/delItemsCate',
                type: 'get',
                dataType: 'json',
                data: param,
                success: function(res) {
                    if (res.code == 200) {
                        alert(res.msg);
                        me.queryData(me.url, me.tableParam);
                    } else {
                        alert(res.msg);
                    }
                }.bind(this),
                error: function() {
                    alert('页面出错');
                }.bind(this)
            })
        });
    }

});