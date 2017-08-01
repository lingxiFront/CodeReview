!function () {
    var sessionId = $("#container").attr("data-sessionId") || 12345,
        level = $("#container").attr("data-level"),
        playTimes =0;

    lxUtil.getPlayTimes(function (data) {
        playTimes =data.times;
        $('.colorful').text(playTimes)
    });

    $("#loading").hide();

    if(sessionId ==12345){
        //挑战失败
        $('.wrapper>.levelX').attr('src','./images/level0.png');
        $('.shareArea>.count').html('您今日还有 <span class="colorful">' +playTimes +'</span>次游戏机会！<br>成功分享活动可获得一次额外游戏机会<br>每日最多可分享3次')
        $('.wrapper>.shareArea').removeClass('longShareArea');
        $('.wrapper>.button-top').attr('src','./images/play-other.png');
        $('.wrapper>.button-bottom').attr('src','./images/play-again.png');
    }else {
        if(level==4){
            //通关
            lxData.trackEvent('通关总人数');
            $('.wrapper>.levelX').attr('src','./images/level'+ level +'.png');
            $('.wrapper>.button-top').attr('src','./images/reward.png');
            $('.wrapper>.button-bottom').attr('src','./images/share-button.png');
            $('.wrapper>.shareArea').hide();
        }else {
            //挑战成功
            $('.wrapper>.levelX').attr('src','./images/level'+ level +'.png');
            $('.wrapper>.shareArea').addClass('longShareArea');
            $('.shareArea>.count').html('您可以选择领取相应的咪咕币奖励，放弃继续挑战；也可以继续挑战下一级，获取更多咪咕币；但是<span class="colorful2">下一级答错或者不答，则没有任何奖励哦！</span>')
            $('.wrapper>.button-top').attr('src','./images/challenge-next.png');
            $('.wrapper>.button-bottom').attr('src','./images/reward.png');
        }
    }
    page.save('questionResult', {
        sessionId : sessionId,
        level : level
    });

    var params ={
        sessionId : sessionId,
        level : level
    };
    $('.wrapper>.button-top').click(function () {
        if(sessionId ==12345){
            //玩玩别的
            lxData.trackEvent('点击玩玩别的');
            page.home(function() {
                lxUtil.getComponent('./component/main/index.html', 'container', function() {
                    $("#container").show();
                });
            });
        }else {
            if(level==4){
                lxData.trackEvent('点击领取奖励');
                lxUtil.getAward(params,function (req) {
                    //领取奖励
                    $('.wrapper>.popPrompt').show();
                    $('.wrapper>.pop-mask').show();
                    $('.wrapper>.popPrompt').css({'background':'url("./images/play-yeah.png") no-repeat','background-size':'100% 100%'});
                    $('.popPrompt>.pop-top').attr('src','./images/'+ req.addscore+'migubi.png');
                })
            }else {
                //挑战下一级
                lxData.trackEvent('点击挑战下一级');
                page.save('questionStem', {
                    topics : [],
                    orderNumber : 0  //清空现场
                });
                sessionStorage.setItem('countdown',10);
                page.back('questionResult/'+sessionId + '/'+(level*1+1));
            }
        }
    });
    $('.wrapper>.button-bottom').click(function () {
        if(sessionId ==12345){
            //在玩一次
            lxData.trackEvent('点击再玩一次');
            page.back('questionResult/12345/12')
        }else {
            if(level==4){
                //立即分享
                lxData.trackEvent('点击立即分享');
                share();
                var imgUrl = CFG.shareImgUrl;
                var id = lxUtil.queryUrl('id');
                initAppShare(imgUrl, id);
            }else {
                lxData.trackEvent('点击领取奖励');
                lxUtil.getAward(params,function (req) {
                    //领取奖励
                    $('.wrapper>.popPrompt').show();
                    $('.wrapper>.pop-mask').show();
                    $('.wrapper>.popPrompt').css({'background':'url("./images/play-yeah.png") no-repeat','background-size':'100% 100%'});
                    $('.popPrompt>.pop-top').attr('src','./images/'+ req.addscore+'migubi.png');
                })
            }
        }
    });
    
    $('.popPrompt>.pop-left').click(function () {
        lxData.trackEvent('点击好的');
        page.home(function() {
            lxUtil.getComponent('./component/main/index.html', 'container', function() {
                $("#container").show();
            });
        });
    });
    $('.popPrompt>.pop-right').click(function () {
        //跳转至咪咕币商城页面
        lxData.trackEvent('点击兑换礼品');
        lxUtil.turnToMarket();
    });

    $('.shareArea>.shareBtn').click(function () {
        share();
        var imgUrl = CFG.shareImgUrl;
        var id = lxUtil.queryUrl('id');
        initAppShare(imgUrl, id);
    });

    window.addGameTimes =function (data) {
        if(data.returncode=='000000'){
            $('.colorful').text(playTimes+data.result.addtimes)
        }
    };

    $('.ok').click(function () {
        $('.share-success').hide();
    });

    page.sysback('questionResult/12345/12')
}();