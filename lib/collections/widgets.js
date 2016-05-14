Widgets = new Mongo.Collection('widgets');

Meteor.methods({
  widgetInsert: function(widgetAttributes) {
    check(Meteor.userId(), String);
    check(widgetAttributes, {
      name: String,
      //type: String,
      url: String,
      emails: Array
    });
    var user = Meteor.user();
    //var endDate = new Date();

    //endDate.setMonth(endDate.getMonth() + 12);

    var widget = _.extend(widgetAttributes, {
      color: '#00a2ff',
      schemaColor: 'gray',
      emailShortNotice: false,
      smsSubscribe: true,
      smsSubscribeEndDate: null,
      timeSame: true,
      timeSameDay: {
        same: {start: '09:00', end: '19:00', status: true},
        sat: {start: '09:00', end: '19:00', status: true},
        sun: {start: '09:00', end: '19:00', status: true}
      },
      time: {
        mon: {start: '09:00', end: '19:00', status: true},
        tue: {start: '09:00', end: '19:00', status: true},
        wed: {start: '09:00', end: '19:00', status: true},
        thu: {start: '09:00', end: '19:00', status: true},
        fri: {start: '09:00', end: '19:00', status: true},
        sat: {start: '09:00', end: '19:00', status: false},
        sun: {start: '09:00', end: '19:00', status: false}
      },
      timeGmt: '3',
      scenarios: {
        first: {status: false},
        second: {status: false, time: '8'},
        third: {status: false, time: '2'},
        fourth: {status: false},
        fifth: {status: false}
      },
      targetYandex: {
        category: '',
        eventName: ''
      },
      targetGoogle: {
        category: '',
        eventName: ''
      },
      position: 'right-bottom',
      sound: false,
      userId: user._id,
      createdAt: new Date(),
      //endDate: endDate,
      key: Random.id(43),
      type: 'callback',
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