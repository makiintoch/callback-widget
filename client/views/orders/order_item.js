Template.orderItem.helpers({
  getDate: function(date) {
    return moment(date).fromNow()
  },
  getType: function(type) {
    return (type == 'call') ? 'Звонок' : 'E-mail';
  }
});