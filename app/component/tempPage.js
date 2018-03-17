const htmlTpl = require("Templates/tempPage.html");

/**
 * 分页组件
 */
module.exports = Backbone.View.extend({
        tagName : 'div',

        className : 'pagement text-right',

        events : {
            "click a[class!='move']" : "clickPage",
            "click a[name='left']" : "clickPageUp",
            "click a[name='right']" : "clickPageDown",
            "keypress .pageskip" : "goPage"
        },

        template : _.template(htmlTpl),

        initialize : function(param){
            var param = param || {};
            this.setParam(param);
        },

        render : function(){
            this.$el.append(this.template({
                totalPage : this.totalPage,
                currentPage : this.currentPage,
                pageRange : this.pageRange,
                show : this.show,
                total : this.total
            }));
            return this;
        },

        setParam : function(param){
           this.pageRange = param.pageRange || 10;
           this.pageSize = param.pageSize || 15;
           this.totalPage = param.totalPage || 20;
           this.currentPage = param.currentPage || 1;
           this.show = param.show || true;
           this.total = param.total || 0;
        },

        clickPage : function(e){
            e.stopPropagation();
            var $current = $(e.target);
            var pageNum = parseInt($current.text());
            if(pageNum != this.currentPage){
                this.setCurrentPage(pageNum);
                this.triggerChange();
            }
        },

        clickPageUp : function(e){
            e.stopPropagation();
            if($(e.target).closest('li').hasClass('disabled')){
                return ;
            }
            var now = parseInt(this.currentPage)-1;
            if(now != this.currentPage){
                this.setCurrentPage(now);
                this.triggerChange();    
            }
        },

        clickPageDown : function(e){
            e.stopPropagation();
            if($(e.target).closest('li').hasClass('disabled')){
                return ;
            }
            var now =parseInt(this.currentPage)+1;
            if(now != this.currentPage){
                this.setCurrentPage(now);
                this.triggerChange();    
            }
        },

        goPage : function(e){
            if(e.keyCode == 13){
                var val = parseInt($(e.target).val());
                if(val != this.currentPage && val <= this.totalPage && val >0){
                    this.setCurrentPage(val);
                    this.triggerChange();  
                }
            }
        },

        setCurrentPage : function(currentPage){
            this.currentPage = currentPage;
            this.$el.empty();
            this.render();
        },

        getCurrentPage : function(){
            return this.currentPage;
        },

        getAllPages : function(){
            // console.log(this.totalPage);
        },

        getPageSize : function(){
            return this.pageSize;
        },

        clearPage : function(){
            this.$el.empty();
        },
/**
 * 出发pageChange事件，并且传入当前页的页码
 * @return {[type]} [description]
 */
        triggerChange : function(){
            this.trigger("pageChange",this.currentPage); 
        }
});