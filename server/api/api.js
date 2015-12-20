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
          //body: 'function addHtml(t){var e=document.createElement("div");e.innerHTML=t,document.getElementsByTagName("body")[0].appendChild(e)}document.write(\'<link href="https://d3bo29fbxwvbwx.cloudfront.net/widgets/v2.35/css/tracker.css" rel="stylesheet"/><script src="https://yastatic.net/angularjs/1.3.16/angular.min.js"></script><script type="text/javascript" charset="utf-8" src="https://d3bo29fbxwvbwx.cloudfront.net/widgets/v2.35/js/tracker.js"></script>\'),addHtml(\'<div ng-app="widgetApp"><widget scallback="" scountrycode="ua" ssocialcounters="12;11;25;4;8" sutpbtncolor="" sutpstatus="" sutpimg="" sutpcoord=";" syastatus="" syacounter="" syatarget="" sgastatus="" sgacategory="" sgaevent="" ssound="" stheme="1" scolor="rgb(0,163,255)" spoints="5," spmenu="0" spwidget="right:3" sworktime="9:00 - 19:00" key="07bc3e8540a57ea98b1bdeb99536c4b4"></widget></div>\');'
          body: 'alert("Hello")'
        };
      }
    }
  },
  defaultOptions: {}
});

ApiV1.addRoute('/widget-get', {
  get: function () {}
});