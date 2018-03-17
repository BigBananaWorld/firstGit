module.exports = {
    title: {
        show : true,
        text: '',
        textStyle: {
            fontFamily: 'Microsoft YaHei',
            fontSize : 24
        }
    },
    legend: {
        data: []
    },
    xAxis: {
        axisLabel: {
            rotate: 35
        },
        data: []
    },
    yAxis: [
        {
            type: 'value'
        },
        {
            type: 'value',
            splitLine : {
                show : false
            }
        }
    ],
    series: [{
        name: '',
        type: 'bar',
        label: {
            normal: {
                show: true,
                position: 'top'
            }
        },
        data: []
    },{
        name: '',
        type: 'bar',
        yAxisIndex: 1,
        label: {
            normal: {
                show: true,
                position: 'top'
            }
        },
        data: []
    }]
}