var ApiV1 = new Restivus({
  version: 'v1',
  prettyJson: true
});

ApiV1.addCollection(Orders, {
  excludedEndpoints: ['get', 'getAll', 'put', 'deleteAll', 'delete'],
  endpoints: {
    post: {
      action: function() {
        var params = this.bodyParams;
        var widget_key = Widgets.findOne({'url': 'septik-vam.ru'});

        //Order.insert({param: '1', param2: 'param2'});

        return {status: 'success', data: params.widget_key, widget: widget_key};
      }
    }
  },
  defaultOptions: {}
});

var getWidget = new Restivus({

  prettyJson: true
});

ApiV1.addCollection(Widgets, {
  excludedEndpoints: ['getAll', 'post', 'put', 'deleteAll', 'delete'],
  endpoints: {
    get: {
      action: function() {
        var query = this.queryParams;
        var widget = Widgets.findOne({'key': query.key});

        return {
          statusCode: 200,
          headers: {
            'Content-Type': 'text/html'
          },
          body: 'function addHtml(t){var e=document.createElement("div");e.innerHTML=t,document.getElementsByTagName("body")[0].appendChild(e)}document.write(\'<link href="'+ Meteor.absoluteUrl() +'widgets/callback/css/style.css" rel="stylesheet"><script src="https://code.jquery.com/jquery-1.11.3.min.js"></script><script type="text/javascript" charset="utf-8" src="'+ Meteor.absoluteUrl() +'widgets/callback/js/app.js"></script>\'),addHtml(\'<div class="wf-widget" data-color="'+ widget.color +'" data-widget-position-hor="'+ widget.position.hor +'" data-widget-position-ver="'+ widget.position.ver +'" data-sound="'+ widget.sound +'"></div>\');'
        };
      }
    }
  },
  defaultOptions: {}
});

ApiV1.addRoute('/widget-get', {
  get: function () {
    return 'Hello';
  }
});