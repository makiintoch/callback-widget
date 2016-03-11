Template.accountsAdmin.helpers({
  users: function() {
    return Meteor.users.find().fetch();
  }
});