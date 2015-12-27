Template.ordersList.helpers({
  orders: function() {
    return Orders.find();
  }
});

Template.ordersList.rendered = function() {
  var elems = Array.prototype.slice.call(document.querySelectorAll('.switch'));
  elems.forEach(function(html) {
    var switchery = new Switchery(html);
  });
}