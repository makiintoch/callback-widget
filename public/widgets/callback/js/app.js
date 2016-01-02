(function($){
  $.widgetCallback = function(options) {
    if ( typeof(options) == "undefined" || options == null ) { options = {}; };

    var callbackSettings = {
      options: $.extend({
        texts: {
          call: {
            text1: {title: '— Хотите,', body: 'чтобы мы перезвонили Вам и ответили на ваши вопросы?'}
          },
          email: {
            text1: {title: '— Приветствую вас!', body: 'хотите мы напишем Вам письмо?'}
          },
          send: {
            text1: {title: '— Спасибо,', body: 'мы обязательно с вами свяжемся!'}
          }
        },
        rotate: {time: 4000},
        color: '#1f86c2',
        schema: 'gray',
        position: {hor: 'right', ver: 'bottom'},
        time: {
          mon: {start: '09:00', end: '19:00', status: true},
          tue: {start: '09:00', end: '19:00', status: true},
          wed: {start: '09:00', end: '19:00', status: true},
          thu: {start: '09:00', end: '19:00', status: true},
          fri: {start: '09:00', end: '19:00', status: true},
          sat: {start: '09:00', end: '19:00', status: true},
          sun: {start: '09:00', end: '19:00', status: true}
        },
        serverUtc: '+3',
        sound: false
      }, options),

      getWindowHeight: function() {
        return $(window).height();
      },

      getDocumentHeightScrollTop: function() {
        return document.body.scrollTop;
      }
    };

    var callbackOrder = {
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

            var info = callbackOrder.addOrder(order);

            var message = '<span>— Спасибо,</span>мы обязательно с вами свяжемся!';

            $('.wf-text-phone .wf-text-item').html(message);
            $(this).hide();
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

            var info = callbackOrder.addOrder(order);

            var message = '<span>— Спасибо,</span>мы обязательно с вами свяжемся!';

            $('.wf-text-subscribe .wf-text-item').html(message);
            $(this).hide();
          }
        });
      }
    }

    var callbackDate = {
      settings: {
        weekday: ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat'],
        getNextDay: function(day) {
          return (day > 6) ? (day - 7) : day;
        }
      },

      getWorkDayArray: function() {
        var workDayArray = new Array(),
            weekDay = callbackDate.settings.weekday,
            timeWork = callbackSettings.options.time,
            date = new Date(),
            utcServer = callbackSettings.options.serverUtc,
            utcClient = date.getTimezoneOffset() / 60,
            utc = (parseFloat(utcServer) + parseFloat(utcClient));

        for (var i = 0; i < weekDay.length; i++) {

          if (timeWork[weekDay[i]].status) {
            if(weekDay[date.getDay()] == weekDay[i]) {

              var endTime = new Date(),
                  end = timeWork[weekDay[i]].end.split(":");

              endTime.setHours(end[0]);
              endTime.setMinutes(end[1]);
              endTime.setTime(endTime.getTime() - (utc*60*60*1000));

              if(date <= endTime) {
                workDayArray.push(i);
              }
            } else {
              workDayArray.push(i);
            }
          };
        };

        return workDayArray;
      },

      getSortDayArray: function() {
        var date = new Date(),
            workDayArray = callbackDate.getWorkDayArray(),
            nextDay = callbackDate.settings.getNextDay,
            dayOfWeek = date.getDay(),
            sortDayArray = new Array();

        if($.inArray(dayOfWeek, workDayArray) > -1) {
          sortDayArray.push(dayOfWeek);
        }

        for(var i = 0; i < callbackDate.settings.weekday.length; i++) {
          if(sortDayArray.length >= 4) { break; }
          var index = nextDay(dayOfWeek+i);

          if($.inArray(index, workDayArray) > -1 && !($.inArray(index, sortDayArray) > -1)) {
            sortDayArray.push(index);
          }
        }

        return sortDayArray;
      },

      getListDay: function() {
        var date = new Date(),
            dayOfWeek = date.getDay(),
            tomorrow = ((dayOfWeek+1) > 6) ? 1 : (dayOfWeek+1),
            weekDay = callbackDate.settings.weekday,
            sortDayArray = callbackDate.getSortDayArray(),
            day = [7, 1, 2, 3, 4, 5, 6],
            afterTomorrow = ((tomorrow+1) > 6) ? 1 : (tomorrow+1),
            monthNames = ["января", "февраля", "марта", "апреля", "мая", "июня","июля", "августа", "сентября", "октября", "ноября", "декабря"],
            selectDay = '',
            stringDay = '';

        for(var i = 0; i < sortDayArray.length; i++) {
          var weekdayDate = new Date(),
              dayIndex = (weekdayDate.getDay() > day[sortDayArray[i]] ? (day[sortDayArray[i]] + 7) : day[sortDayArray[i]]) - weekdayDate.getDay();

          weekdayDate.setDate(weekdayDate.getDate() + dayIndex);

          if($.inArray(weekdayDate.getDay(), sortDayArray) > -1) {

            var numberDay = weekdayDate.getDate() +' '+ monthNames[weekdayDate.getMonth()];

            if(dayOfWeek == weekdayDate.getDay()) {
              stringDay = 'Сегодня';
            } else if(tomorrow == weekdayDate.getDay()) {
              stringDay = 'Завтра';
            } else if(afterTomorrow == weekdayDate.getDay()) {
              stringDay = 'Послезавтра';
            } else {
              stringDay = '';
            }

            selectDay += '<span '+ ((i == 0) ? 'class="active"' : 'class="wf-day-item"') +' data-day="'+ weekDay[weekdayDate.getDay()] +'" data-server-day="'+ weekdayDate.getDate() +' '+ monthNames[weekdayDate.getMonth()] +'">'+ ((stringDay.length) ? stringDay : numberDay) +'</span>';
          }
        };

        return (selectDay.length) ? selectDay : false;
      },

      getListTime: function() {
        var timeObj = {},
            weekDay = callbackDate.settings.weekday,
            sortDayArray = callbackDate.getSortDayArray(),
            timeWork = callbackSettings.options.time,
            daySelect = $('.wf-day .active').data('day'),
            selectTime = '',
            date = new Date(),
            utcServer = callbackSettings.options.serverUtc,
            utcClient = date.getTimezoneOffset() / 60,
            utc = (parseFloat(utcServer) + parseFloat(utcClient));

        for(var i = 0; i < sortDayArray.length; i++) {
          if(i >= 4) { break; }

          var arr = new Array(),
              startTime = new Date(),
              endTime = new Date();

          var start = timeWork[weekDay[sortDayArray[i]]].start.split(":"),
              end = timeWork[weekDay[sortDayArray[i]]].end.split(":");

          startTime.setHours(start[0]);
          startTime.setMinutes(start[1]);
          startTime.setTime(startTime.getTime() - (utc*60*60*1000));

          endTime.setHours(end[0]);
          endTime.setMinutes(end[1]);
          endTime.setTime(endTime.getTime() - (utc*60*60*1000));

          for (var start = startTime; start <= endTime; start.setMinutes(start.getMinutes() + 60)) {
            arr.push(new Date(start));
          }

          timeObj[weekDay[sortDayArray[i]]] = arr;
        }

        for(var i = 0; i < timeObj[daySelect].length; i++) {
          var time = (timeObj[daySelect][i].getHours() < 10 ? '0'+timeObj[daySelect][i].getHours() : timeObj[daySelect][i].getHours()) +':'+ (timeObj[daySelect][i].getMinutes() < 10 ? '0'+timeObj[daySelect][i].getMinutes() : timeObj[daySelect][i].getMinutes());

          timeObj[daySelect][i].setTime(timeObj[daySelect][i].getTime() + (utc*60*60*1000));
          var serverTime = (timeObj[daySelect][i].getHours() < 10 ? '0'+timeObj[daySelect][i].getHours() : timeObj[daySelect][i].getHours()) +':'+ (timeObj[daySelect][i].getMinutes() < 10 ? '0'+timeObj[daySelect][i].getMinutes() : timeObj[daySelect][i].getMinutes());

          selectTime += '<span '+ ((i == 0) ? 'class="active"' : 'class="wf-time-item"') +' data-server-time="'+ serverTime +'">'+ time +'</span>';
        }

        return selectTime;
      },

      showDate: function(date) {
        $('.wf-day').append(date);

        $('.wf-day').on('click', function() {
          if ($('.wf-day-show').length) {
            if($(event.target).hasClass('wf-day-item')) {
              $('.wf-day .active').addClass('wf-day-item').removeClass('active');
              $(event.target).addClass('active').removeClass('wf-day-item');

              var time = callbackDate.getListTime();
              $('.wf-time').empty();
              $('.wf-time').append(time);
            }

            var child = $('.wf-day-show').children();

            $('.wf-day-show').remove();
            child.appendTo('.wf-day');
          } else {
            $(".wf-day .wf-day-item").wrapAll("<span class='wf-day-show'></span>");
          }
        });
      },

      showTime: function(time) {
        $('.wf-time').append(time);

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
      }
    }

    var callbackInit = {
      setWidgetHeight: function() {
        $('#wf-widget').css('height', callbackSettings.getWindowHeight());

        $(window).resize(function() {
          $('#wf-widget').css('height', callbackSettings.getWindowHeight());
        });
      },

      setWidgetButtonPosition: function() {
        var windowHeight = callbackSettings.getWindowHeight(),
            documentScrollHeight = callbackSettings.getDocumentHeightScrollTop();

        switch(callbackSettings.options.position.ver) {
          case 'top':
            var ver = '50px';
            break;
          case 'center':
            var ver = (windowHeight - (windowHeight/2 + 45)) + documentScrollHeight + 'px';
            break;
          case 'bottom':
            var ver = (windowHeight - 150) + documentScrollHeight + 'px';
            break;
        }

        $('#wf-widget .wf-widget-call').css('top', ver);
      },

      resizeWindow: function() {
        $(window).resize(function() {
          callbackInit.setWidgetButtonPosition();
        });
      },

      scrollDocument: function() {
        $(window).scroll(function() {
          callbackInit.setWidgetButtonPosition();
        });
      },

      rotateButtons: function(clear) {
        var intervalId = setInterval(function() {
          if($('#wf-widget .wf-widget-name-icon').hasClass('wf-rotate-icon')) {
            $('#wf-widget .wf-widget-name-icon').removeClass('wf-rotate-icon');
            $('#wf-widget .wf-widget-phone-icon').addClass('wf-rotate-icon');
          } else {
            $('#wf-widget .wf-widget-phone-icon').removeClass('wf-rotate-icon');
            $('#wf-widget .wf-widget-name-icon').addClass('wf-rotate-icon');
          }
        }, callbackSettings.options.rotate.time);

        if(clear) {
          clearTimeout(intervalId);
        }
      },

      showWidgetContentBlock: function() {
        $('#wf-widget .wf-widget-call').on('click', function() {
          $(this).addClass('wf-hide');
          $('#wf-widget .wf-widget-content').css(callbackSettings.options.position.hor, 0);
        });
      },

      hideWidgetContentBlock: function() {
        $('#wf-widget .wf-close, #wf-widget .wf-arrow ').on('click', function() {
          $('#wf-widget .wf-widget-call').removeClass('wf-hide');
          $('#wf-widget .wf-widget-content').css(callbackSettings.options.position.hor, '-350px');
        });
      },

      changeTab: function() {
        $('#wf-widget .wf-icon').on('click', function() {
          var index = $(this).index();

          $('#wf-widget .wf-icon').removeClass('wf-active');
          $(this).addClass('wf-active');
          $('#wf-widget .wf-body .wf-text ').css('display', 'none');
          $('#wf-widget .wf-body .wf-text ').eq(index).css('display', 'block');
        });
      },

      init: function() {
        var widget = '';

        widget += '<div class="wf-widget-wrapper">';
          widget += '<div class="wf-widget-call" style="top: 0; '+ callbackSettings.options.position.hor +': 75px;">';
            widget += '<div class="wf-widget-bg" style="background: '+ callbackSettings.options.color +';">';
              widget += '<span class="wf-widget-triangle"></span>';
            widget += '</div>';
            widget += '<span class="wf-widget-icon wf-widget-name-icon wf-rotate-icon"></span>';
            widget += '<span class="wf-widget-icon wf-widget-phone-icon"></span>';
          widget += '</div>';
          widget += '<div class="wf-widget-content">';
            widget += '<div class="wf-arrow"><span class="wf-arrow-top"></span><span class="wf-arrow-bottom"></span></div>';
            widget += '<span class="wf-close"></span>';
            widget += '<div class="wf-icons">';
              widget += '<div class="wf-icon wf-icon-phone wf-active">';
                widget += '<span class="wf-img"></span>';
                widget += '<span>Звонок</span>';
              widget += '</div>';
              widget += '<div class="wf-icon wf-icon-subscribe">';
                widget += '<span class="wf-img"></span>';
                widget += '<span>Письмо</span>';
              widget += '</div>';
            widget += '</div>';
            widget += '<div class="wf-body">';
              widget += '<div class="wf-text wf-text-phone">';
                widget += '<span class="wf-text-item"></span>';
                widget += '<form>';
                  widget += '<div class="wf-select-time">';
                    widget += '<span class="wf-day"></span>';
                    widget += '<span class="wf-select-time-text">в</span>';
                    widget += '<span class="wf-time"></span>';
                  widget += '</div>';
                  widget += '<input class="required" type="text" name="phone" placeholder="Ваш телефон" value="">';
                  widget += '<input type="submit" value="Отправить">';
                widget += '</form>';
              widget += '</div>';
              widget += '<div class="wf-text wf-text-subscribe" style="display: none;">';
                widget += '<span class="wf-text-item"></span>';
                widget += '<form>';
                  widget += '<textarea class="required" name="message" placeholder="Напишите вопрос"  value=""></textarea>';
                  widget += '<input class="required" type="text" name="email" placeholder="Ваш E-mail(для ответа)" value="">';
                  widget += '<input type="text" name="phone" placeholder="Ваш телефон(по желанию)">';
                  widget += '<input type="submit" value="Отправить">';
                widget += '</form>';
              widget += '</div>';
            widget += '</div>';
            widget += '<div class="wf-powered-by"><a href="">Установите виджет к себе на сайт</a></div>';
          widget += '</div>';
        widget += '</div>';

        $('#wf-widget').append(widget);

        if(callbackSettings.options.position.hor == 'right') {
          $('#wf-widget').css('right', 0);
          $('#wf-widget .wf-widget-triangle').css('borderColor', 'transparent transparent transparent '+ callbackSettings.options.color).css('left', '83px');
          $('#wf-widget .wf-arrow').addClass('wf-arrow-left');
        } else {
          $('#wf-widget').css('left', 0);
          $('#wf-widget .wf-widget-triangle').css('borderColor', 'transparent '+ callbackSettings.options.color +' transparent transparent').css('right', '83px');
          $('#wf-widget .wf-arrow').addClass('wf-arrow-right');
        }

        $('#wf-widget .wf-widget-content').css(callbackSettings.options.position.hor, '-350px');
        $('#wf-widget .wf-widget-content').addClass('wf-schema-'+callbackSettings.options.schema);
        $('#wf-widget .wf-text-phone .wf-text-item').append('<span>'+ callbackSettings.options.texts.call.text1.title +'</span> '+ callbackSettings.options.texts.call.text1.body);
        $('#wf-widget .wf-text-subscribe .wf-text-item').append('<span>'+ callbackSettings.options.texts.email.text1.title +'</span> '+ callbackSettings.options.texts.email.text1.body);

        var date = callbackDate.getListDay();
        callbackDate.showDate(date);
        var time = callbackDate.getListTime();
        callbackDate.showTime(time);

        callbackInit.setWidgetButtonPosition();
        callbackInit.resizeWindow();
        callbackInit.scrollDocument();
        callbackInit.showWidgetContentBlock();
        callbackInit.hideWidgetContentBlock();
        callbackInit.changeTab();

        callbackOrder.sendForm();
      }
    };

    return {
      on: callbackInit.init,
      rotate: callbackInit.rotateButtons
    };
  };

  var widgetTag = $('#wf-widget'),
    color = widgetTag.data('color'),
    schema = widgetTag.data('schema'),
    pos = widgetTag.data('position'),
    positionHor = pos.split("-")[0],
    positionVer = pos.split("-")[1],
    time  = widgetTag.data('time'),
    sound = widgetTag.data('sound');

  var wcb = $.widgetCallback({color: color, schema : schema, position: {hor: positionHor, ver: positionVer}, time: time, sound: sound});
  wcb.on();
  wcb.rotate();

})(jQuery);