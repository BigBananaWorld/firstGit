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
                position: 'top',
                fontSize: 14,
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
        barGap: '10%',
        barMaxWidth : 105,
        data: []
    },{
        name: '',
        type: 'bar',
        barMaxWidth : 105,
        barGap: '10%',
        data: []
    },
    {
        name: '',
        type: 'bar',
        barMaxWidth : 105,
        barGap: '10%',
        data: []
    }]
}