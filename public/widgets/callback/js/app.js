(function() {
  "use strict";

  var widget = {
    getOptions: function() {
      var widgetTag = $('.wf-widget');
      var pos = widgetTag.data('position');
      var posArray = pos.split("-");

      var color = widgetTag.data('color'),
          sound = widgetTag.data('sound'),
          positionHor = posArray[0],
          positionVer = posArray[1];

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
      var widgetOptions = widget.getOptions();
      var windowHeight = widget.getHeightWindow();
      var documentScrollTopHeight = document.body.scrollTop;
      switch(widgetOptions.positionVer) {
        case 'top':
          var ver = '50px';
          break;
        case 'center':
          var ver = (windowHeight - (windowHeight/2 + 45)) + documentScrollTopHeight + 'px';
          console.log('center');
          break;
        case 'bottom':
          var ver = (windowHeight - 150) + documentScrollTopHeight + 'px';
          break;
      }

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
      var widgetOptions = widget.getOptions();

      $('.wf-widget-call').on('click', function() {
        $(this).addClass('wf-hide');
        $('.wf-widget-content').css(widgetOptions.positionHor, 0);
      });
    },
    hideWidget: function() {
      $('.wf-close, .wf-arrow ').on('click', function() {
        var widgetOptions = widget.getOptions();

        $('.wf-widget-call').removeClass('wf-hide');
        $('.wf-widget-content').css(widgetOptions.positionHor, '-350px');
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
      function validateForm(form) {
        var elem = $(form).find('.required');
        var error;

        elem.each(function(index) {
          if(!this.value || this.value == this.defaultValue ) {
            $(this).addClass('error');
            error = true;
          } else {
            $(this).removeClass('error');
          }
        });

        if (error) {
          return false;
        } else {
          return true;
        }
      }

      $('.wf-text form .required').keyup(function(e) {
        if(!this.value || this.value == this.defaultValue ) {
          $(this).addClass('error');
        } else {
          $(this).removeClass('error');
        }
      });

      $('.wf-text-phone form').submit(function(e) {
        e.preventDefault();

        var valid = validateForm(e.target);

        if(valid) {
          var order = {
            time: 'time',
            phone: $(e.target).find('input[name="phone"]').val(),
            type: 'call'
          };

          //var info = widget.addOrder(params);
        }
      });

      $('.wf-text-subscribe form').submit(function(e) {
        e.preventDefault();

        var valid = validateForm(e.target);

        if(valid) {
          var order = {
            email: $(e.target).find('input[name="email"]').val(),
            phone: $(e.target).find('input[name="phone"]').val(),
            message: $(e.target).find('textarea[name="message"]').val(),
            type: 'email'
          };

          //var info = widget.addOrder(order);
        }
      });
    },
    createWidget: function() {
      var widgetOptions = widget.getOptions();

      //var positionHor = (widgetOptions.positionHor == 'right') ? 'left' : 'right';

      $('.wf-widget').append('<div class="wf-widget-wrapper"><div class="wf-widget-call" style="top: 0; '+ widgetOptions.positionHor +': 75px;"><div class="wf-widget-bg" style="background: '+ widgetOptions.color +';"><span class="wf-widget-triangle"></span></div><span class="wf-widget-icon wf-widget-name-icon wf-rotate-icon"></span><span class="wf-widget-icon wf-widget-phone-icon"></span></div><div class="wf-widget-content" style="background: rgba(204, 204, 204, .95);"><div class="wf-arrow"><span class="wf-arrow-top"></span><span class="wf-arrow-bottom"></span></div><span class="wf-close"></span> <div class="wf-icons"> <div class="wf-icon wf-icon-phone wf-active"> <span class="wf-img"></span> <span>Звонок</span> </div><div class="wf-icon wf-icon-subscribe"> <span class="wf-img"></span> <span>Письмо</span> </div></div><div class="wf-body"><div class="wf-text wf-text-phone"> <span>— Хотите,</span> чтобы мы перезвонили Вам и ответили на ваши вопросы? <form> <div class="wf-select-time"><span class="wf-day"></span> в <span class="wf-time"></span></div><input class="required" type="text" name="phone" placeholder="Ваш телефон" value=""> <input type="submit" value="Отправить"></form></div><div class="wf-text wf-text-subscribe" style="display: none;"> <span>— Приветствую вас!</span> хотите мы напишем Вам письмо? <form> <textarea class="required" name="message" placeholder="Напишите вопрос"  value=""></textarea> <input class="required" type="text" name="email" placeholder="Ваш E-mail(для ответа)" value=""> <input type="text" name="phone" placeholder="Ваш телефон(по желанию)"><input type="submit" value="Отправить"></form></div></div><div class="wf-powered-by"><a href="">Установите виджет к себе на сайт</a></div></div></div>');

      if(widgetOptions.positionHor == 'right') {
        $('.wf-widget').css('right', 0);
        $('.wf-widget-triangle').css('borderColor', 'transparent transparent transparent ' + widgetOptions.color).css('left', '83.7px');
        $('.wf-arrow').addClass('wf-arrow-left');
      } else {
        $('.wf-widget').css('left', 0);
        $('.wf-arrow')
        $('.wf-widget-triangle').css('borderColor', 'transparent '+ widgetOptions.color +' transparent transparent').css('right', '83.7px');
        $('.wf-arrow').addClass('wf-arrow-right');
      }

      $('.wf-widget-content').css(widgetOptions.positionHor, '-350px');
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