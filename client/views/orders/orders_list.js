Template.ordersList.helpers({
  orders: function() {
    return Orders.find({}, {sort: {createdAt: -1}});
  },
  isOrders: function() {
    return Orders.find().count() ? true : false;
  },
  ordersCount: function(type) {
    var typeOrder = '';

    switch(type) {
      case 'all':
        return Orders.find().count();
        break;
      case 'read':
        return Orders.find({status: true}).count();
        break;
      case 'new':
        return Orders.find({status: false}).count();
        break;
    }
  }
});

Template.ordersList.events({
  'click .orders-sort span': function(e) {
    e.preventDefault();

    $('.orders-sort span').removeClass('active')
    $(e.target).addClass('active');
  }
});