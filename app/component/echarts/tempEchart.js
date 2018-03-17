const htmlTpl = require("Templates/echarts/tempEchart.html");
const echarts = require("JSfile/echarts.common.min.js");

module.exports = Backbone.View.extend({
    tagName: "div",

    className: "tempEc",

    template: _.template(htmlTpl),

    initialize: function() {
        this.option = null;
        this.listenTo(this, "renderFinish", this.renderEchart);
        this.listenTo(this, "dataReady", this.fillEchart);
    },

    render: function() {
        this.$el.append(this.template({
            id: this.ecid
        }));
        return this;
    },

    setParam: function(param) {
        this.ecid = param.id;
        this.url = param.url;
        this.dataParam = param.dataParam;
        this.title = param.title;
        this.legend = param.legend;
        this.xaxis = param.xaxis;
        this.ecSeries = param.ecSeries;
    },
    /**
     * 设置echarts图表option
     * @param {Object} option [echarts的option]
     */
    setEchartOption: function(option) {
        this.option = option;
    },

    renderEchart: function() {
        this.ec = echarts.init(document.getElementById(this.ecid));
        if (this.option) {
            this.option.title.text = this.title;
            this.option.legend.data = this.legend;
        }
        this.ec.setOption(this.option);

        this.queryData();
    },

    queryData: function() {
        var me = this;
        $.ajax({
            url: me.url,
            type: 'get',
            dataType: 'json',
            data: me.dataParam,
            success: function(res) {
                if (res.code == 200) {
                    this.trigger('dataReady', res);
                } else {
                    alert(res.msg);
                }
            }.bind(this),
            error: function() {
                console.log('页面出错');
            }.bind(this)
        })
    },

    fillEchart: function(data) {
        var xaxis = this.xaxis;
        var serie = [];

        _.each(this.ecSeries, function(el, index) {
            var tempSerie = {};
            tempSerie.name = el.name;
            tempSerie.data = data[el.dataName];
            serie.push(tempSerie);
        });

        this.ec.setOption({
            xAxis: {
                data: data[xaxis]
            },
            series: serie
        });

        serie = null;
    },

    resizeEchart: function(width) {
        this.ec.resize({
            width: width,
            height: 'auto'
        })
    },

    freshEchart : function(param){
        this.dataParam = param;
        this.queryData();
    },

    removeEl: function() {
        this.ec.dispose();
    }

});