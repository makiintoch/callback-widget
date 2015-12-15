var ApiV1 = new Restivus({
  version: 'v1',
  prettyJson: true
});

ApiV1.addCollection(Orders, {
  excludedEndpoints: ['getAll', 'get', 'put', 'deleteAll', 'delete'],
  endpoints: {
    post: {
      action: function() {
        var params = this.bodyParams;
        var widget_key = Widgets.findOne({'url': 'septik-vam.ru'});

        //Order.insert({param: '1', param2: 'param2'});

        return {status: 'xxx', data: params.widget_key, widget: widget_key};
      }
    }
  },
  defaultOptions: {}
});

var getWidget = new Restivus({
  apiPath: 'widget-get',
  prettyJson: true
});

getWidget.addCollection(Widgets, {
  excludedEndpoints: ['getAll', 'post', 'put', 'deleteAll', 'delete'],
  endpoints: {
    get: {
      action: function() {
        return {
          statusCode: 200,
          headers: {
            'Content-Type': 'text/html'
          },
          body: 'alert("test")'
        };
      }
    }
  },
  defaultOptions: {}
});