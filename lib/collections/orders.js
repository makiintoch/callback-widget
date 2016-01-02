Orders = new Mongo.Collection('orders');

Meteor.methods({
  'orderUpdate': function(id, orderAttributes) {
    Orders.update({_id: id}, {$set: orderAttributes});
  },
  'orderRemove': function(orderId) {
    Orders.remove(orderId);
  }
});