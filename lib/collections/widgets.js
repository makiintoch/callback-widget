Widgets = new Mongo.Collection('widgets');

Meteor.methods({
  widgetInsert: function(widgetAttributes) {
    check(Meteor.userId(), String);
    check(widgetAttributes, {
      name: String,
      type: String,
      url: String,
      emails: Array
    });
    var user = Meteor.user();
    var endDate = new Date();

    endDate.setMonth(endDate.getMonth() + 6);

    var widget = _.extend(widgetAttributes, {
      color: '#82D1FF',
      emailShortNotice: false,
      time: {
        mon: {start: '09:00', end: '19:00', status: true},
        tue: {start: '09:00', end: '19:00', status: true},
        wed: {start: '09:00', end: '19:00', status: true},
        thu: {start: '09:00', end: '19:00', status: true},
        fri: {start: '09:00', end: '19:00', status: true},
        sat: {start: '09:00', end: '19:00', status: false},
        sun: {start: '09:00', end: '19:00', status: false}
      },
      position: 'right-bottom',
      sound: false,
      userId: user._id,
      createdAt: new Date(),
      endDate: endDate,
      key: Random.id(43),
      status: true
    });
    var widgetId = Widgets.insert(widget);

    return {
      _id: widgetId
    };
  },
  'widgetUpdate': function(widgetAttributes) {
    Widgets.update({_id: widgetAttributes.id, userId: this.userId}, {$set: widgetAttributes});
  },
  'widgetRemove': function(widgetId) {
    Widgets.remove(widgetId);
  }
});