(function (){ 'use strict';

  // 数据统计
  var ua = navigator.userAgent.toLocaleLowerCase(),
    IOS = /iphone/.test(ua),
    e = 'ontouchstart' in document.documentElement ? 'touchstart' : 'click',
    winningrecordid; // 用户中奖纪录id
    
    
  // 初始化判断是否玩了5次游戏
  var playTimes = getCookie('playGames') ? parseInt(getCookie('playGames')) : 0;
  // 初始化判断是否玩了5次游戏
  if (getCookie('playGames') === '5') {
    $('.pointer-gray').show(); // 置灰
  } else {
    $('.pointer-gray').hide(); // 显示
  }
  
  lxUtil.isLogin(function(isLogin) {
    if (isLogin) {
      lxUtil.getRemainAwards(function (data) {
          var gameTimes = parseInt(data.leftlotterynum);
          if (gameTimes === 0) {
            $('.pointer-gray').show();
          }
      });
    }
  });
  
  // 点击分享
  $(".share-share").click(function() {
    lxData.trackEvent('抽奖页点击分享');
    lxUtil.isLogin(function (isLogin) {
      if (isLogin) {
        share();
        initAppShare(CFG.shareImgUrl, lxUtil.queryUrl('id'));
      } else {
         lxUtil.login();
      }
    });
  });
  if (document.body.scrollTop) {
  	document.body.scrollTop = 0;
  }
  // 隐藏蒙版
  $('.mask').on(e, function () {
     $('.no-prize').hide(); 
     $('.virtual-prize').hide();
  });
  // 网络超时提示
  var rotateTimeOut = function (){
    $('#rotate').rotate({
      angle: 0,
      animateTo: 2160,
      duration: 8000,
      callback:function (){
        alert('网络超时，请检查您的网络设置！');
      }
    });
  };

  var bRotate = false;
  
  /**
   * @desc 中奖逻辑 
   * @arg {number} result 中奖结果
   * @arg {number} angles 指针停留位置
   * @arg {string} awardname 奖品名称
   */
  var rotateFn = function (result, angles, awardname){
    bRotate = !bRotate;
    $('#rotate').stopRotate();
    $('#rotate').rotate({
      angle: 0,
      animateTo: angles + 1800,
      duration: 5000,
      callback: function (){
        playTimes++; 
        setCookie('playGames', playTimes);
        if (playTimes >= 5) {
          $('.pointer-gray').show();
        }
        if (result.remaininglottery < 1) {
        	$('.pointer-gray').show();
//        setCookie('playGames', '5');
        }
        if (!!result.iswinning && !!result.awardname) { // 是否中奖
          if (['JBL音乐金砖音箱', '咪咕耳机', '咪咕kindle'].indexOf(awardname) !== -1) { // 实物奖
            $('.real-prize .gift').text(awardname);
            $('.real-prize').show();
          } else { // 虚拟奖
            $('.virtual-prize .gift').text(awardname);
            $('.virtual-prize').show();
          }
        } else {
          $('.no-prize').show();
        }
        bRotate = !bRotate;
      }
    })
  };
  
  // 点击抽奖
  $('.pointer').click(function (){
    if (bRotate) return; // 防止多次点击
    lxData.trackEvent('点击抽奖');
    lxUtil.hasAward(function (result) {
   	    var awardname = result.awardname;
   	    winningrecordid = result.winningrecordid;
 	      switch (awardname) {
 	        case '30咪咕币':
 	          //var angle = [22.5, 67.5, 112.5, 157.5, 202.5, 247.5, 292.5, 337.5];
 	          rotateFn(result, 337.5, '30咪咕币');
 	          break;
 	        case '2元咪咕书券':
 	          rotateFn(result, 22.5, '2元咪咕书券');
 	          break;
 	        case 'JBL音乐金砖音箱':
 	          rotateFn(result, 67.5, 'JBL音乐金砖音箱');
 	          break;
 	        case '5元咪咕书券':
 	          rotateFn(result, 112.5, '5元咪咕书券');
 	          break;
 	        case '咪咕耳机':
 	          rotateFn(result, 157.5, '咪咕耳机');
 	          break;
 	        case '':
 	          rotateFn(result, 202.5, '谢谢惠顾');
 	          break;
 	        case '10元京东券':
 	          rotateFn(result, 247.5, '10元京东券');
 	          break;
 	        case '咪咕kindle':
 	          rotateFn(result, 292.5, '咪咕kindle');
 	          break;
 	      }
    });
    
  });
  
  $('.pointer-gray').click(function () {
     lxUtil.showToast('抽奖次数已经用完了，明天再来吧') 
  });
  
    // 没中奖
  $('.no-prize .btn').on(e, function () {
      setTimeout(function () {
         $('.no-prize').hide(); 
      }, 100);
  });
  // 虚拟奖
  $('.virtual-prize .btn').on(e, function () {
    setTimeout(function () {
         lxUtil.showToast('领奖成功');
         $('.virtual-prize').hide(); 
      }, 100);
  });
  // 实物奖
  $('.real-prize .btn1').on(e, function () {
    setTimeout(function () {
         $('.real-prize').hide(); 
      }, 100);
  });
  // 用户信息校验提交
  $('.real-prize .btn2').on(e, function () {
    var name = $('.name').val().trim();
    var tel = $('.tel').val().trim();
    var address = $('.address').val().trim();
    var telReg = /^1(3|4|5|7|8)[0-9]{9}$/;
    var isTel = telReg.test(tel);
    
    if (name === '') {
      lxUtil.showToast('姓名不能为空！', 'top');
      $('#lxToast').css('top', '1.4rem');
      return false;
    }
    
    for (var i = 0; i < name.length; i++) {
      if (!/\w/.test(name[i]) && name[i].charCodeAt() < 255) {
        lxUtil.showToast('姓名不合法！', 'top');
        $('#lxToast').css('top', '1.4rem');
        return false;
      }
    }
    
    if (tel === '') {
      lxUtil.showToast('电话不能为空！', 'top');
      $('#lxToast').css('top', '1.4rem');
      return false;
    }
    if (!isTel) {
      lxUtil.showToast('请填写正确的手机号！', 'top');
      $('#lxToast').css('top', '1.4rem');
      return false;
    }
    if (address === '') {
      lxUtil.showToast('地址不能为空！', 'top');
      $('#lxToast').css('top', '1.4rem');
      return false;
    }
    if (!/\w/.test(name[i]) && name[i].charCodeAt() < 255) {
      lxUtil.showToast('地址不合法！', 'top');
      $('#lxToast').css('top', '1.4rem');
      return false;
    }
    
    var userMsg = {
      name: name,
      phone: tel,
      address: address,
      id: winningrecordid
    }
    lxUtil.saveAdderss(userMsg, function (res) {
        if (res.issave === '1') {
          lxUtil.showToast('提交信息成功', 'top');
          $('#lxToast').css('top', '1.4rem');
        } else {
          lxUtil.showToast('提交信息失败', 'top');
          $('#lxToast').css('top', '1.4rem');
        }
    });
    $('.real-prize').hide();
  });
  if (!IOS) {
    $('.real-prize .msg').on('focus', function (e) {
      $('.real-prize .main').css('transform', 'translateY(-3rem)');
    });
    $('.real-prize .msg').on('blur', function () {
      $('.real-prize .main').css('transform', 'translateY(0)');
    });
  }
  
  /**
   * @desc 设置cookie
   * @arg {string} cookieName cookie的名字
   * @agr {string} cookieValue cookie的值
   */
  function setCookie(cookieName, cookieValue) {
    var curTamp = Date.now(),
        //当日凌晨的时间戳,减去一毫秒是为了防止后续得到的时间不会达到00:00:00的状态
        curWeeHours = new Date(new Date().setHours(0,0,0,0)).getTime() - 1, 
        passedTamp = curTamp - curWeeHours,
        leftTamp = 32 * 60 * 60 * 1000 - passedTamp,
        leftTime = new Date();
    leftTime.setTime(leftTamp + curTamp);  
    document.cookie = cookieName + "=" + escape(cookieValue) + ";expires=" + leftTime.toGMTString();   
  }
  /**
   * @desc 获取cookie的值 
   * @arg cookieName cookie的名字
   */
  function getCookie(cookieName) {  
      var arr = document.cookie.match(new RegExp("(^| )" + cookieName + "=([^;]*)(;|$)"));  
      if (arr != null){  
          return unescape(arr[2]);  
      } else {  
          return null;  
      }  
  } 
})();
