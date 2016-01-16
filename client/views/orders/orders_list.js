var sorting = new ReactiveVar('all');

Template.ordersList.helpers({
  orders: function() {
    switch(sorting.get()) {
      case 'all':
        return Orders.find({}, {sort: {createdAt: -1}});  
        break;
      case 'read':
        return Orders.find({status: true}, {sort: {createdAt: -1}});
        break;
      case 'new':
        return Orders.find({status: false}, {sort: {createdAt: -1}});
        break;
    };
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
    };
  }
});

Template.ordersList.events({
  'click .orders-sort span': function(e) {
    e.preventDefault();
    var idx = $('.orders-sort span').index(e.target);

    switch(idx) {
      case 0:
        sorting.set('all');
        break;
      case 1:
        sorting.set('read');
        break;
      case 2:
        sorting.set('new');
        break;
    };

    $('.orders-sort span').removeClass('active');
    $(e.target).addClass('active');
  }
});