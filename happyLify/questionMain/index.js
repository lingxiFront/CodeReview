! function() {
  /**
   * @desc 获取剩余游戏次数
   */
  lxUtil.getPlayTimes(function(data) {
    var playTimes = data.times;
    $('.shareArea>.count>.colorful').text(playTimes);
  });
  window.scrollTo(0, 0);

  sessionStorage.removeItem('countdown');
  sessionStorage.removeItem('answerResult');
    sessionStorage.removeItem('lingxi-#questionStem');
    sessionStorage.removeItem('lingxi-#questionResult');
  $("#loading").hide();

  $('.wrapper>.tryPlay').click(function() {
      lxData.trackEvent('点击试玩');
      page.forward('questionStem/');
    }),
    /**
     *  @desc 点击开始游戏
     */
    $('.wrapper>.startGame').click(function() {
        lxData.trackEvent('点击开始游戏');
      lxUtil.getMiguCoin(function(score) {
        if (score * 1 < 30) {
          $('.wrapper>.pop-mask').show();
          $('.wrapper>.popPrompt').show();
        } else {
            lxUtil.getPlayTimes(function(data) {
                if (data.times > 0) {
                    lxUtil.startPaly(function(data) {
                        switch (data.returncode) {
                            case '000000':
                                lxUtil.showToast('-30 咪咕币');
                                page.forward('questionStem/' + data.result.questionsession + '/' + 1);
                                break;
                            case '011001':
                                lxUtil.showToast('积分不足');
                                break;
                            case '013002':
                                lxUtil.showToast('单日咪咕币池超出');
                                break;
                            case '013003':
                                lxUtil.showToast('游戏次数不足');
                                break;
                            default:
                                lxUtil.showToast('未知错误');
                        }
                    })
                } else {
                    lxUtil.showToast('答题次数已用完')
                }
            });
        }
      })
    });

  $('.popPrompt>.pop-left,.wrapper>.pop-mask').click(function() {
      $('.wrapper>.pop-mask').hide();
      $('.wrapper>.popPrompt').hide();
    }),
    /**
     *  @desc 点击获取咪咕币
     */
    $('.popPrompt>.pop-right').click(function() {
        lxData.trackEvent('点击获取咪咕币');
      page.forward('buyCoin/play');
    });

  $('.shareArea>.shareBtn').click(function() {
      lxData.trackEvent('点击分享');
    share();
    var imgUrl = CFG.shareImgUrl;
    var id = lxUtil.queryUrl('id');
    initAppShare(imgUrl, id);
  });

  window.addGameTimes = function(data) {
    if (data.returncode == '000000') {
        lxUtil.getPlayTimes(function(data) {
            var playTimes = data.times;
            $('.shareArea>.count>.colorful').text(playTimes);
        });
    }
  };

  $('.ok').click(function() {
    $('.share-success').hide();
  });
}();
