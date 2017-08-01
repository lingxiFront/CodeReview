(function() { 'use strict';

  var x = document.getElementById("myAudio");

  lxUtil.isLogin(function(isLogin) {
    if (isLogin) {
      lxUtil.getMiguCoin(function(miguNum) {
        $('.coin-num').text(miguNum);
      });
    } else {
      $('.coin-num').text(0);
    }
  });
  // 获取咪咕币
  $('.getCoin').on('click', function() {
    if (!x.paused) {
      x.pause();
      $('.play').show();
      $('.pause').hide();
    }
    lxUtil.isLogin(function(isLogin) {
      if (isLogin) {
        lxData.trackEvent('点击充值');
        page.forward('buyCoin/main');
      } else {
        lxUtil.login();
      }
    });
  });
  // 礼品兑换
  $('.exchange').on('click', function() {
    if (!x.paused) {
      x.pause();
      $('.play').show();
      $('.pause').hide();
    }
    lxUtil.isLogin(function(isLogin) {
      if (isLogin) {
        lxUtil.turnToMarket();
      } else {
        lxUtil.login();
      }
    });
  });
  // 语音答题
  $('.answer').on('click', function() {
    if (!x.paused) {
      x.pause();
      $('.play').show();
      $('.pause').hide();
    }
    lxUtil.isLogin(function(isLogin) {
      if (isLogin) {
        lxData.trackEvent('点击语音答题');
        page.forward('questionMain');
      } else {
        lxUtil.login();
      }
    });
  });
  // 免费抽奖
  $('.lotto').on('click', function() {
    if (!x.paused) {
      x.pause();
      $('.play').show();
      $('.pause').hide();
    }
    lxData.trackEvent('点击免费抽奖');
    page.forward('award');
  });
  // 点击分享
  $(".home-share").on('click', function() {
    if (!x.paused) {
      x.pause();
      $('.play').show();
      $('.pause').hide();
    }
    lxUtil.isLogin(function(isLogin) {
      if (isLogin) {
        share();
        var imgUrl = CFG.shareImgUrl;
        var id = lxUtil.queryUrl('id');
        initAppShare(imgUrl, id);
      } else {
        lxUtil.login();
      }
    });
  });
  // 隐藏弹窗
  $(".mask").on('click', function() {
    $('.share-success').hide();
    $('.headset').hide();
  });
  $('.ok').on('click', function() {
    setTimeout(function() {
      $('.share-success').hide();
    }, 100);
  });

  // 显示规则弹窗
  $('.rule').on('click', function() {
    $('.rule-popup').show();
  });
  // 关闭规则弹窗
  $('.mask, .rule-close').on('click', function() {
    $('.rule-popup').hide();
  });
  $('.extend_1').on('click', function() {
    if (!x.paused) {
      x.pause();
      $('.play').show();
      $('.pause').hide();
    }
    location.href = 'http://wap.cmread.com/r/t/tj_ytk.jsp?vt=3';
  });
  // 耳机
  $('.extend_2').on('click', function() {
    $('.headset').show();
  });
  $('.headset .btn').on('click', function() {
    $('.headset').hide();
  });
  $('.voice>a').click(function () {
    if (!x.paused) {
      x.pause();
      $('.play').show();
      $('.pause').hide();
    }
  });
  // 播放音频
  $('.voice .play').on('click', function() {
      $(this).parent().siblings().children('.pause').hide();
      $(this).parent().siblings().children('.play').show();
      var order = $(this).attr('data-order');
      if (x.src === '' || (x.src).indexOf(order + '.mp3') === -1) {
        x.src = 'res/' + order + '.mp3';
      }
      if (x.paused) {
        x.play();
        $(this).hide();
        $(this).next().show();
      } else {
        x.pause();
        $(this).hide();
        $(this).next().show();
      }
  });
  //播放音频
  $('.voice .pause').on('click', function() {
      if (x.paused) {
        x.play();
        $(this).hide();
        $(this).prev().show();
      } else {
        x.pause();
        $(this).hide();
        $(this).prev().show();
      }
  });
})();
