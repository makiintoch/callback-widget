Template.sidebar.helpers({
  ordersCount: function() {
    return Orders.find({status: false}).count();
  },
  // check if user is an admin
  isAdminUser: function() {
    return Roles.userIsInRole(Meteor.user(), ['admin']);
  }
});