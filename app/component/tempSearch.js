const htmlTpl = require("Templates/tempSearch.html");
const compText = require("Component/forsearch/text.js");
const compSelect = require("Component/forsearch/select.js");
const compDate = require("Component/forsearch/tempdaterange.js");

/**
 * [搜索组件]
 */
module.exports = Backbone.View.extend({
    tagName: "div",

    className: "search",

    template: _.template(htmlTpl),
    
    events : {
        'click .searchBtn' : 'onClickSearch'
    },

    initialize: function(param) {
        var showAdd = param.showAdd || false;
        var addHref = param.addLink || null;
        var showSearch = param.showSearch || false;
        var addTitle = param.addTitle || "添加记录";

        this.linesNum = param.linesNum || 1;
        this.searchBodys = [];//用于存放搜索项控件
        this.$el.append(this.template({
            showAdd : showAdd,
            addHref : addHref,
            addTitle : addTitle,
            linesNum : this.linesNum,
            showSearch : showSearch
        }));
    },

    render: function() {
        var me = this;
        for(let i=0 ; i < this.linesNum ; i++){
            _.each(me.searchBodys,function(searchBody,index){
                if(i == searchBody.line){
                    me.$('.item' + i).append(searchBody.element.render().el);    
                }
        })    
        }
        
        return this;
    },
/**
 * 设想是为搜索主体添加搜索项，每个搜索项是单独小控件
 */
    setParam : function(paramArray){
       this.parseSearchBodylist(paramArray);
    },
/**
 * 整理搜索栏的条件对象数组
 * @return {[Array[object]]} [搜索栏的对象数组,对象是各个搜索条件的配置参数,排序为数组的排序]
 */
    parseSearchBodylist : function(paramArray){
        var me = this;
        if(_.isArray(paramArray)){
            _.each(paramArray,function(val,index){
                var searchEl = me.chooseSearchTerm(val.type);
                me.searchBodys.push({element : new searchEl(val.param) , line : val.line});
            });
        }
    },
/**
 * 通过传入参数的type返回相应的搜索子控件
 * @param  {Strng} type [description]
 * @return {Backbone.View}      子控件对象
 */
    chooseSearchTerm : function(type){
        if(type == 'select'){
            return compSelect;
        }
        if(type == 'text'){
            return compText;
        }
        if(type == 'daterange'){
            return compDate;
        }
    },
/**
 * 获取搜索主体的条件 -- 日期范围的控件需要单独拿出来调用
 * @return {[type]} [description]
 */
    getSearchValue : function(){
        var me = this;
        var result = {};
        _.each(me.searchBodys,(element,index)=>{
            if(element.element.getName){
                result[element.element.getName()] = element.element.getValue();    
            }
        })
        return result;
    },
/**
 * 通过组件name返回该组件对象 ---主要针对时间范围选取的组件
 * @param  {[type]} name [description]
 * @return {[type]}      [description]
 */
    getElByName : function(name){
        var me = this;
        var target = null;
        _.each(me.searchBodys,function(el,index){
            if(el.element.getName() == name){
                target = el.element; 
            }
        })
        return target;
    },
/**
 * 点击搜索键后的回调函数
 */
    onClickSearch : function(e){
        var searchObj = JSON.stringify(this.getSearchValue());
        this.trigger('goSearch',searchObj)
    }
});