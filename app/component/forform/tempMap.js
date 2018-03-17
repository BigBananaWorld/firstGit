const htmlTpl = require("Templates/formTemplate/tempMap.html");

module.exports = Backbone.View.extend({
    tagName: "div",

    className: "formElement",

    template: _.template(htmlTpl),

    events : {
        "click #clear" : "clearMark",
        "click #changeSize" : "changeSize"
    },

    initialize: function(param,lng,lat) {
        var param = param || {};
        this.lng = 0;
        this.lat = 0;

        this.setParam(param);
        this.listenTo(this,"mapReady",this.initMapParam)
        this.listenTo(this,"renderFinish",this.initMap);
        this.listenTo(this,"locateMarker",this.locateMaker);
        // this.initMap();
        this.marker = null;
    },

    render: function() {
          this.$el.append(this.template({
            "title" : this.title,
            "name" : this.name,
            "msg" : this.msg
        }));
        return this;
    },

    setParam : function(param){
        this.title = param.title || "地图坐标选取";//标题
        this.name = param.name || "";//该输入框绑定的传出参数名
        this.msg = param.msg || "";//输入框注意事项
    },
/**
 * 初始化map
 * @return {[type]} [description]
 */
    initMap : function(){
        var me = this;
        // setTimeout(()=>{
         me.map = new AMap.Map('map',{
            resizeEnable: true,
            zoom: 10,
            center: [116.480983, 40.0958]
        });
         me.trigger("mapReady");
     // },300);
    },
/**
 * MAP初始化成功后绑定点击事件
 * @return {[type]} [description]
 */
    initMapParam : function(){
        var me = this;
       
        me.map.on('click', function(e) {
            var lng = e.lnglat.getLng();
            var lat = e.lnglat.getLat();
            me.addMarker(lng,lat)
        });

        //输入提示
        var autoOptions = {
            input: "locate"
        };
        this.auto = new AMap.Autocomplete(autoOptions);
        this.placeSearch = new AMap.PlaceSearch({
            map: me.map
        });  //构造地点查询类

        AMap.event.addListener(this.auto, "select", function(e){
            me.placeSearch.setCity(e.poi.adcode);
            me.placeSearch.search(e.poi.name);  //关键字查询查询
        } );//注册监听，当选中某条记录时会触发
    },
    
    addMarker : function(lng,lat){
        if(this.marker != null){
            this.marker.setMap(null);
            this.marker = null;
        }
        this.marker = new AMap.Marker({
            map : this.map,
            icon: "http://webapi.amap.com/theme/v1.3/markers/n/mark_b.png",
            position: [lng, lat]
        });
        this.map.setCenter([lng,lat]);
        var location = "经度:"+lng +",纬度:"+lat;
        this.$("#location").text(location);
    },

    locateMaker : function(){
        if(this.lat != 0 && this.lng!=0){
            this.addMarker(this.lng,this.lat);
            this.map.setCenter([this.lng,this.lat]);
        }
    },

    getPosition : function(){
        if(this.marker){
            var temp = this.marker.getPosition();
           return {
            lng : temp.getLng(),
            lat : temp.getLat()
           };
        }
        return {};
    },

    setPosition : function(lng,lat){
       var tempLng = parseFloat(lng);
       var tempLat = parseFloat(lat);
       this.lng = tempLng;
       this.lat = tempLat;
       this.trigger("locateMarker");
    },

    getName : function(){
        return this.name;
    },

    clearMark : function(){
         if(this.marker != null){
            this.marker.setMap(null);
            this.marker = null;
        }
         this.$("#location").text("");
    },

    changeSize : function(){
        var elMap = this.$("#map");
        var changeBtn = this.$("#changeSize");
        if(elMap.hasClass("large")){
            elMap.css("width","350px").css("height","300px").removeClass("large");
            changeBtn.text("展开地图");
        }else{
            elMap.css("width","600px").css("height","500px").addClass("large");
            changeBtn.text("缩小地图");
        }
       
    },

    locateMap : function(e){
        this.placeSearch.setCity(e.poi.adcode);
        this.placeSearch.search(e.poi.name);  //关键字查询查询
    },

    onTest : function(){
       this.setPosition(112.9252020,28.1980240);
    }

});