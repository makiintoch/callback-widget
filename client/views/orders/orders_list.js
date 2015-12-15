Template.ordersList.helpers({
  orders: function() {
    return Orders.find();
  }
});