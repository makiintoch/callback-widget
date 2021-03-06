var ApiV1 = new Restivus({
  version: 'v1',
  defaultHeaders: {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin' : "*"
  },
  prettyJson: true
});

ApiV1.addCollection(Orders, {
  excludedEndpoints: ['get', 'getAll', 'put', 'deleteAll', 'delete'],
  endpoints: {
    post: {
      action: function() {
        var params = this.bodyParams,
            message = '',
            widget = Widgets.findOne({'key': params.key}),
            crypto = Npm.require('crypto');

        var widgetUrl = widget.url,
            clientUrl = params.url;

        if(widgetUrl.indexOf(clientUrl) > -1) {
        //if(true) {
          var order = _.extend(params, {
            widgetId: widget._id,
            userId: widget.userId,
            createdAt: new Date(),
            status: false
          });

          var orderId = Orders.insert(order);
        } else {
          //Meteor.call('sendEmail', {email: userEmail, subject: 'Ошибки в работе сервиса', message: 'Ошибка'});

          return {
            statusCode: 500,
            headers: {
              'Content-Type': 'text/html'
            },
            body: 'Error: url not found'
          };
        }

        if(orderId) {
          if(params.type == 'email') {
            message += '<h1>С Вашего сайта поступила заявка на email!</h1>';
            message +=  '<table>';
            message += '<tr><td><b>Источник:</b></td><td>'+ params.url +'</td></tr>';
            message += '<tr><td><b>E-mail:</b></td><td>'+ params.email +'</td></tr>';
            message += '<tr><td><b>Телефон:</b></td><td>'+ params.phone +'</td></tr>';
            message += '<tr><td><b>Сообщение:</b></td><td>'+ params.message +'</td></tr>';
            message += '</table>';
          } else {
            message += '<h1>С Вашего сайта поступила заявка на звонок!</h1>';
            message +=  '<table>';
            message += '<tr><td><b>Источник:</b></td><td>'+ params.url +'</td></tr>';
            message += '<tr><td><b>Телефон:</b></td><td>'+ params.phone +'</td></tr>'
            message += '<tr><td><b>Время звонка:</b></td><td>'+ params.time +'</td></tr>';
            message += '</table>';

            var smsText = "тел.: 999 123 45 67, время звонка: 21.08.16";

            //79998720165
            var smsInfo = sendSMS('antonlit2', 'e5252584a810adbb1111fd31a7886000ff5e2d88', '380668778595', smsText);

            if(smsInfo.status == "success") {
              console.log("Success: ");
              console.log(smsInfo.data);
            } else {
              console.log("Error: ");
              console.log(smsInfo.data);
            }
          };

          for (var i = 0; i < widget.emails.length; i++) {
            var emailSend = {
              subject: 'Заявка: '+ params.url,
              email: widget.emails[i],
              message: message
            };

            Meteor.call('sendEmail', emailSend);
          };

          return {
            statusCode: 200,
            headers: {
              'Content-Type': 'text/html'
            },
            body: 'Success: the order has been successfully added'
          };
        } else {
          return {
            statusCode: 500,
            headers: {
              'Content-Type': 'text/html'
            },
            body: 'Error: the order has not been added'
          };
        }
      }
    }
  },
  defaultOptions: {}
});

ApiV1.addCollection(Widgets, {
  excludedEndpoints: ['getAll', 'post', 'put', 'deleteAll', 'delete'],
  endpoints: {
    get: {
      action: function() {
        var query = this.queryParams;
        var widget = Widgets.findOne({'key': query.key});
        var hasOwnProperty = Object.prototype.hasOwnProperty;

        function isEmpty(obj) {
          if (obj == null) return true;
          if (obj.length > 0)    return false;
          if (obj.length === 0)  return true;
          for (var key in obj) {
            if (hasOwnProperty.call(obj, key)) return false;
          }
          return true;
        }

        if(isEmpty(widget)) {
          return {status: 'error', data: 'Widget not found'};
        } else {
          if(widget.status != false) {
            var timeWork,
                yandexTarget = '',
                googleTarget = '';

            if(widget.timeSame) {
              timeWork = {
                mon: {start: widget.timeSameDay.same.start, end: widget.timeSameDay.same.end, status: widget.timeSameDay.same.status},
                tue: {start: widget.timeSameDay.same.start, end: widget.timeSameDay.same.end, status: widget.timeSameDay.same.status},
                wed: {start: widget.timeSameDay.same.start, end: widget.timeSameDay.same.end, status: widget.timeSameDay.same.status},
                thu: {start: widget.timeSameDay.same.start, end: widget.timeSameDay.same.end, status: widget.timeSameDay.same.status},
                fri: {start: widget.timeSameDay.same.start, end: widget.timeSameDay.same.end, status: widget.timeSameDay.same.status},
                sat: {start: widget.timeSameDay.sat.start, end: widget.timeSameDay.sat.end, status: widget.timeSameDay.sat.status},
                sun: {start: widget.timeSameDay.sun.start, end: widget.timeSameDay.sun.end, status: widget.timeSameDay.sun.status}
              };
            } else {
              timeWork = widget.time;
            };

            if(widget.targetYandex.category && widget.targetYandex.eventName) {
              yandexTarget = 'data-yandex-target-name="'+widget.targetYandex.eventName+'" data-yandex-target-id="'+widget.targetYandex.category+'"';
            };

            if(widget.targetGoogle.category && widget.targetGoogle.eventName) {
              googleTarget = 'data-google-target-name="'+widget.targetGoogle.eventName+'" data-google-target-id="'+widget.targetGoogle.category+'"';
            };

            return {
              statusCode: 200,
              headers: {
                'Content-Type': 'text/html'
              },
              body: 'function addHtml(t){var e=document.createElement("div");e.innerHTML=t,document.getElementsByTagName("body")[0].appendChild(e)}document.write(\'<audio id="wf-open-one-audio" controls="controls" preload="auto" style="display: none;"><source src="'+ Meteor.absoluteUrl() +'widgets/callback/audio/open.mp3"></audio><link href="'+ Meteor.absoluteUrl() +'widgets/callback/css/style.min.css" rel="stylesheet"></script><script type="text/javascript" charset="utf-8" src="'+ Meteor.absoluteUrl() +'widgets/callback/js/app.js"></script>\'),addHtml(\'<div id="wf-widget" data-color="'+ widget.color +'" data-schema="'+ widget.schemaColor +'" data-position="'+ widget.position +'" data-time='+ JSON.stringify(timeWork) +' data-scenarios='+ JSON.stringify(widget.scenarios) +' data-sound="'+ widget.sound +'" data-gmt="'+ widget.timeGmt +'"'+ yandexTarget + googleTarget +' data-key="'+ widget.key +'"></div>\');'
            };
          } else {
            return {
              statusCode: 500,
              headers: {
                'Content-Type': 'text/html'
              },
              body: 'Error: Widget not found'
            };
          }
        }
      }
    }
  },
  defaultOptions: {}
});

ApiV1.addRoute('/widget-get', {
  get: function () {}
});


var sendSMS = function(login, password, phone, text) {
  var fut = new Future(),
      timestamp = getTimestamp(),
      data = login+phone+'json'+'callback'+text+timestamp+password,
      signature = CryptoJS.MD5(data).toString();

  console.log(data);

  request({
    method: 'GET',
    uri: 'https://new.sms16.ru/get/send.php?login=' + login + '&signature=' + signature + '&phone=' + phone + '&text=' + text + '&timestamp=' + timestamp + '&sender=callback&return=json'
  }, function(error, response, body) {
    if(response.statusCode == 200) {
      fut['return']({status: "success", data: JSON.parse(body)});
    } else {
      fut['return']({status: "error", data: error});
    };
  });

  return fut.wait();
}

var getTimestamp = function() {
  var fut = new Future();

  request({
    method: 'GET',
    uri: 'https://new.sms16.ru/get/timestamp.php'
  }, function(error, response, body) {
    if(response.statusCode == 200) {
      fut['return'](JSON.parse(body));
    } else {
      fut['return'](JSON.parse(error));
    };
  });

  return fut.wait();
}
