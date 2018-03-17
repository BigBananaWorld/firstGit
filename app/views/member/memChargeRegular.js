const htmlTpl = require("Templates/viewsTemplate/mem_chargeRegular.html");
const compRegular = require("Component/tempChargeRegular.js");

module.exports = Backbone.View.extend({
    tagName: "div",

    className: "",

    template: _.template(htmlTpl),

    events: {
        'click #add': 'addRegular',
        'click #confirm': 'onClickComfirm'
    },

    initialize: function(loginKey) {
        this.data = []; //默认
        this.count = 0; //数组元素中的序号
        this.key = loginKey;//登陆秘钥

        this.$el.html(this.template({
            titles: ["会员管理","充值规则"],
            back : false
        }));

        this.regulars = []; //已有数据
        this.listenTo(this, "dataReady", this.initPage);

        this.url = 'https://www.kziche.com/admin/Member/RechargeRule';
        //查询参数当前对象内共用，保证条件的一致
        this.param = {
            key: this.key
        }
        this.queryData(this.url, this.param);

    },

    render: function() {
        // var me = this;
        // _.each(me.regulars, function(val, index) {
        //     me.$('.opedit').append(val.e.render().el);
        // })

        return this;
    },

    /**
     * 初始化页面
     * @return {[type]} [description]
     */
    initPage: function(data) {
        var me = this;
        for (let i = 0; i < data.length; i++) {
            this.count++;
            let regular = new compRegular();
            this.listenTo(regular, "delete", this.removeRegular);
            regular.setParam({
                charge: data[i].recharge_money,
                give: data[i].gift_amount,
                isNew: false,
                num: this.count,
                elid: data[i].id
            });
            // me.$('.opedit').append(regular.render().el)
            this.regulars.push({
                num: this.count,
                e: regular
            });

        }
        _.each(me.regulars, function(val, index) {
            me.$('.opedit').append(val.e.render().el);
        })
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
                    var temp = [];
                    this.trigger('dataReady', temp);
                }
            }.bind(this),
            error: function() {
                console.log('页面出错');
            }.bind(this)
        })
    },

    addRegular: function(e) {
        this.count++;
        var charge = this.$('input[name="newCharge"]').val();
        var gift = this.$('input[name="newGift"]').val();
        var regular = new compRegular({
            isNew: true,
            charge: charge,
            give: gift,
            num: this.count,
            elid: 0
        });
        this.listenTo(regular, "delete", this.removeRegular);
        this.regulars.push({
            e: regular,
            num: this.count
        });
        this.$('.opedit').prepend(regular.render().el);
    },

    removeRegular: function(num) {
        var me = this;
        for (let i = 0; i < this.regulars.length; i++) {
            if (this.regulars[i].num == parseInt(num)) {
                if (this.regulars[i].e.elid != 0) {
                    $.ajax({
                        url: "https://www.kziche.com/admin/Member/delRule",
                        type: 'get',
                        dataType: 'json',
                        data: {
                            key: this.key,
                            id: me.regulars[i].e.elid
                        },
                        success: function(res) {
                            if (res.code == 200) {
                                alert(res.msg);
                                this.trigger('confirmSuccess', res.data);
                            } else {
                                alert(res.msg);
                            }
                        }.bind(this),
                        error: function() {
                            console.log('页面出错');
                        }.bind(this)
                    })
                }
                this.regulars.splice(i, 1);
            }
        }
    },

    onClickComfirm: function() {
        var me = this;
        var newRegulars = [];
        for (let i = 0; i < this.regulars.length; i++) {
            if (this.regulars[i].e.elid == 0) {
                var temp = this.regulars[i].e.getValue();
                temp.id = 0;
                newRegulars.push(temp);
            }
        }

        $.ajax({
            url: 'https://www.kziche.com/admin/Member/addRechargeRule',
            type: 'post',
            dataType: 'json',
            data: {
                key: me.key,
                obj: newRegulars
            },
            success: function(res) {
                
                if (res.code == 200) {
                    alert("添加记录成功");
                    this.trigger('confirmSuccess', res.data);
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
    }

});