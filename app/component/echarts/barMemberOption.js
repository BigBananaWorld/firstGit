module.exports = {
    title: {
        left : '10%',
        show : true,
        text: '',
        textStyle: {
            fontFamily: 'Microsoft YaHei',
            fontSize : 24
        }
    },
    tooltip : {
        trigger: 'axis',
        axisPointer : {            // 坐标轴指示器，坐标轴触发有效
            type : 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
        }
    },
    legend: {
        align: 'right',
        right: '10%',
        data: []
    },
    xAxis: {
        axisLabel: {
            rotate: 35
        },
        data: []
    },
    yAxis: {},
    label: {
            normal: {
                show: true,
                position: 'insideTop',
                align: 'center',
                fontSize:14,
                formatter: function(params) {
                    if (params.value > 0) {
                        return params.value;
                    } else {
                    return '';
                    }
                }
            }
        },
    series: [{
        name: '',
        type: 'bar',
         stack : 'one',
        data: []
    },{
        name: '',
        type: 'bar',
        stack : 'one',
        data: []
    },
    {
        name: '',
        type: 'bar',
        stack : 'one',
        data: []
    },
    {
        name: '',
        type: 'bar',
        stack : 'one',
        data: []
    }]
}