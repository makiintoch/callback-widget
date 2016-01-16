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
        scenarios: {
          first: {status: false},
          second: {status: false, time: '8'},
          third: {status: false, time: '2'},
          fourth: {status: false},
          fifth: {status: false}
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
      },

      showText: function(text) {
        return text;
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
            required = widget.getElementsByClassName('required'),
            phoneForm = widget.querySelector('.wf-text-phone form'),
            subscribeForm = widget.querySelector('.wf-text-subscribe form');

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

        phoneForm.onsubmit = function(event) {
          event.preventDefault();

          var widgetDay = widget.querySelector('.wf-day .wf-day-active'),
              widgetTime = widget.querySelector('.wf-time .wf-time-active'),
              inputPhone = widget.querySelector('.wf-text-phone form input[name="phone"]'),
              widgetTextPhone = widget.querySelector('.wf-text-phone .wf-text-item');

          var valid = validateForm('.wf-text-phone form');
          var callbackTime = widgetDay.dataset.serverDay +' в '+ widgetTime.dataset.serverTime;

          if(valid) {
            var order = {
              time: callbackTime,
              phone: inputPhone.value,
              type: 'call'
            };

            var info = callbackOrder.addOrder(order);

            if(info.status != 'error') {
              var message = '<span>— Спасибо,</span>мы обязательно с вами свяжемся! <span class="wf-cursor">_</span>';

              widgetTextPhone.innerHTML = message;
            } else {
              var message = '<span>— Извините,</span>произошла ошибка, мы уже знаем о ней, и исправим ее в ближайшее время. <span class="wf-cursor">_</span>';

              widgetTextPhone.innerHTML = message;
              console.log(info.data);
            }

            phoneForm.style.display = 'none';
          }
        };

        subscribeForm.onsubmit = function(event) {
          event.preventDefault();

          var valid = validateForm('.wf-text-subscribe form'),
              inputEmail = widget.querySelector('.wf-text-subscribe form input[name="email"]'),
              inputPhone = widget.querySelector('.wf-text-subscribe form input[name="phone"]'),
              inputMessage = widget.querySelector('.wf-text-subscribe form textarea[name="message"]'),
              widgetTextSubscribe = widget.querySelector('.wf-text-subscribe .wf-text-item');

          if(valid) {
            var order = {
              email: inputEmail.value,
              phone: inputPhone.value,
              message: inputMessage.value,
              type: 'email'
            };

            var info = callbackOrder.addOrder(order);

            if(info.status != 'error') {
              var message = '<span>— Спасибо,</span>мы обязательно с вами свяжемся! <span class="wf-cursor">_</span>';

              widgetTextSubscribe.innerHTML = message;
            } else {
              var message = '<span>— Извините,</span>произошла ошибка, мы уже знаем о ней, и исправим ее в ближайшее время. <span class="wf-cursor">_</span>';

              widgetTextSubscribe.innerHTML = message;
              console.log(info.data);
            }

            subscribeForm.style.display = 'none';
          }
        };
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

        if(workDayArray.indexOf(dayOfWeek) > -1) {
          sortDayArray.push(dayOfWeek);
        }

        for(var i = 0; i < callbackDate.settings.weekday.length; i++) {
          if(sortDayArray.length >= 4) { break; }
          var index = nextDay(dayOfWeek+i);

          if(workDayArray.indexOf(index) > -1 && !(sortDayArray.indexOf(index) > -1)) {
            sortDayArray.push(index);
          }
        }

        return sortDayArray;
      },

      getListDay: function() {
        var date = new Date(),
            dayOfWeek = date.getDay(),
            tomorrow = ((dayOfWeek+1) > 6) ? 0 : (dayOfWeek+1),
            weekDay = callbackDate.settings.weekday,
            sortDayArray = callbackDate.getSortDayArray(),
            //day = [7, 1, 2, 3, 4, 5, 6],
            afterTomorrow = ((tomorrow+1) > 6) ? 0 : (tomorrow+1),
            monthNames = ["января", "февраля", "марта", "апреля", "мая", "июня","июля", "августа", "сентября", "октября", "ноября", "декабря"],
            selectDay = '<div class="wf-day-show">',
            activeDay = '',
            stringDay = '';

        for(var i = 0; i < sortDayArray.length; i++) {
          var weekdayDate = new Date(),
              //dayIndex = (weekdayDate.getDay() > day[sortDayArray[i]] ? (day[sortDayArray[i]] + 7) : day[sortDayArray[i]]) - weekdayDate.getDay();
              dayIndex = (weekdayDate.getDay() > sortDayArray[i] ? (sortDayArray[i] + 7) : sortDayArray[i]) - weekdayDate.getDay();

          weekdayDate.setDate(weekdayDate.getDate() + dayIndex);

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

            activeDay += (i == 0) ? '<span class="wf-day-active" data-day="'+ weekDay[weekdayDate.getDay()]+'" data-server-day="'+ weekdayDate.getDate() +' '+ monthNames[weekdayDate.getMonth()] +'">'+ ((stringDay.length) ? stringDay : numberDay) +'</span>' : '';
            selectDay += '<span class="wf-day-item" data-day="'+ weekDay[weekdayDate.getDay()] +'" data-server-day="'+ weekdayDate.getDate() +' '+ monthNames[weekdayDate.getMonth()] +'">'+ ((stringDay.length) ? stringDay : numberDay) +'</span>';
          }
        };

        selectDay += '</div>';

        return (selectDay.length) ? (activeDay+selectDay) : false;
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
            activeTime = '',
            selectTime = '<div class="wf-time-show"><ul>',
            date = new Date(),
            utcServer = callbackSettings.options.serverUtc,
            utcClient = date.getTimezoneOffset() / 60,
            utc = (parseFloat(utcServer) + parseFloat(utcClient));

        for(var i = 0; i < sortDayArray.length; i++) {
          if(i >= 4) { break; }

          var arr = new Array(),
              startTime = new Date(),
              endTime = new Date();

          if(sortDayArray[i] == date.getDay()) {
            var start = timeWork[weekDay[sortDayArray[i]]].start.split(":"),
                end = timeWork[weekDay[sortDayArray[i]]].end.split(":");

            startTime.setHours(date.getHours()+1);
            startTime.setMinutes(start[1]);
            //startTime.setTime(startTime.getTime() - (utc*60*60*1000));
          } else {
            var start = timeWork[weekDay[sortDayArray[i]]].start.split(":"),
                end = timeWork[weekDay[sortDayArray[i]]].end.split(":");

            startTime.setHours(start[0]);
            startTime.setMinutes(start[1]);
            startTime.setTime(startTime.getTime() - (utc*60*60*1000));
          }

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

          activeTime += (i == 0) ? '<span class="wf-time-active" data-server-time="'+ serverTime +'">'+ time +'</span>' : '';
          selectTime += '<li class="wf-time-item" data-server-time="'+ serverTime +'">'+ time +'</li>';
        };

        selectTime += '</ul></div>';

        return (activeTime+selectTime);
      },

      showDate: function(day) {
        var widget = document.getElementById('wf-widget'),
            widgetDay = widget.querySelector('.wf-day'),
            widgetTime = widget.querySelector('.wf-time');

        widgetDay.innerHTML = day;

        var widgetDayActive = widget.querySelector('.wf-day .wf-day-active'),
            widgetDayShow = widget.querySelector('.wf-day-show');

        widgetDayActive.onclick = function(event) {
          var widgetDayItem = widget.getElementsByClassName('wf-day-item');

          if(widgetDayShow.style.display == 'block') {
            widgetDayShow.style.display = 'none';
          } else {
            widgetDayShow.style.display = 'block';
          }

          for(var i = 0; i < widgetDayItem.length; i++) {
            widgetDayItem[i].onclick = function() {
              widgetDayActive.dataset.day = this.dataset.day;
              widgetDayActive.dataset.serverDay = this.dataset.serverDay;
              widgetDayActive.innerText = this.innerText;

              widgetDayShow.style.display = 'none';

              callbackDate.showTime(callbackDate.getListTime());
            };
          }
        };
      },

      showTime: function(time) {
        var widget = document.getElementById('wf-widget'),
            widgetTime = widget.querySelector('.wf-time');

        widgetTime.innerHTML = time;

        var widgetTimeActive = widget.querySelector('.wf-time .wf-time-active'),
            widgetTimeShow = widget.querySelector('.wf-time .wf-time-show');

        widgetTimeActive.onclick = function(event) {
          var widgetTimeItem = widget.getElementsByClassName('wf-time-item');

          if(widgetTimeShow.style.display == 'block') {
            widgetTimeShow.style.display = 'none';
          } else {
            widgetTimeShow.style.display = 'block';
          }

          for(var i =  0; i < widgetTimeItem.length; i++) {
            widgetTimeItem[i].onclick = function(event) {
              widgetTimeActive.dataset.serverTime = this.dataset.serverTime;
              widgetTimeActive.innerText = this.innerText;

              widgetTimeShow.style.display = 'none';
            };
          };
        };
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
        var widget = document.getElementById('wf-widget'),
            windowHeight = callbackSettings.getWindowHeight(),
            documentScrollHeight = callbackSettings.getDocumentHeightScrollTop(),
            widgetCall = widget.getElementsByClassName('wf-widget-call'),
            widgetCallContent = widget.querySelector('.wf-widget-content '),
            widgetBody = widget.querySelector('.wf-body'),
            widgetTimeText = widget.querySelector('.wf-select-time-text');

        switch(callbackSettings.options.position.ver) {
          case 'top':
            var ver = 100 + documentScrollHeight + 'px';
            break;
          case 'center':
            var ver = (windowHeight - (windowHeight/2 + 45)) + documentScrollHeight + 'px';
            break;
          case 'bottom':
            var ver = (windowHeight - 200) + documentScrollHeight + 'px';
            break;
        }

        widgetCall[0].style.top = ver;

        if(windowHeight < 500) {
          widgetBody.style.marginTop = '10%';
          widgetCallContent.style.overflowY = 'scroll';
        } else {
          widgetBody.style.marginTop = (((windowHeight - widgetBody.clientHeight) / 2) - 150) +'px';
          widgetCallContent.style.overflowY = 'visible';
        }
      },

      resizeWindow: function() {
        var timer = null;

        window.onresize = function(event) {
          if(timer !== null) { clearTimeout(timer) };

          var timer = setTimeout(function() {
            callbackInit.setWidgetButtonPosition();
          }, 250);
        };
      },

      scrollDocument: function() {
        var timer = null;

        window.onscroll = function(event) {
          if(timer !== null) { clearTimeout(timer) };

          var timer = setTimeout(function() {
            callbackInit.setWidgetButtonPosition();
          }, 100);
        };
      },

      rotateButtons: function() {
        var widget = document.getElementById('wf-widget'),
            widgetIcon = widget.querySelector('.wf-widget-call'),
            nameIcon = widget.querySelector('.wf-widget-name-icon'),
            phoneIcon = widget.querySelector('.wf-widget-phone-icon'),
            interval = '';

        function setButtonInterval() {
          var intervalId = window.setInterval(function() {
            if(nameIcon.classList.contains('wf-rotate-icon')) {
              nameIcon.classList.remove('wf-rotate-icon');
              phoneIcon.classList.add('wf-rotate-icon');
            } else {
              phoneIcon.classList.remove('wf-rotate-icon');
              nameIcon.classList.add('wf-rotate-icon');
            }
          }, callbackSettings.options.rotate.time);

          return intervalId;
        }

        interval = setButtonInterval();

        widgetIcon.onmouseover = function(event) {
          window.clearInterval(interval);
          widgetIcon.classList.add('wf-widget-call-hover');

          if(phoneIcon.classList.contains('wf-rotate-icon')) {
            phoneIcon.classList.remove('wf-rotate-icon');
            nameIcon.classList.add('wf-rotate-icon');
          }
        };

        widgetIcon.onmouseout = function(event) {
          interval = setButtonInterval();
          widgetIcon.classList.remove('wf-widget-call-hover');
        };
      },

      showWidgetContentBlock: function() {
        document.getElementsByClassName('wf-widget-call')[0].onclick = function(event) {
          var widget = document.getElementById('wf-widget'),
              widgetContent = widget.getElementsByClassName('wf-widget-content');

          this.className = this.className + ' wf-hide';
          widgetContent[0].style[callbackSettings.options.position.hor] = 0;

          if(callbackSettings.options.sound == 'true') {
              var sound = document.getElementById("wf-open-one-audio");

              sound.volume = .2;
              sound.play();
          };
        };
      },

      hideWidgetContentBlock: function() {
        var widget = document.getElementById('wf-widget'),
            widgetContent = widget.getElementsByClassName('wf-widget-content'),
            widgetCall = widget.querySelector('.wf-widget-call');


        document.getElementsByClassName('wf-close')[0].onclick = function(event) {
          widgetCall.classList.remove('wf-hide');

          widgetContent[0].style[callbackSettings.options.position.hor] = '-375px';
        };

        document.getElementsByClassName('wf-arrow')[0].onclick = function(event) {
          widgetCall.classList.remove('wf-hide');

          widgetContent[0].style[callbackSettings.options.position.hor] = '-375px';
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

      runScenarios: function() {
        var scenarios = callbackSettings.options.scenarios;

        function showWidget() {
          var widget = document.getElementById('wf-widget'),
              widgetCall = widget.querySelector('.wf-widget-call'),
              widgetContent = widget.getElementsByClassName('wf-widget-content');

          if(widgetContent[0].style[callbackSettings.options.position.hor] != '0px') {
            widgetCall.className = widgetCall.className + ' wf-hide';
            widgetContent[0].style[callbackSettings.options.position.hor] = 0;

            if (callbackSettings.options.sound == 'true') {
              var sound = document.getElementById("wf-open-one-audio");

              sound.volume = .2;
              sound.play();
            };
          }
        };

        function getCookie(name) {
          var matches = document.cookie.match(new RegExp(
            "(?:^|; )" + name.replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g, '\\$1') + "=([^;]*)"
          ));
          return matches ? decodeURIComponent(matches[1]) : undefined;
        }

        if (scenarios.first.status) {
          if (!getCookie('scenariosFirstStatus')) {
            showWidget();

            document.cookie = "scenariosFirstStatus=true; path=/;";
          };
        };

        if (scenarios.second.status) {
          if (!getCookie('scenariosSecondStatus')) {
            var time = parseFloat(scenarios.second.time);
            setTimeout(showWidget, (time * 60 * 1000));
          };

          document.cookie = "scenariosSecondStatus=true; path=/;";
        };

        if (scenarios.third.status) {
          var time = parseFloat(scenarios.third.time);

          var timerId = setInterval(showWidget, (time * 60 * 1000));
        };

        if (scenarios.fourth.status) {
          if (getCookie('startPage') == undefined) {
            document.cookie = "startPage="+window.location.href+"; path=/;";  
          };
          
          if (getCookie('startPage') != window.location.href) {
            if (!getCookie('scenariosFourthStatus')) {
              showWidget();  
            };

            document.cookie = "scenariosFourthStatus=true; path=/;";
          };
        };

        if (scenarios.fifth.status) {
          window.addEventListener('scroll', function(event) {
            if ((window.innerHeight + window.scrollY) >= document.body.offsetHeight) {
              if (!getCookie('scenariosFifthStatus')) {
                showWidget();  
              };

              document.cookie = "scenariosFifthStatus=true; path=/;";
            };
          }, false);
        };
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

        widgetContent[0].style[callbackSettings.options.position.hor] = '-375px';
        widgetContent[0].className = widgetContent[0].className + ' wf-schema-'+callbackSettings.options.schema;


        widget.querySelector('.wf-text-phone .wf-text-item').innerHTML = '<span>'+ callbackSettings.showText(callbackSettings.options.texts.call.text1.title) +'</span> '+ callbackSettings.showText(callbackSettings.options.texts.call.text1.body) +' <span class="wf-cursor">_</span>';
        widget.querySelector('.wf-text-subscribe .wf-text-item').innerHTML = '<span>'+ callbackSettings.options.texts.email.text1.title +'</span> '+ callbackSettings.options.texts.email.text1.body +' <span class="wf-cursor">_</span>';

        var day = callbackDate.getListDay();
        callbackDate.showDate(day);

        var time = callbackDate.getListTime();
        callbackDate.showTime(time);

        callbackInit.setWidgetButtonPosition();
        callbackInit.resizeWindow();
        callbackInit.scrollDocument();
        callbackInit.showWidgetContentBlock();
        callbackInit.hideWidgetContentBlock();
        callbackInit.changeTab();
        callbackInit.rotateButtons();
        callbackInit.runScenarios();
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
      scenarios  = JSON.parse(data.scenarios),
      sound = data.sound,
      key = data.key;

  var wcb = widgetCallback({color: color, schema : schema, position: {hor: positionHor, ver: positionVer}, time: time, scenarios: scenarios, sound: sound, key: key, serverHost: 'http://calling-all.meteor.com/'});
  wcb.on();
})();