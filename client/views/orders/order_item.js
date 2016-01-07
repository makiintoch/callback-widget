Template.orderItem.helpers({
  getDate: function(date) {
    return moment(date).fromNow()
  },
  getType: function(type) {
    return (type == 'call') ? '<span class="type-call">Звонок</span>' : '<span class="type-email">E-mail</span>';
  }
});

Template.orderItem.events({
  'change .switch': function(e) {
    var status = '';
    if ($(e.target).is(':checked')) {
      status = true;
    } else {
      status = false;
    }

    Meteor.call('orderUpdate', this._id, {status: status}, function(error) {
      if (error) {
        throwError(error.reason);
      }
    });
  },
  'click .order-remove': function(e) {
    e.preventDefault();

    Meteor.call('orderRemove', this._id, function(error) {
      if (error) {
        throwError(error.reason);
      } else {
        throwMessage('Заявка успешно удалена');
      }
    });
  },
  'click .show-order': function(e) {
    e.preventDefault();

    Modal.show('orderInfoModal', {order: this});
  }
});

Template.orderItem.rendered = function() {
  var elem = this.find('.switch'),
      init = new Switchery(elem);
}