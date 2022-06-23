// pages/need/need.js
const util = require('../../utils/util');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    ind:0,
    timer:null,
    ok:false,
    p:true,
    coc:false,
    timestr:'',
    tt:0,
    htime:0,
    mtime:0,
    stime:0,
    windowHeight:0,
    show:false,
    arr: ["日", "一", "二", "三", "四", "五", "六"],
    date: [],
    day: 0,
    list: [],
    dateIndex: 0,
    rate:0
  },

  drawBg:function(){
    var linewidth=6/this.data.rate;
    var ctx=wx.createCanvasContext('progress_bg');
    ctx.setLineWidth(linewidth);
    ctx.setStrokeStyle('#000000');
    ctx.setLineCap('round');
    ctx.beginPath();
    ctx.arc(400/this.data.rate/2,400/this.data.rate/2,400/this.data.rate/2-2*linewidth,0,2*Math.PI,false);
    ctx.stroke();
    ctx.draw();
  },
  drawactive:function(){
    var ut=this.data.tt;//ut为时间差值的最初值，ut在画动态圆的过程中不改变
    var _this=this;
    var timer = setInterval(function(){//定义计时器，时间间隔为100毫秒
    //angle初始位置为1.5 PI，最大转动2PI（一圈），而最初时间差与当前时间差的差值占最初时间差的比值即为元转动的角度与2*PI的比值
      var angle=1.5+2*(ut-_this.data.tt)/ut;
 var linewidth=6/_this.data.rate;
 var ct=_this.data.tt-100;//ct为当前时间差值，计时器间隔为100毫秒，相应的当前时间差值也减小100毫秒
 _this.setData({
   tt:ct
 });
 if(angle<3.5){//圆未走完时，显示当前时间差值，方法与start函数类似
   if((ut-ct)%1000==0){//时间差值的变化是以100毫秒为基本单位，而显示时间的变化是以1秒为时间单位，这里判断是否要改变显示时间
     var kt=parseInt(ct/1000);
     var st=kt%60;
     var mt=kt>60?parseInt(kt/60):0;
     var ht=kt>3600?parseInt(kt/3600):0;
     var str=st>=10?st:'0'+st;
     var mtr=mt>=10?mt:'0'+mt;
     var htr=ht>=10?ht:'0'+ht;
     _this.setData({
       timestr:htr+':'+mtr+':'+str
     })
     
   }console.log(_this.data.timestr,ut)
   //画动态圆函数，方法与画静态圆相似，圆的末端值改为动态值“angle”
    var ctx=wx.createCanvasContext('progress_active');
    ctx.setLineWidth(linewidth);
    ctx.setStrokeStyle('#ffffff');
    ctx.setLineCap('round');
    ctx.beginPath();
    ctx.arc(400/_this.data.rate/2,400/_this.data.rate/2,400/_this.data.rate/2-2*linewidth,1.5*Math.PI,angle*Math.PI,false);
    ctx.stroke();
    ctx.draw();
    }
    //如果圆走完了则显示的时间定为“00:00:00”不变，显示“完成”按钮，并停止计时器
  else{
    _this.setData({
    timestr:'00:00:00',
    ok:true,
    p:false,
    coc:false
    })
  clearInterval(timer);
  };
  }
    ,100);
    _this.setData({
      timer:timer
    })
  },  
  pause:function(){
clearInterval(this.data.timer);
this.setData({
  p:false,
  coc:true,
  ok:false
})
  },
  continue:function(){
    this.drawactive();
    this.setData({
      p:true,
      coc:false,
      ok:false
    })
  },
  cancle:function(){
    this.stop();
    this.setData({
      p:true,
      coc:false,
      ok:false,
      show:false
    })
    
  },
  ok:function(){ 
    this.stop();
    this.setData({
      p:true,
      coc:false,
      ok:false,
      show:false
    })
   
  },
  start(e){
    var index=e.currentTarget.dataset.index; //获取点击的事件在“list”里的位置“index”
    var list=this.data.list;
    list[index]["start"]=new Date().getTime();//获取当前时间
    list[index]["status"]=1; 
    var l1=list[index]["date"]+" "+list[index]["time"]+":00";//将用户设定时间的年月日（data）时分（time）结合以便取时间戳（秒默认为00）
    console.log(l1)
    console.log(list[index]["start"])
    console.log(list[index]["time"])
    var tt=Date.parse(l1)-list[index]["start"];//取设定时间与当前时间时间戳的差值
    var ttt=parseInt(tt/1000);//毫秒单位转秒
    console.log(ttt)
    this.setData({
      ind:index,
      tt:tt,
      htime:ttt>3600?parseInt(ttt/3600):0,
      mtime:ttt>60?parseInt(ttt/60):0,
      stime:ttt%60,
      list:list,
      show:true
    }) 
      var s=this.data.stime>=10?this.data.stime:'0'+this.data.stime;//时、分、秒皆需要先判断是否有两位数再显示
    var m=this.data.mtime>=10?this.data.mtime:'0'+this.data.mtime;
    var h=this.data.htime>=10?this.data.htime:'0'+this.data.htime;
    this.setData({
      timestr:h+':'+m+':'+s
    })
    console.log("tt",this.data.tt,"ht",this.data.htime,"mt",this.data.mtime,"st",this.data.stime)
    wx.setStorageSync('list', list)
this.drawBg();//画黑色的静态圆
this.drawactive();//画白色的动态圆
  },
  stop(e){
    var index=this.data.ind;//获取当前事项在“list”中的位置“index”
    var list=this.data.list;
    list[index]["stop"]=new Date().getTime();
    var leave2=(list[index]["stop"]-list[index]["start"])
    var minutes = Math.floor(leave2 / (60 * 1000));
    list[index]["len"]=minutes;
    list[index]["stop"]=util.formatTime1(new Date());//将停止倒计时的时间加入事件对应的list中
    list[index]["status"]=2;
    console.log(leave2);
    console.log(e);
    console.log(minutes);
    console.log(list);
    this.setData({
      list:list
    })
    wx.setStorageSync('list', list)

  },
  getday2() {
    let days = [];
    var date = new Date();
    for (let i = 0; i <= 24 * 6; i += 24) {
      let dateItem = new Date(date.getTime() + i * 60 * 60 * 1000);
      let y = dateItem.getFullYear();
      let m = dateItem.getMonth() + 1;
      let d = dateItem.getDate();
      m = this.addDate0(m);
      d = this.addDate0(d);
      let valueItem = d;
      days.push(valueItem);
    }
    this.setData({
      date: days
    })
    return days;
  },
  get_day_in_week_by_time(isChinese = true) {
    let d = new Date(new Date().getTime() * 1000).getDay();
    this.setData({
      day: d
    })
  },
  addDate0(time) {
    if (time.toString().length == 1) {
      time = '0' + time.toString();
    }
    return time;
  },
  toAdd(){
    wx.navigateTo({
      url: '../addNeed/addNeed',
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
var res=wx.getSystemInfoSync();
var rate=750/res.windowWidth;
this.setData({
  rate:rate,
  clockHeight:rate*res.windowHeight
})
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    this.getday2()
    this.get_day_in_week_by_time()
    this.getList(this.data.date[0]);
  },
  getList(date) {
    var list = wx.getStorageSync('list')
    console.log(list);
    var newList = [];
    for (var item in list) {
      if (util.formatTime(new Date(list[item].date)) == date) {
        if(!list[item]["status"]){
          list[item]["len"] = 0;
          list[item]["status"]=0;
        }
        newList.push(list[item]);
      }
    }
    this.setData({
      list: newList
    })
  },
  seleDate(e) {
    var index=e.currentTarget.dataset.index
    this.setData({
      dateIndex:e.currentTarget.dataset.index
    })
    this.getList(this.data.date[index]);
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})