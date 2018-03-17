const tpl = require("Templates/tempTable.html")

module.exports = Backbone.View.extend({
    tagName: "div",

    className: "table-responsive",

    template: _.template(tpl),

    events : {
        "click tbody>tr>td" : "onClickTd",
        "click input[name='checkall']" : "onCheckAll"
    },

    initialize: function() {
        this.datas = [];
        this.theads = [];
        this.rows = [];
        this.opration = [];
        this.checkId = null;

        this.hasCheckBox = true;//是否有序号列
        this.hasOpration = false;//是否有操作列
    },

    render: function() {
        this.$el.append(this.template({
            theads: this.thead,
            datas: this.datas,
            rows: this.rows,
            hasCheckBox : this.hasCheckBox,
            checkId : this.checkId,
            hasOpration : this.hasOpration,
            opration : this.opration
        }));
         
        return this;
    },

/**
 * 按照目前的需求，配置一个表格需要6个配置(列名配置、表列配置、点选列配置、操作列配置、展示数据配置、是否开启操作列)
 * @param {Object} param [参数包含(暂时为):传入数组，表列名，需要显示的属性]
*/
    setData : function(data){
            this.datas = data || [];
            this.refresh();
    },

    setThead: function(thead) {
        var theads = [];
        if (_.isArray(thead)) {
            this.thead = thead;
        } else {
            return false;
        }
    },

    setCheckId : function(id){
        this.checkId = id;
    },

    setHasCheckBox : function(show){
        if((typeof show) != 'undefined'){
            this.hasCheckBox = show;
        } 
    },

    setHasOpration : function(show){
        if((typeof show) != 'undefined'){
            this.hasOpration = show;
        } 
    },

    setOpration : function(param){
        this.opration = param;
    },

    setRow: function(rows) {
        if(rows){
            this.rows = this.parseRow(rows);    
        }else{
            return ;
        }   
    },

/**
  * 整理表格每列数字的配置
  * @param  {Array} rowParams [表格每列的配置数组，元素为为配置类对象]
  * @return {array[object]}        [返回的是每个列的配置对象]
*/
    parseRow: function(rowParams) {
        var result = [];
        _.each(rowParams, function(val, index) {
            if ((typeof val) == "object") {
                result.push({
                    name: val.name || null,//传入data的对应参数名
                    isSkip: val.isSkip || false,//是否可跳转至其他页面
                    code: val.code || "id",
                    link: val.link || null//跳转页面的链接
                })
            }
            if ((typeof val) == "string") {
                result.push({
                    name: val || null,
                })
            }
        })

        return result;
    },

/**
 * 点击表列的td元素，回调函数**************
 * @param  {[type]} e [description]
 */
    onClickTd : function(e){
        e.stopPropagation();
        if((e.target).nodeName != "TD"){
            this.isCheckAll();
            return ;
        }
        var $checkBox = $(e.target).closest('tr').find('input[type="checkbox"]');
        $checkBox.prop("checked")?$checkBox.prop("checked",false):$checkBox.prop("checked",true);
        this.isCheckAll();
    },
/**
 * 全选点击的回调函数
 * @param  {[type]} e [回传的事件]
 */
    onCheckAll : function(e){
       e.stopPropagation();
       let $e = $(e.target);
       let $checkBoxs = $e.closest('thead').next().find('input[type="checkbox"]');
       !($e.prop("checked"))?$checkBoxs.prop("checked",false):$checkBoxs.prop("checked",true);
    },

/**
 * 是否为全选状态
 */
    isCheckAll : function(){
        var checkedBoxSize = this.$el.find('tbody input[type="checkbox"]:checked').size();
        var allBoxSize = this.$el.find('tbody input[type="checkbox"]').size();
        var $checkallBox = this.$el.find('input[name="checkall"]');
        allBoxSize > checkedBoxSize?$checkallBox.prop("checked",false):$checkallBox.prop("checked",true);
    },
/**
 * 刷新表格,先清空再渲染
 */
    refresh: function() {
        this.$el.empty();
        this.render();
    },

    removeEl : function(){
        this.remove();
    }

});