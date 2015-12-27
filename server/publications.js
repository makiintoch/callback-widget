Meteor.publish('orders', function() {
  if (this.userId) {
    return Orders.find({userId: this.userId});
  } else {
    this.ready();
  }
});

Meteor.publish('widgets', function() {
  if (this.userId) {
    return Widgets.find({userId: this.userId});
  } else {
    this.ready();
  }
});

Meteor.publish("userData", function () {
  if (this.userId) {
    return Meteor.users.find({_id: this.userId}, {fields: {'username': true, 'emails': true, 'createdAt': 1, 'profile': true}});
  } else {
    this.ready();
  }
});