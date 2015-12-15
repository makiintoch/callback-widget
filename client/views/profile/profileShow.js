function addZero(i) {
  if (i < 10) {
    i = "0" + i;
  }
  return i;
}

Template.profileShow.helpers({
  username: function() {
    return Meteor.user().username;
  },
  email: function() {
    return Meteor.user().emails[0].address;
  },
  name: function() {
    if(Meteor.user() && Meteor.user().profile) {
      return Meteor.user().profile.name;
    }
  },
  phone: function() {
    if(Meteor.user() && Meteor.user().profile) {
      return Meteor.user().profile.phone;
    }
  },
  date: function() {
    var date = new Date(Meteor.user().createdAt);

    return addZero(date.getDate()) + '.' + addZero((date.getMonth() + 1))  + '.' + date.getFullYear();
  },
  time: function() {
    var time = new Date(Meteor.user().createdAt);

    return addZero(time.getHours()) + ":" + addZero(time.getMinutes());
  }
});