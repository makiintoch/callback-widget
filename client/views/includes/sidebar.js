Template.sidebar.helpers({
  ordersCount: function() {
    return Orders.find({status: false}).count();
  }
});