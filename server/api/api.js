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
        //var widget = Widgets.findOne({'url': this.bodyParams.url});
        check(params, {
          name: String,
          type: String,
          url: String,
          email: String
        });


        //Meteor.call('sendEmail', 'archibald@email.ua', 'Тестовое сообщение');

        var orderId = Orders.insert(params);

        Meteor.call('orderInsert', params, function(error) {
          if (error) {
            return {status: 'error', data: 'Order not added'};
          } else {
            return {status: 'success', data: params};
          }
        });

        return {status: 'success', data: params};

        //var order = Orders.insert(params);

        /*if(order) {
          return {status: 'success', data: params};
        } else {
          return {status: 'error', data: 'Order not added'};
        }*/
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
          //if(widget.status != false && widget.url == query.url) {
          if(widget.status != false) {
            return {
              statusCode: 200,
              headers: {
                'Content-Type': 'text/html'
              },
              body: 'function addHtml(t){var e=document.createElement("div");e.innerHTML=t,document.getElementsByTagName("body")[0].appendChild(e)}document.write(\'<link href="'+ Meteor.absoluteUrl() +'widgets/callback/css/style.css" rel="stylesheet"><script src="https://code.jquery.com/jquery-1.11.3.min.js"></script><script type="text/javascript" charset="utf-8" src="'+ Meteor.absoluteUrl() +'widgets/callback/js/app.js"></script>\'),addHtml(\'<div class="wf-widget" data-color="'+ widget.color +'"data-position="'+ widget.position +'" data-sound="'+ widget.sound +'"></div>\');'
            };
          } else {
            return {status: 'error'}
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