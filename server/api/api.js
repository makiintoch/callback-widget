var ApiV1 = new Restivus({
  version: 'v1',
  defaultHeaders: {
    'Content-Type': 'application/json'
  },
  prettyJson: true
});

ApiV1.addCollection(Orders, {
  excludedEndpoints: ['get', 'getAll', 'put', 'deleteAll', 'delete'],
  endpoints: {
    post: {
      action: function() {
        var params = this.bodyParams;
        var message = '';

        var widget = Widgets.findOne({'url': this.bodyParams.url});
        /*check(params, {
          name: String,
          type: String,
          url: String,
          email: String
        });*/

        var order = _.extend(params, {
          widgetId: widget._id,
          userId: widget.userId,
          createdAt: new Date(),
          status: false
        });

        var orderId = Orders.insert(order);

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
          }

          for (var i = 0; i < widget.emails.length; i++) {
            var emailSend = {
              subject: 'Заявка: '+ params.url,
              email: widget.emails[i],
              message: message
            };

            Meteor.call('sendEmail', emailSend);
          };
          return {status: 'success', data: params};
        } else {
          return {status: 'error', data: 'Order not added'};
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
            return {
              statusCode: 200,
              headers: {
                'Content-Type': 'text/html'
              },
              body: 'function addHtml(t){var e=document.createElement("div");e.innerHTML=t,document.getElementsByTagName("body")[0].appendChild(e)}document.write(\'<link href="'+ Meteor.absoluteUrl() +'widgets/callback/css/style.css" rel="stylesheet"><script src="https://code.jquery.com/jquery-1.11.3.min.js"></script><script type="text/javascript" charset="utf-8" src="'+ Meteor.absoluteUrl() +'widgets/callback/js/app.js"></script>\'),addHtml(\'<div id="wf-widget" data-color="'+ widget.color +'" data-schema="'+ widget.schemaColor +'" data-position="'+ widget.position +'" data-time='+ JSON.stringify(widget.time) +' data-sound="'+ widget.sound +'"></div>\');'
            };
          } else {
            return {status: 'Error'}
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