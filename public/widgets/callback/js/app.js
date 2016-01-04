(function() {
  widgetCallback = function(options) {
    if ( typeof(options) == "undefined" || options == null ) { options = {}; };

    function extend() {
      for(var i=1; i<arguments.length; i++)
        for(var key in arguments[i])
          if(arguments[i].hasOwnProperty(key))
            arguments[0][key] = arguments[i][key];
      return arguments[0];
    }

    var callbackSettings = {
      options: extend({
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
        var height = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight;

        return height;
      },

      getDocumentHeightScrollTop: function() {
        var top = (document.documentElement && document.documentElement.scrollTop) || document.body.scrollTop;

        return top;
      }
    };

    var callbackOrder = {
      addOrder: function(params) {
        var xhr = new XMLHttpRequest(),
            body = '';

        if(params.type == 'call') {
          body = 'time='+ encodeURIComponent(params.time) +'&phone=' + encodeURIComponent(params.phone) +'&key='+ callbackSettings.options.key +'&type=call&url=' + encodeURIComponent(location.host);
        } else {
          body = 'email='+ encodeURIComponent(params.email) +'&phone=' + encodeURIComponent(params.phone) +'&message='+ encodeURIComponent(params.message) +'&key='+ callbackSettings.options.key +'&type=email&url=' + encodeURIComponent(location.host);
        }

        xhr.open("POST", callbackSettings.options.serverHost+"api/v1/orders", false);
        xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
        xhr.send(body);

        if(xhr.status == 200) {
          return {status: 'success', data: xhr.responseText};
        } else {
          return {status: 'error', data: xhr.responseText};
        }
      },

      sendForm: function() {
        var widget = document.getElementById('wf-widget'),
            required = widget.getElementsByClassName('required');

        function validateForm(form) {
              var form = widget.querySelector(form),
              required = form.getElementsByClassName('required'),
              error;

          for(var i = 0; i < required.length; i++) {
            if(!required[i].value || required[i].value == required[i].defaultValue ) {
              required[i].className = required[i].className + ' error';
              error = true;
            } else {
              required[i].className = required[i].className.replace(/\berror\b/, '');
            }
          };

          if (error) {
            return false;
          } else {
            return true;
          }
        }

        for(var i = 0; i < required.length; i++) {
          required[i].onkeyup = function(event) {
            if(!this.value || this.value == this.defaultValue ) {
              this.className = this.className + ' error';
            } else {
              this.className = this.className.replace(/\berror\b/, '');
            }
          };
        }

        $('.wf-text-phone form').submit(function(e) {
          e.preventDefault();

          var valid = validateForm('.wf-text-phone form');
          var callbackTime = $(e.target).find('.wf-day .active').data('server-day') +' в '+ $(e.target).find('.wf-time .active').data('server-time');

          if(valid) {
            var order = {
              time: callbackTime,
              phone: $(e.target).find('input[name="phone"]').val(),
              type: 'call'
            };

            var info = callbackOrder.addOrder(order);

            if(info.status != 'error') {
              var message = '<span>— Спасибо,</span>мы обязательно с вами свяжемся!';

              $('.wf-text-phone .wf-text-item').html(message);
              $(this).hide();
            } else {
              var message = '<span>— Извините,</span>произошла ошибка, мы уже знаем о ней, и исправим ее в ближайшее время.';

              $('.wf-text-phone .wf-text-item').html(message);
              $(this).hide();

              console.log(info.data);
            }
          }
        });

        $('.wf-text-subscribe form').submit(function(e) {
          e.preventDefault();

          var valid = validateForm('.wf-text-subscribe form');

          if(valid) {
            var order = {
              email: $(e.target).find('input[name="email"]').val(),
              phone: $(e.target).find('input[name="phone"]').val(),
              message: $(e.target).find('textarea[name="message"]').val(),
              type: 'email'
            };

            var info = callbackOrder.addOrder(order);

            if(info.status != 'error') {
              var message = '<span>— Спасибо,</span>мы обязательно с вами свяжемся!';

              $('.wf-text-subscribe .wf-text-item').html(message);
              $(this).hide();
            } else {
              var message = '<span>— Извините,</span>произошла ошибка, мы уже знаем о ней, и исправим ее в ближайшее время.';

              $('.wf-text-subscribe .wf-text-item').html(message);
              $(this).hide();

              console.log(info.data);
            }
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

        //if($.inArray(dayOfWeek, workDayArray) > -1) {
        if(workDayArray.indexOf(dayOfWeek) > -1) {
          sortDayArray.push(dayOfWeek);
        }

        for(var i = 0; i < callbackDate.settings.weekday.length; i++) {
          if(sortDayArray.length >= 4) { break; }
          var index = nextDay(dayOfWeek+i);


          //if($.inArray(index, workDayArray) > -1 && !($.inArray(index, sortDayArray) > -1)) {
          if(workDayArray.indexOf(index) > -1 && !(sortDayArray.indexOf(index) > -1)) {
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
            //day = [7, 1, 2, 3, 4, 5, 6],
            afterTomorrow = ((tomorrow+1) > 6) ? 1 : (tomorrow+1),
            monthNames = ["января", "февраля", "марта", "апреля", "мая", "июня","июля", "августа", "сентября", "октября", "ноября", "декабря"],
            selectDay = '',
            stringDay = '';

        for(var i = 0; i < sortDayArray.length; i++) {
          var weekdayDate = new Date(),
              //dayIndex = (weekdayDate.getDay() > day[sortDayArray[i]] ? (day[sortDayArray[i]] + 7) : day[sortDayArray[i]]) - weekdayDate.getDay();
              dayIndex = (weekdayDate.getDay() > sortDayArray[i] ? (sortDayArray[i] + 7) : sortDayArray[i]) - weekdayDate.getDay();

          weekdayDate.setDate(weekdayDate.getDate() + dayIndex);

          //if($.inArray(weekdayDate.getDay(), sortDayArray) > -1) {
          if(sortDayArray.indexOf(weekdayDate.getDay()) > -1) {
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

            selectDay += '<span '+ ((i == 0) ? 'class="wf-day-active"' : 'class="wf-day-item"') +' data-day="'+ weekDay[weekdayDate.getDay()] +'" data-server-day="'+ weekdayDate.getDate() +' '+ monthNames[weekdayDate.getMonth()] +'">'+ ((stringDay.length) ? stringDay : numberDay) +'</span>';
          }
        };

        return (selectDay.length) ? selectDay : false;
      },

      getListTime: function() {
        var widget = document.getElementById('wf-widget'),
            timeObj = {},
            weekDay = callbackDate.settings.weekday,
            sortDayArray = callbackDate.getSortDayArray(),
            timeWork = callbackSettings.options.time,
            widgetDay = widget.getElementsByClassName('wf-day-active'),
            data = widgetDay[0].dataset,
            daySelect = data.day,
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

          selectTime += '<span '+ ((i == 0) ? 'class="wf-time-active"' : 'class="wf-time-item"') +' data-server-time="'+ serverTime +'">'+ time +'</span>';
        }

        return selectTime;
      },

      showDate: function(date) {
        $('.wf-day').append(date);

        $('.wf-day').on('click', function() {
          if ($('.wf-day-show').length) {
            if($(event.target).hasClass('wf-day-item')) {
              $('.wf-day-active').addClass('wf-day-item').removeClass('wf-day-active');
              $(event.target).addClass('wf-day-active').removeClass('wf-day-item');

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
              $('.wf-time-active').addClass('wf-time-item').removeClass('wf-time-active');
              $(event.target).addClass('wf-time-active').removeClass('wf-time-item');
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
        var widget = document.getElementById('wf-widget');

        widget.style.height = callbackSettings.getWindowHeight();

        window.onresize = function(event) {
          widget.style.height = callbackSettings.getWindowHeight();
        };
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

        var widget = document.getElementById('wf-widget'),
            widgetCall = widget.getElementsByClassName('wf-widget-call');
        widgetCall[0].style.top = ver;
      },

      resizeWindow: function() {
        window.onresize = function(event) {
          callbackInit.setWidgetButtonPosition();
        };
      },

      scrollDocument: function() {
        window.onscroll = function(event) {
          callbackInit.setWidgetButtonPosition();
        };
      },

      rotateButtons: function(id) {
        var widget = document.getElementById('wf-widget'),
            nameIcon = widget.querySelector('.wf-widget-name-icon'),
            phoneIcon = widget.querySelector('.wf-widget-phone-icon');

        if(id) {
          window.clearInterval(intervalId);
        } else {
          var intervalId = window.setInterval(function() {
            if(nameIcon.classList.contains('wf-rotate-icon')) {
              nameIcon.classList.remove('wf-rotate-icon');
              phoneIcon.classList.add('wf-rotate-icon');
            } else {
              phoneIcon.classList.remove('wf-rotate-icon');
              nameIcon.classList.add('wf-rotate-icon');
            }
          }, callbackSettings.options.rotate.time);

          return parseInt(intervalId);
        }
      },

      hoverButton: function() {
      },

      showWidgetContentBlock: function() {
        document.getElementsByClassName('wf-widget-call')[0].onclick = function(event) {
          var widget = document.getElementById('wf-widget'),
              widgetContent = widget.getElementsByClassName('wf-widget-content');

          this.className = this.className + ' wf-hide';
          widgetContent[0].style[callbackSettings.options.position.hor] = 0;

          if(callbackSettings.options.sound) {
              var sound = document.getElementById("wf-open-one-audio");

              sound.volume = .2;
              sound.play();
          }
        };
      },

      hideWidgetContentBlock: function() {
        var widget = document.getElementById('wf-widget'),
            widgetContent = widget.getElementsByClassName('wf-widget-content'),
            widgetCall = widget.querySelector('.wf-widget-call');


        document.getElementsByClassName('wf-close')[0].onclick = function(event) {
          widgetCall.classList.remove('wf-hide');

          widgetContent[0].style[callbackSettings.options.position.hor] = '-350px';
        };

        document.getElementsByClassName('wf-arrow')[0].onclick = function(event) {
          widgetCall.classList.remove('wf-hide');

          widgetContent[0].style[callbackSettings.options.position.hor] = '-350px';
        };
      },

      changeTab: function() {
        var widget = document.getElementById('wf-widget'),
            widgetIcon = widget.getElementsByClassName('wf-icon'),
            widgetText = widget.getElementsByClassName('wf-text');

        for(var i = 0; i < widgetIcon.length; i++) {
          widgetIcon[i].onclick = function(event) {

            var hasClass = this.classList.contains('wf-icon-phone');

            if(hasClass === true) {
              widgetText[1].style.display = "none";
              widgetText[0].style.display = "block";
            } else {
              widgetText[0].style.display = "none";
              widgetText[1].style.display = "block";
            }

            widgetIcon[0].className = widgetIcon[0].className.replace(/\bwf-active\b/, '');
            widgetIcon[1].className = widgetIcon[1].className.replace(/\bwf-active\b/, '');

            this.className = this.className +' wf-active';
          };
        }
      },

      init: function() {
        var widgetBlock = '',
            widget = document.getElementById('wf-widget'),
            widgetContent = widget.getElementsByClassName('wf-widget-content'),
            widgetTriangle = widget.getElementsByClassName('wf-widget-triangle'),
            widgetArrow = widget.getElementsByClassName('wf-arrow');

        widgetBlock += '<div class="wf-widget-wrapper">';
          widgetBlock += '<div class="wf-widget-call" style="top: 0; '+ callbackSettings.options.position.hor +': 75px;">';
            widgetBlock += '<div class="wf-widget-bg" style="background: '+ callbackSettings.options.color +';">';
              widgetBlock += '<span class="wf-widget-triangle"></span>';
            widgetBlock += '</div>';
            widgetBlock += '<span class="wf-widget-icon wf-widget-name-icon wf-rotate-icon"></span>';
            widgetBlock += '<span class="wf-widget-icon wf-widget-phone-icon"></span>';
          widgetBlock += '</div>';
          widgetBlock += '<div class="wf-widget-content">';
            widgetBlock += '<div class="wf-arrow"><span class="wf-arrow-top"></span><span class="wf-arrow-bottom"></span></div>';
            widgetBlock += '<span class="wf-close"></span>';
            widgetBlock += '<div class="wf-icons">';
              widgetBlock += '<div class="wf-icon wf-icon-phone wf-active">';
                widgetBlock += '<span class="wf-img"></span>';
                widgetBlock += '<span>Звонок</span>';
              widgetBlock += '</div>';
              widgetBlock += '<div class="wf-icon wf-icon-subscribe">';
                widgetBlock += '<span class="wf-img"></span>';
                widgetBlock += '<span>Письмо</span>';
              widgetBlock += '</div>';
            widgetBlock += '</div>';
            widgetBlock += '<div class="wf-body">';
              widgetBlock += '<div class="wf-text wf-text-phone">';
                widgetBlock += '<span class="wf-text-item"></span>';
                widgetBlock += '<form>';
                  widgetBlock += '<div class="wf-select-time">';
                    widgetBlock += '<span class="wf-day"></span>';
                    widgetBlock += '<span class="wf-select-time-text">в</span>';
                    widgetBlock += '<span class="wf-time"></span>';
                  widgetBlock += '</div>';
                  widgetBlock += '<input class="required" type="text" name="phone" placeholder="Ваш телефон" value="">';
                  widgetBlock += '<input type="submit" value="Отправить">';
                widgetBlock += '</form>';
              widgetBlock += '</div>';
              widgetBlock += '<div class="wf-text wf-text-subscribe" style="display: none;">';
                widgetBlock += '<span class="wf-text-item"></span>';
                widgetBlock += '<form>';
                  widgetBlock += '<textarea class="required" name="message" placeholder="Напишите вопрос"  value=""></textarea>';
                  widgetBlock += '<input class="required" type="text" name="email" placeholder="Ваш E-mail(для ответа)" value="">';
                  widgetBlock += '<input type="text" name="phone" placeholder="Ваш телефон(по желанию)">';
                  widgetBlock += '<input type="submit" value="Отправить">';
                widgetBlock += '</form>';
              widgetBlock += '</div>';
            widgetBlock += '</div>';
            widgetBlock += '<div class="wf-powered-by"><a href="">Установите виджет к себе на сайт</a></div>';
          widgetBlock += '</div>';
        widgetBlock += '</div>';

        widget.innerHTML = widgetBlock;

        if(callbackSettings.options.position.hor == 'right') {
          widget.style.right = 0;
          widgetTriangle[0].style.borderColor = 'transparent transparent transparent '+ callbackSettings.options.color;
          widgetTriangle[0].style.left = '83px';
          widgetArrow[0].className = widgetArrow[0].className + ' wf-arrow-left';
        } else {
          widget.style.left = 0;
          widgetTriangle[0].style.borderColor = 'transparent '+ callbackSettings.options.color +' transparent transparent';
          widgetTriangle[0].style.right = '83px';
          widgetArrow[0].className = widgetArrow[0].className + ' wf-arrow-right';
        }

        widgetContent[0].style[callbackSettings.options.position.hor] = '-350px';
        widgetContent[0].className = widgetContent[0].className + ' wf-schema-'+callbackSettings.options.schema;


        widget.querySelector('.wf-text-phone .wf-text-item').innerHTML = '<span>'+ callbackSettings.options.texts.call.text1.title +'</span> '+ callbackSettings.options.texts.call.text1.body;
        widget.querySelector('.wf-text-subscribe .wf-text-item').innerHTML = '<span>'+ callbackSettings.options.texts.email.text1.title +'</span> '+ callbackSettings.options.texts.email.text1.body;

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
        var id = callbackInit.rotateButtons();
        callbackInit.hoverButton(id);

        callbackOrder.sendForm();
      }
    };

    return {
      on: callbackInit.init
    };
  };

  var widget = document.getElementById('wf-widget'),
      data = widget.dataset,
      color = data.color,
      schema = data.schema,
      pos = data.position,
      positionHor = pos.split("-")[0],
      positionVer = pos.split("-")[1],
      time  = JSON.parse(data.time),
      sound = data.sound,
      key = data.key;

  var wcb = widgetCallback({color: color, schema : schema, position: {hor: positionHor, ver: positionVer}, time: time, sound: sound, key: key, serverHost: 'http://localhost:3000/'});
  wcb.on();
})();