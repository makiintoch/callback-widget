(function() {
  "use strict";

  var widget = {
    getOptions: function() {
      var widgetTag = $('.wf-widget');
      var pos = widgetTag.data('position');
      var posArray = pos.split("-");

      var color = widgetTag.data('color'),
          sound = widgetTag.data('sound'),
          time  = widgetTag.data('time'),
          positionHor = posArray[0],
          positionVer = posArray[1];

      return {
        color: color,
        position: {hor: positionHor, ver: positionVer},
        time: time,
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
      switch(widgetOptions.position.ver) {
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
        $('.wf-widget-content').css(widgetOptions.position.hor, 0);
      });
    },
    hideWidget: function() {
      $('.wf-close, .wf-arrow ').on('click', function() {
        var widgetOptions = widget.getOptions();

        $('.wf-widget-call').removeClass('wf-hide');
        $('.wf-widget-content').css(widgetOptions.position.hor, '-350px');
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
    addDateTime: function() {
      var widgetOptions = widget.getOptions();

      var date = new Date(),
          weekday = new Array(),
          workDayArray = new Array(),
          sortDayArray = new Array(),
          hours = date.getHours(),
          minutes = date.getMinutes(),
          dayOfWeek = date.getDay(),
          tomorrow = ((dayOfWeek+1) > 6) ? 1 : (dayOfWeek+1),
          afterTomorrow = ((tomorrow+1) > 6) ? 1 : (tomorrow+1),
          utcClient = date.getTimezoneOffset() / 60,
          utcServer = +3,
          utc = utcServer + utcClient;

      function nextDay(day) {
        return (day > 6) ? (day - 6) : day;
      }

      weekday[0] = "sun";
      weekday[1] = "mon";
      weekday[2] = "tue";
      weekday[3] = "wed";
      weekday[4] = "thu";
      weekday[5] = "fri";
      weekday[6] = "sat";

      for(var i = 0; i < weekday.length; i++) {
        if(widgetOptions.time[weekday[i]].status) {
          workDayArray.push(i);
        }
      }

      if($.inArray(dayOfWeek, workDayArray) > -1) {
        sortDayArray.push(dayOfWeek);
      }

      for(var i = 0; i < weekday.length; i++) {
        var idx = nextDay(dayOfWeek+i);

        if($.inArray(idx, workDayArray) > -1 && !($.inArray(idx, sortDayArray) > -1)) {
          sortDayArray.push(idx);
        }
      }

      function addDay(dayArray) {
        var dayIndex = 0,
            selectDay = '',
            monthNames = ["января", "февраля", "марта", "апреля", "мая", "июня","июля", "августа", "сентября", "октября", "ноября", "декабря"];
        /*
        * !!!!!!!!!!!!!!!!!!!!!!
        * Доделать
        * Вывод серверной даты типа 28 декабря
        * Если сегодня выходим за временные рамки, то перенести на завтра
        * Вывод сегодня от текущего времени
        * !!!!!!!!!!!!!!!!!!!!!!
        */

        if($.inArray(dayOfWeek, dayArray) > -1) {
          selectDay += '<span '+ ((dayIndex == 0) ? 'class="active"' : 'class="wf-day-item"') +' data-day="'+ weekday[dayOfWeek] +'" data-server-day="'+ date.getDate() +' '+ monthNames[date.getMonth()] +'">Сегодня</span>';
          dayIndex++;
        }
        if($.inArray(tomorrow, dayArray) > -1) {
          var tomorrowDate = new Date();
          tomorrowDate.setDate(tomorrowDate.getDate() + tomorrow);
          selectDay += '<span '+ ((dayIndex == 0) ? 'class="active"' : 'class="wf-day-item"') +' data-day="'+ weekday[tomorrow] +'" data-server-day="'+ tomorrowDate.getDate() +' '+ monthNames[tomorrowDate.getMonth()] +'">Завтра</span>';
          dayIndex++;
        }
        if($.inArray(afterTomorrow, dayArray) > -1) {
          var afterTomorrowDate = new Date();
          afterTomorrowDate.setDate(afterTomorrowDate.getDate() + afterTomorrow);
          selectDay += '<span '+ ((dayIndex == 0) ? 'class="active"' : 'class="wf-day-item"') +' data-day="'+ weekday[afterTomorrow] +'" data-server-day="'+ afterTomorrowDate.getDate() +' '+ monthNames[afterTomorrowDate.getMonth()] +'">Послезавтра</span>';
          dayIndex++;
        }

        for(dayIndex; dayIndex < 4; dayIndex++) {
          var weekdayDate = new Date();
          weekdayDate.setDate(weekdayDate.getDate() + dayArray[dayIndex]);
          selectDay += '<span '+ ((dayIndex == 0) ? 'class="active"' : 'class="wf-day-item"') +' data-day="'+ weekday[dayArray[dayIndex]] +'" data-server-day="'+ weekdayDate.getDate() +' '+ monthNames[weekdayDate.getMonth()] +'">'+ weekdayDate.getDate() +' '+ monthNames[weekdayDate.getMonth()] +'</span>';
        };

        return selectDay;
      }

      function addTime(dayArray) {
        var timeObj = {};
        var daySelect = $('.wf-day .active').data('day');
        $('.wf-day .active').data('day');
        var selectTime = '';

        for(var i = 0; i < dayArray.length; i++) {
          var arr = new Array();

          if(i >= 4) {
            break;
          }

          var startTime = new Date(),
              endTime = new Date();

          var start = widgetOptions.time[weekday[dayArray[i]]].start.split(":"),
              end = widgetOptions.time[weekday[dayArray[i]]].end.split(":");

          startTime.setHours(start[0]);
          startTime.setMinutes(start[1]);
          startTime.setTime(startTime.getTime() - (utc*60*60*1000));

          endTime.setHours(end[0]);
          endTime.setMinutes(end[1]);
          endTime.setTime(endTime.getTime() - (utc*60*60*1000));

          for (var start = startTime; start <= endTime; start.setMinutes(start.getMinutes() + 60)) {
            arr.push(new Date(start));
          }

          timeObj[weekday[dayArray[i]]] = arr;
        }

        for(var i = 0; i < timeObj[daySelect].length; i++) {
          var time = (timeObj[daySelect][i].getHours() < 10 ? '0'+timeObj[daySelect][i].getHours() : timeObj[daySelect][i].getHours()) +':'+ (timeObj[daySelect][i].getMinutes() < 10 ? '0'+timeObj[daySelect][i].getMinutes() : timeObj[daySelect][i].getMinutes());

          timeObj[daySelect][i].setTime(timeObj[daySelect][i].getTime() + (utc*60*60*1000));
          var serverTime = (timeObj[daySelect][i].getHours() < 10 ? '0'+timeObj[daySelect][i].getHours() : timeObj[daySelect][i].getHours()) +':'+ (timeObj[daySelect][i].getMinutes() < 10 ? '0'+timeObj[daySelect][i].getMinutes() : timeObj[daySelect][i].getMinutes());

          selectTime += '<span '+ ((i == 0) ? 'class="active"' : 'class="wf-time-item"') +' data-server-time="'+ serverTime +'">'+ time +'</span>';
        }

        return selectTime;
      }

      $('.wf-day').append(addDay(sortDayArray));
      $('.wf-time').append(addTime(sortDayArray));
    },
    showDate: function() {
      $('.wf-day').on('click', function() {
        if ($('.wf-day-show').length) {
          if($(event.target).hasClass('wf-day-item')) {
            $('.wf-day .active').addClass('wf-day-item').removeClass('active');
            $(event.target).addClass('active').removeClass('wf-day-item');
          }

          var child = $('.wf-day-show').children();

          $('.wf-day-show').remove();
          child.appendTo('.wf-day');
        } else {
          $(".wf-day .wf-day-item").wrapAll("<span class='wf-day-show'></span>");
        }
      });
    },
    showTime: function() {
      $('.wf-time').on('click', function(e) {
        if ($('.wf-time-show').length) {
          if($(event.target).hasClass('wf-time-item')) {
            $('.wf-time .active').addClass('wf-time-item').removeClass('active');
            $(event.target).addClass('active').removeClass('wf-time-item');
          }

          var child = $('.wf-time-show').children();

          $('.wf-time-show').remove();
          child.appendTo('.wf-time');
        } else {
          $(".wf-time .wf-time-item").wrapAll("<span class='wf-time-show'></span>");
        }
      });
    },
    addOrder: function(params) {
      var xhr = new XMLHttpRequest();
      var body = '';
      if(params.type == 'call') {
        body = 'time='+ encodeURIComponent(params.time) +'&phone=' + encodeURIComponent(params.phone) +'&type=call&url=' + encodeURIComponent(location.href);
      } else {
        body = 'email='+ encodeURIComponent(params.email) +'&phone=' + encodeURIComponent(params.phone) +'&message='+ encodeURIComponent(params.message) +'&type=email&url=' + encodeURIComponent(location.href);
      }

      xhr.open("POST", "http://localhost:3000/api/v1/orders", true);
      xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
      xhr.send(body);

      if(xhr.status == 200) {
        console.log(xhr.responseText);
        return xhr.responseText;
      }
    },
    sendForm: function() {
      var widgetOptions = widget.getOptions();

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
        var callbackTime = $(e.target).find('.wf-day .active').data('server-day') +' в '+ $(e.target).find('.wf-time .active').data('server-time');

        if(valid) {
          var order = {
            time: callbackTime,
            phone: $(e.target).find('input[name="phone"]').val(),
            type: 'call'
          };

          var info = widget.addOrder(order);

          var message = '<span>— Спасибо,</span>мы обязательно с вами свяжемся!';

          $('.wf-text-phone .wf-text-item').html(message);
          $(this).hide();

          console.log('call: '+info);
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

          var info = widget.addOrder(order);

          var message = '<span>— Спасибо,</span>мы обязательно с вами свяжемся!';

          $('.wf-text-subscribe .wf-text-item').html(message);
          $(this).hide();

          console.log('email:'+info);
        }
      });
    },
    createWidget: function() {
      var widgetOptions = widget.getOptions();

      $('.wf-widget').append('<div class="wf-widget-wrapper"><div class="wf-widget-call" style="top: 0; '+ widgetOptions.position.hor +': 75px;"><div class="wf-widget-bg" style="background: '+ widgetOptions.color +';"><span class="wf-widget-triangle"></span></div><span class="wf-widget-icon wf-widget-name-icon wf-rotate-icon"></span><span class="wf-widget-icon wf-widget-phone-icon"></span></div><div class="wf-widget-content" style="background: rgba(204, 204, 204, .95);"><div class="wf-arrow"><span class="wf-arrow-top"></span><span class="wf-arrow-bottom"></span></div><span class="wf-close"></span> <div class="wf-icons"> <div class="wf-icon wf-icon-phone wf-active"> <span class="wf-img"></span> <span>Звонок</span> </div><div class="wf-icon wf-icon-subscribe"> <span class="wf-img"></span> <span>Письмо</span> </div></div><div class="wf-body"><div class="wf-text wf-text-phone"> <span class="wf-text-item"><span>— Хотите,</span> чтобы мы перезвонили Вам и ответили на ваши вопросы?</span><form><div class="wf-select-time"><span class="wf-day"></span><span class="wf-select-time-text">в</span><span class="wf-time"></span></div><input class="required" type="text" name="phone" placeholder="Ваш телефон" value=""> <input type="submit" value="Отправить"></form></div><div class="wf-text wf-text-subscribe" style="display: none;"> <span class="wf-text-item"><span>— Приветствую вас!</span> хотите мы напишем Вам письмо?</span><form> <textarea class="required" name="message" placeholder="Напишите вопрос"  value=""></textarea> <input class="required" type="text" name="email" placeholder="Ваш E-mail(для ответа)" value=""> <input type="text" name="phone" placeholder="Ваш телефон(по желанию)"><input type="submit" value="Отправить"></form></div></div><div class="wf-powered-by"><a href="">Установите виджет к себе на сайт</a></div></div></div>');

      if(widgetOptions.position.hor == 'right') {
        $('.wf-widget').css('right', 0);
        $('.wf-widget-triangle').css('borderColor', 'transparent transparent transparent ' + widgetOptions.color).css('left', '83.7px');
        $('.wf-arrow').addClass('wf-arrow-left');
      } else {
        $('.wf-widget').css('left', 0);
        $('.wf-arrow')
        $('.wf-widget-triangle').css('borderColor', 'transparent '+ widgetOptions.color +' transparent transparent').css('right', '83.7px');
        $('.wf-arrow').addClass('wf-arrow-right');
      }

      $('.wf-widget-content').css(widgetOptions.position.hor, '-350px');
      widget.addDateTime();
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
      widget.showTime();
      widget.showDate();
      widget.sendForm();
    }
  };

  widget.run();
})();