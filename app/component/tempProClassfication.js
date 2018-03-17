const htmlTpl = require("Templates/tempProClassfication.html");
const htmlSonTpl = require("Templates/tempSonProClassfication.html");

module.exports = Backbone.View.extend({
    tagName: "table",

    className: "table table-striped table-bordered table-hover table-condensed",

    template: _.template(htmlTpl),

    events : {
      "click a.isShow" : "onClickShow",
      "click a.isHide" : "onClickHide"
    },

    initialize: function() {
        this.targetArr = [];//需要获得的目标数组
    },

    render: function() {
        this.$el.append(this.template());
        return this;
    },
/**
 * 整理从后端获取的数据
 * @param  {[type]} param [传入的数据]
 * @return {[type]}       [description]
 */
    arrangeData : function(data){
        var me = this;
        _.each(data,function(e,index){
            me.parseObject(e,me); 
        });
        
    },

/**
 * 用于整理数据的递归函数，并赋值给this.targetArr
 * @param  {[type]} obj     [处理的对象]
 * @param  {[type]} context [description]
 * @return {[type]}         [description]
 */
    parseObject : function(obj,context){
        var me = context;
        me.targetArr.push(me.getObject(obj));
        if( !obj['son'] || obj['son'].length == 0 ){
            return ;
        }else{
            for(var i=0 ; i<obj['son'].length ; i++){
                me.parseObject(obj['son'][i],me);
            }
        }
    },

/**
 * [getObject description]
 * @param  {[type]} obj [description]
 * @return {[type]}     [description]
 */
    getObject : function(obj){
        var object = new Object();
        for(param in obj){
            if(param == "son") {
                object[param] = true;
                continue;
            }
            object[param] = obj[param] ;
        }
        return object
    },

    onClickShow : function(e){
        $(e.target).attr('class','isHide').text("收起");
        var uid = $(e.target).closest('tr').attr('uid');
        this.$('tr[pid='+uid+']').show();
    },
    onClickHide : function(e){
        $(e.target).attr('class','isShow').text("展开");
        var uid = $(e.target).closest('tr').attr('uid');
        this.hideTr(uid,this);
    },
    /**
     * 收起选项的递归函数，父元素收起则所有其子元素都收起
     * @param  {string} uid     [需要收起的元素id]
     * @param  {this} context [当前全局环境，锁定在当前对象中]
     * @return {[type]}         [description]
     */
    hideTr : function(uid,context){
        var me = context;
        var tempEl = me.$('tr[pid='+uid+']');
        
        if(tempEl.length != 0){
            tempEl.hide();
            tempEl.find("a.isHide").text("展开").attr('class','isShow');
            tempEl.each(function(index,el){
                let uuid = $(el).attr('uid');
                me.hideTr(uuid,me);
            })
        }else{
            tempEl.hide();
            return ;
        }
    },

    setData : function(param){
        this.$('tbody').empty();
        this.targetArr = [];
        this.arrangeData(param);
        var sonTemplate =  _.template(htmlSonTpl);
        this.$('tbody').append(sonTemplate({
            array : this.targetArr
        }
        ));
        this.$('tbody>tr[pid!="0"]').hide();
    }
});