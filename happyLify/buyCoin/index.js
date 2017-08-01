(function() {
  var from = $("#container").attr("data-from");
  page.sysback('buyCoin/' + from);
  page.save('buyCoin', {
    from: from
  });
  //获取物品列表
  lxUtil.getMiguItems(function(items) {
    var count = items && items.length,
      html = "";
    for (var i = 0; i < count; i++) {
      var cls = 'item';
      if (i == 0) {
        cls += ' on';
      }
      if (i % 2 == 0) {
        cls += ' col1';
      } else {
        cls += '  col2';
      }
      if (i == count - 1) {
        cls += ' clearfix';
      }
      html += '<div class="' + cls + '" data-Id="' + items[i].itemid +
        '">';
      html += ' <p class="num">' + items[i].name + '</p>';
      html += ' <p class="monney">' + turnToYuan(items[i].price) +
        '元</p>';
      html += '</div>';
    }
    $(".goods").html(html);
    $(".goods").find(".item").click(function() {
      $(".goods").find(".item").removeClass("on");
      $(this).addClass("on");
    });
  });
  var flag = false;
  $(".zhifubao").off("click").click(function() {
    var itemId = $(".goods").find(".item.on").attr("data-Id");
    if (!itemId) {
      lxUtil.showToast("请先选择物品！");
      return;
    }
    if (flag) return;
    lxData.trackEvent('选择' + $(".goods").find(".item.on .num").text() +
      '支付');
    lxUtil.goPay(itemId, function(data) {
      flag = false;
      var form = data.replace(/\\"/g, '"');
      $("#goPay").html(form);
    });
    flag = true;
  });
  $(".free-coin").off("click").click(function() {
    lxData.trackEvent('点击免费获取咪咕币按钮');
    window.location.href = CFG.miguCoinUrl;
  });
  /**
   * @desc 分转成元
   * @arg {number} price 分
   * @arg {float} 元
   */
  function turnToYuan(price) {
    var prices = parseInt(price);

    return prices / 100;
  }
}());
