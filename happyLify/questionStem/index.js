
!function () {
    var sessionId = $("#container").attr("data-sessionId"),
        level = $("#container").attr("data-level"),
        topicArray =$("#container").attr("data-topics"),//试题列表
        orderNumber =$("#container").attr("data-orderNumber") || 0,
        param ={
            level : level,
            sessionId : sessionId
        },
        tryPrompt = '您可以通过试玩，熟悉游戏流程，试玩不限次数，不消耗咪咕币，试玩所获奖励无效。',
        prompt = '您可以选择领取相应的咪咕币奖励，放弃继续挑战；也可以继续挑战下一级，获取更多咪咕币；但是下一级答错或者不答，则没有任何奖励哦！';

    var t =sessionStorage.getItem('countdown') || 10;
    $('.question>.second').text(t+'S');
    if(sessionStorage.getItem('voicebroadcast')=='2'){
        $('.wrapper>.voice-icon').addClass('stopTTS').attr('src','./images/voice-close-icon.png')
    }

    //初始化判断是否已经存在答题结果
    if(sessionStorage.getItem('answerResult')){
        $('.wrapper>.voice-icon').addClass('stopTTS').attr('src','./images/voice-close-icon.png');
        $('.wrapper>.pop-mask').show();
        $('.wrapper>.popPrompt').show();
        if(sessionStorage.getItem('answerResult')=='1'){
            //试玩成功
            $('.wrapper>.popPrompt').css({'background':'url("./images/tryYeah.png") no-repeat','background-size':'100% 100%'});
            $('.wrapper>.popPrompt>.pop-center').attr('src','./images/pop-playGame.png');
        }else {
            //试玩失败
            $('.wrapper>.popPrompt').css({'background': 'url("./images/tryOops.png") no-repeat', 'background-size': '100% 100%'});
            $('.wrapper>.popPrompt>.pop-center').attr('src', './images/pop-ok.png');
        }
        setTimeout(function () {
            clearInterval(window['timer'])
        },0)
    }
    window['timer']=null;
    showTheQuestion();

    if(!topicArray){
        //首次进入答题页面,获取试题列表
        if(!sessionId || !level){
            //试玩进来的
            topicArray = CFG.testQuestions;
            showTheQuestion();
            page.save('questionStem', {
                topics : JSON.stringify(topicArray),
                orderNumber : orderNumber
            });
        }else {
            lxUtil.getTopics(param,function (data) {
                topicArray = data;
                showTheQuestion();
                page.save('questionStem', {
                    sessionId: sessionId,
                    level :level,
                    topics : JSON.stringify(topicArray),
                    orderNumber : orderNumber
                });
            });
        }
    }
    !sessionId || !level ? ($('.question>.prompt').text(tryPrompt),$('.wrapper>.question').css({'background':'url("./images/questioning.png") no-repeat','background-size':'100% 100%'})) :($('.question>.prompt').text(prompt),$('.wrapper>.question').css({'background':'url("./images/questioning2.png") no-repeat','background-size':'100% 100%'}));

    /**
     * @desc 语音播报按钮
     */
    $('.wrapper>.voice-icon').click(function () {
        lxData.trackEvent('点击语音播报按钮');
        $(this).hasClass("stopTTS") ?($(this).attr('src','./images/voice-icon.png'),lx.startTTS({text:topicArray[orderNumber].content}),sessionStorage.setItem('voicebroadcast',1)): ($(this).attr('src','./images/voice-close-icon.png'),lx.stopTTS(),sessionStorage.setItem('voicebroadcast',2));
        $(this).toggleClass('stopTTS');
    });

    var startListen =false,
        oldTime =0,
        newTime =0;

    /**
     * @desc 开始录音以及监听录音回调
     */
    $('.question>.record').on('touchstart',function (e) {
        lxData.trackEvent('点击话筒按钮');
        e.preventDefault();
        if(startListen)return;//不能连续点击识别
        startListen =true;
        lx.stopTTS();
        lx.startListenTransfer({
            engine: 'EN', //CN、EN,不传默认CN
            isSaveAudio: false //是否保存录音文件
        });
        $(this).attr('src','images/record.gif');
        oldTime = (new Date).getTime()
    });

    var timerOut =null;
    $('.question>.record').on('touchend',function () {
        lx.stopListenTransfer();
        clearInterval(window['timer']);
        $(this).attr('src','images/record.png');

        newTime =(new Date).getTime();
        if(newTime-oldTime<500){
            if(!sessionId || !level){
                tryFail();
            }else {
                page.forward('questionResult/12345/12');
            }
            lx.cancelListenTransfer();
            clearTimeout(timerOut);
            return;
        }

        lxUtil.showLoading('正在努力识别...');
        if(location.hash.indexOf('questionResult') > -1 || sessionStorage.getItem('answerResult')){
            $("#loading").hide();
        }
        timerOut =setTimeout(function () {
            if(!startListen)return;
            $("#loading").hide();
            lx.cancelListenTransfer();
            if(!sessionId || !level){
                //试玩失败
                tryFail();
            }else {
                page.forward('questionResult/12345/12');
            }
        },6000)
    });

    var answerArray =['A,a,Hey,I,In,The','B,b,Beer,Been,They,Big','C,c,See,Say,There,Sea,So,Stay,Speak','D,d,Gay,He,Dear,Tea,Year'],
        answerText =['A','B','C','D'];

    lx.onListenTransfer({
        //听写完成
        complete: function(ret){
            if(!startListen)return; //防止2次执行
            var text = ret.rawText.replace(/[.]/,''); //转写文本内容
            if(!text)text='wrong';
            var reg = new RegExp(text);
            for(var i=0;i<answerArray.length;i++){
                if(reg.test(answerArray[i])){
                    text =answerText[i];
                    break;
                }
            }
            var args = {
                id : topicArray[orderNumber].id,
                answer : text,
                sessionId : sessionId
            };
            if(!sessionId || !level){
                $("#loading").hide();
                //试玩
                if(text==topicArray[orderNumber].answer){
                    if(orderNumber==4){
                        //最后一题
                        $('.wrapper>.pop-mask').show();
                        $('.wrapper>.popPrompt').show();
                        $('.wrapper>.popPrompt').css({'background':'url("./images/tryYeah.png") no-repeat','background-size':'100% 100%'});
                        $('.wrapper>.popPrompt>.pop-center').attr('src','./images/pop-playGame.png');
                        sessionStorage.setItem('answerResult',1);
                        // clearInterval(timer)
                    }else {
                        orderNumber++;
                        page.save('questionStem', {
                            orderNumber : orderNumber
                        });
                        t=11;
                        //显示下一题
                        showTheQuestion();
                    }
                } else {
                    //试玩失败
                    tryFail();
                    // clearInterval(timer)
                }
                startListen =false;
                clearTimeout(timerOut);
            }else {
                lxUtil.saveAnswer(args,function (data) {
                    if (data.returncode == '000000') {
                        $("#loading").hide();
                        if(data.result.state){
                            //进入下一道题目或成功页面
                            if(orderNumber==4){
                                //最后一题
                                page.forward('questionResult/'+sessionId+'/'+level);
                            }else {
                                orderNumber++;
                                page.save('questionStem', {
                                    orderNumber : orderNumber
                                });
                                t=11;
                                //显示下一题
                                showTheQuestion();
                            }
                        }else {
                            //进入挑战失败页面
                            page.forward('questionResult/12345/12');
                        }
                        startListen =false;
                        clearTimeout(timerOut);
                    } else {
                        lxUtil.showToast('获取接口信息失败');
                    }
                });
            }
        },
        //听写异常
        fail: function(ret){
            var code = ret.code; //错误编码
            switch (code){
                case 100001:
                    lxUtil.showToast('结果字段无效');
                case 100002:
                    lxUtil.showToast('结果为空');
                case 100003:
                    lxUtil.showToast('结果解析错误');
                case 100004:
                    lxUtil.showToast('其他错误');
                case 100005:
                    lxUtil.showToast('无网络');
                case 100006:
                    lxUtil.showToast('无录音权限');
                case 100007:
                    lxUtil.showToast('保存音频失败');
                case 100008:
                    lxUtil.showToast('未检测到声音');
                case 100009:
                    lxUtil.showToast('录音出错');
                case 100010:
                    lxUtil.showToast('唤醒开启');
            }
        }
    });

    /**
     * @desc 试玩失败
     */
    function tryFail() {
        $('.wrapper>.pop-mask').show();
        $('.wrapper>.popPrompt').show();
        $('.wrapper>.popPrompt').css({'background':'url("./images/tryOops.png") no-repeat','background-size':'100% 100%'});
        $('.wrapper>.popPrompt>.pop-center').attr('src','./images/pop-ok.png');
        sessionStorage.setItem('answerResult',2);
    }

    /**
     * @desc 弹窗按钮处理
     */
    $('.popPrompt>.pop-center').click(function () {
        page.back('questionStem')
    });
    /**
     * @desc 将得到的试题信息呈现在页面上
     */
    function showTheQuestion() {
        if(!topicArray)return;
        var array=[];//存放当前试题选项答案
        topicArray = typeof topicArray=="string" ?JSON.parse(topicArray) :topicArray;
        $('.wrapper>.voice-icon').hasClass("stopTTS") || lx.startTTS({text:topicArray[orderNumber].content});
        $('.answer>.q-question').text(topicArray[orderNumber].content);
        for (var s in topicArray[orderNumber].options){
            array.push(topicArray[orderNumber].options[s])
        }
        for(var i=0;i<array.length;i++){
            $($('.ans-X')[i]).text(array[i])
        }
        var stageHook ={
            '1' : '初级',
            '2' : '中级',
            '3' : '中高级',
            '4' : '高级',
        };
        $('.question>.stage').text(stageHook[level] || '初级');
        $('.answer>.q-number').text('第'+ (orderNumber*1+1) +'题');
        array.length==5 && $('.answer>.ansE').show();
        clearInterval(window['timer']);
        //设置倒计时
        window['timer'] =setInterval(function () {
            t--;
            sessionStorage.setItem('countdown',t);
            t>-1 ? $('.question>.second').text(t+'S'): (clearInterval(window['timer']),lx.stopTTS(),sessionStorage.setItem('countdown',10), overTime());
        },1000);
    }
    /**
     * @desc 超时处理
     */
    function overTime() {
        startListen =false;
        $('.question>.record').attr('src','images/record.png');
        if(!sessionId || !level){
            //试玩失败
            $('.wrapper>.pop-mask').show();
            $('.wrapper>.popPrompt').show();
            $('.wrapper>.popPrompt').css({'background':'url("./images/tryOops.png") no-repeat','background-size':'100% 100%'});
            $('.wrapper>.popPrompt>.pop-center').attr('src','./images/pop-ok.png');
            sessionStorage.setItem('answerResult',2);
        }else {
            //进入挑战失败页面
            page.forward('questionResult/12345/12');
        }
    }
}();