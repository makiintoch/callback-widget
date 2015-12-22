(function() {
  "use strict";

  var widget = {
    getOptions: function() {
      var widgetTag = $('.wf-widget');

      var color = widgetTag.data('color'),
          sound = widgetTag.data('sound'),
          positionHor = widgetTag.data('widget-position-hor'),
          positionVer = widgetTag.data('widget-position-ver');

      return {
        color: color,
        positionVer: positionVer,
        positionHor: positionHor,
        sound: sound,
      }
    },
    getWidgetIconElem: function() {
      return $(".wf-widget-icon");
    },
    getWidgetNameElem: function() {
      return $(".wf-widget-name-icon");
    },
    getWidgetPhoneElem: function() {
      return $(".wf-widget-phone-icon");
    },
    getHeightWindow: function() {
      return $(window).height();
    },
    getDocumentWindow: function() {
      return $(document).height();
    },
    setHeightWindow: function() {
      $('.wf-widget').css('height', widget.getHeightWindow());

      $(window).resize(function() {
        $('.wf-widget').css('height', widget.getHeightWindow());
      });
    },
    setWidgetPosition: function() {
      var windowHeight = widget.getHeightWindow();
      var documentScrollTopHeight = document.body.scrollTop;
      var ver = (windowHeight - 150) + documentScrollTopHeight + 'px';

      $('.wf-widget-call').css('top', ver);
    },
    resizeWindow: function() {
      $(window).resize(function() {
        widget.setWidgetPosition();
      });
    },
    scrollDocument: function() {
      $(window).scroll(function() {
        widget.setWidgetPosition();
      });
    },
    rotateButtons: function() {
      var icon = widget.getWidgetIconElem();
      var name = widget.getWidgetNameElem();
      var phone = widget.getWidgetPhoneElem();

      var intervalId = setInterval(function() {
        if($(name).hasClass('wf-rotate-icon')) {
          $(name).removeClass('wf-rotate-icon');
          $(phone).addClass('wf-rotate-icon');
        } else {
          $(phone).removeClass('wf-rotate-icon');
          $(name).addClass('wf-rotate-icon');
        }
      }, 4000);
    },
    showWidget: function() {
      $('.wf-widget-call').on('click', function() {
        $(this).addClass('wf-hide');
        $('.wf-widget-content').css('right', 0);
      });
    },
    hideWidget: function() {
      $('.wf-close').on('click', function() {
        $('.wf-widget-call').removeClass('wf-hide');
        $('.wf-widget-content').css('right', '-350px');
      });
    },
    changeTab: function() {
      $('.wf-icon').on('click', function() {
        var index = $(this).index();
        $('.wf-icon').removeClass('wf-active');
        $(this).addClass('wf-active');
        $('.wf-body .wf-text ').css('display', 'none');
        $('.wf-body .wf-text ').eq(index).css('display', 'block');
      });
    },
    addOrder: function(params) {
      var xhr = new XMLHttpRequest();
      var body = 'name=' + encodeURIComponent('Игорь xxx') + '&phone=' + encodeURIComponent('0668778595') + '&url=' + encodeURIComponent(location.href);

      xhr.open("POST", "http://localhost:3000/api/v1/orders", true);
      xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
      xhr.send(body);

      if(xhr.status == 200) {
        return xhr.responseText;
      }
    },
    sendForm: function() {
      $('.wf-text form input[type="submit"]').on('click', function(e) {
        e.preventDefault();
        var params = {name: 'name', email: 'email', url: 'url'};

        var info = widget.addOrder(params);
        console.log(info);
      });
    },
    createWidget: function() {
      var widgetOptions = widget.getOptions();

      var positionHor = (widgetOptions.positionHor == 'right') ? 'left' : 'right';

      $('.wf-widget').append('<div class="wf-widget-wrapper"><div class="wf-widget-call" style="top: 0; '+ widgetOptions.positionHor +': 75px;"><div class="wf-widget-bg" style="background: '+ widgetOptions.color +';"><span class="wf-widget-triangle"></span></div><span class="wf-widget-icon wf-widget-name-icon wf-rotate-icon"></span><span class="wf-widget-icon wf-widget-phone-icon"></span></div><div class="wf-widget-content" style="background: rgba(204, 204, 204, .95);"><div class="wf-arrow"></div><span class="wf-close"></span> <div class="wf-icons"> <div class="wf-icon wf-icon-phone wf-active"> <span class="wf-img"></span> <span>Звонок</span> </div><div class="wf-icon wf-icon-subscribe"> <span class="wf-img"></span> <span>Письмо</span> </div></div><div class="wf-body"><div class="wf-text wf-text-phone"> <span>— Хотите,</span> чтобы мы перезвонили Вам и ответили на ваши вопросы? <form> <div class="wf-select-time"><span class="wf-day"></span> в <span class="wf-time"></span></div><input type="text" name="phone" placeholder="Ваш телефон"> <input type="submit" value="Отправить"> </form> </div><div class="wf-text wf-text-subscribe" style="display: none;"> <span>— Приветствую вас!</span> хотите мы напишем Вам письмо? <form> <textarea name="" name="question" placeholder="Напишите вопрос"></textarea> <input type="text" name="email" placeholder="Ваш E-mail(для ответа)"> <input type="text" name="phone" placeholder="Ваш телефон(по желанию)"> <input type="submit" value="Отправить"> </form> </div></div><div class="wf-powered-by"> <a href="">Установите виджет к себе на сайт</a> </div></div></div>');

      if(widgetOptions.positionHor == 'right') {
        $('.wf-widget').css('right', 0);
        $('.wf-widget-triangle').css('borderColor', 'transparent transparent transparent ' + widgetOptions.color).css(positionHor, '83.7px');
        $('.wf-widget-content').css(widgetOptions.positionHor, '-350px');
      } else {
        $('.wf-widget').css('left', 0);
        $('.wf-widget-triangle').css('borderColor', 'transparent '+ widgetOptions.color +' transparent transparent').css(positionHor, '83.7px');
        $('.wf-widget-content').css(widgetOptions.positionHor, '-350px');
      }
    },
    run: function() {
      widget.createWidget();
      widget.setHeightWindow();
      widget.setWidgetPosition();
      widget.rotateButtons();
      widget.resizeWindow();
      widget.scrollDocument();
      widget.showWidget();
      widget.hideWidget();
      widget.changeTab();
      widget.sendForm();
    }
  };

  widget.run();
})();