Template.widgetItem.helpers({
  endDateWorkWidget: function() {
    var widget = Widgets.findOne({_id: this._id});

    return moment(widget.endDate).fromNow();
  },
  widgetCode: function() {
    var widget = Widgets.findOne({_id: this._id});

    return '<script type="text/javascript" charset="utf-8" src="' + Meteor.absoluteUrl() + 'api/v1/widgets/widget-get?key='+ widget.key +'"></script>';
  }
});

Template.widgetItem.events({
  'click .widget-delete': function(e) {
    e.preventDefault();

    Meteor.call('widgetRemove', this._id, function(error) {
      if (error) {
        throwError(error.reason);
      } else {
        throwMessage('The widget has been removed');
      }
    });
  }
});