Template.widgetItem.helpers({
  endDateWorkWidget: function() {
    var widget = Widgets.findOne({_id: this._id});

    return moment(widget.endDate).fromNow();
  },
  widgetCode: function() {
    var widget = Widgets.findOne({_id: this._id});

    return '<script type="text/javascript" charset="utf-8" src="' + Meteor.absoluteUrl() + 'api/v1/widgets/widget-get?key='+ widget.key +'"></script>';
  },
  widgetOrders: function() {
    var ordersCount = Orders.find({widgetId: this._id}).count();

    function declOfNum(number, titles) {
      cases = [2, 0, 1, 1, 1, 2];
      return titles[ (number%100>4 && number%100<20)? 2 : cases[(number%10<5)?number%10:5] ];
    }

    return ((ordersCount == 0) ? 'нет' : ordersCount) +' '+ declOfNum(ordersCount, ['заявка', 'заявки', 'заявок']);
  }
});

Template.widgetItem.events({
  'click .widget-modal': function(e) {
    e.preventDefault();

    var widgetId = this._id;

    Modal.show('widgetRemoveModal');

    $(".widget-delete").on("click", function(e){
      Modal.hide('widgetRemoveModal');

      Meteor.call('widgetRemove', widgetId, function(error) {
        if (error) {
          throwError(error.reason);
        } else {
          throwMessage('Ваш виджет успешно удален!');
        }
      });
    });
  },
  'click .show-code': function(e) {
    e.preventDefault();
    var code = $('.copy-code').data('clipboard-text');

    Modal.show('widgetShowCodeModal', {code: code});
  },
  'click .copy-code': function(e) {
    e.preventDefault();

    new Clipboard('.copy-code');

    throwMessage('Код виджета скопирован в буфер');
  }
});