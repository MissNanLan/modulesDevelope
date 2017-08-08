/**
 * Created by AA on 2017/7/31.
 */
;(function(){
       var Tab = function(tab){
            var _this_ = this; //这句话有点不太明白
           //保存单个tab组件
           this.tab  = tab;
           //默认配置参数
           this.config = {
               "triggerType":"click", //触发类型
               "effect":"default", //切换效果
               "invoke":2, //指定默认显示的选项
               "auto":false //自动播放的间隔时间，可设为false
           };
         // console.log(this.config);
          //如果配置参数存在，就扩展掉默认的配置参数
           if(this.getConfig()){
               $.extend(this.config,this.getConfig()); //这句话的意思我是这样明白的，人工配置参数替代默认配置参数；如果人工配置参数没有的话，则合并，如果有相同的，人工配置参数替换默认配置参数
           };
               // console.log(this.config);
           //保存tab标签列表，对应的内容列表
           this.tabItems = this.tab.find("ul.tab-nav li");
           this.contentItems = this.tab.find("div.content-wrap div.content-item");
           //保存配置参数
           var config = this.config;
           if(config.triggerType === "click"){
               this.tabItems.bind(config.triggerType,function(){
                  _this_.invoke($(this)); //这里的$(this)指的是当前的tabItem
               })
           }else if(config.triggerType === "mouseover" || config.triggerType != "click"){
               this.tabItems.mouseover(config.triggerType,function(){
                 //_this_.invoke($(this));
                   var self = $(this);
                   this.timer = window.setTimeout(function(){
                       _this_.invoke(self);
                   },300);
               }).mouseout(function(){
                   window.clearTimeout(this.timer);
               });
           }
           //自动切换功能，当配置了时间，我们就根据事件间隔就自动切换,出现问题！！！
           if(config.auto){
               //定义一个全局的定时器
               this.timer = null;
               //计数器
               this.loop = 0;
               this.autoPlay();
               this.tab.hover(function(){
                   window.clearInterval(_this_.timer);
               },function(){
                   _this_.autoPlay();
               })
           }
           //设置默认显示第几个tabitem
           if(config.invoke>1){
               this.invoke(this.tabItems.eq(config.invoke-1))
           }
        };
    Tab.prototype = {
        //自动间隔时间切换
        autoPlay:function(){
            var _this_   =  this,
                tabItems  = this.tabItems,//临时保存tabItems列表
                tabLength = this.tabItems.length; //跟length有什么区别，临时保存tabItems的个数
                config = this.config;
            this.timer = window.setInterval(function(){
                _this_.loop++;
                if(_this_.loop >= tabLength){
                    _this_.loop = 0;
                }
               // tabItems.eq(_this_.loop).trigger(config.triggerType);
                _this_.invoke(tabItems.eq(_this_.loop));
            },config.auto);
        },
        //事件驱动函数
        invoke:function(currentTab){
            var _this_ = this;
            /*
            执行Tab的选中状态，当前的tabitem加上active，其他的移除
            切换对应的content-item，要根据配置参数的effect是default还是fade来切换
             */
            var index = currentTab.index();
            //tab选中状态
            currentTab.addClass("active").siblings().removeClass("active");
            //内容区域的切换
            var effect = this.config.effect;
            var conItems = this.contentItems;
             if(effect === "default" || effect != "fade"){
                 conItems.eq(index).addClass("current").siblings().removeClass("current");
             }else if(effect == "fade"){
                 conItems.eq(index).fadeIn().siblings().fadeOut();
             };
            //注意，如果配置了自动切换，记得把当前的loop设置成当前的tab的index
            if(this.config.auto){
                this.loop = index;
            }
        },
        //获取人工配置参数
        getConfig:function(){
            //拿下tab elem节点上的data-config
            var  config = this.tab.attr("data-config");
            //确保有人工配置参数
        if(config&&config!=""){
                return $.parseJSON(config);
            }else{
                return null;
            }
        }
     };
    //为了解决主页面中new多个实例
    Tab.init = function(tabs){
        var _this_ = this;
        tabs.each(function(){
            new _this_($(this));
        })
    };
    //注册成jq方法
    $.fn.extend({
        tab:function(){
            this.each(function(){
                new Tab($(this));
            });
        }
    });

    window.Tab = Tab;

})(jQuery);
//匿名函数自我执行