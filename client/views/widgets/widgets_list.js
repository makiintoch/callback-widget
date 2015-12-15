Template.widgetsList.helpers({
  widgets: function() {
    return Widgets.find({}, {sort: {createdAt: -1}});
  }
});