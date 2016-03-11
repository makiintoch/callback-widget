function addZero(i) {
  if (i < 10) {
    i = "0" + i;
  }
  return i;
}

Template.userItem.helpers({
  widgets: function() {
    return Widgets.find({userId: this._id}, {sort: {createdAt: -1}});;
  },
  date: function() {
    var date = new Date(this.createdAt);

    return addZero(date.getDate()) + '.' + addZero((date.getMonth() + 1))  + '.' + date.getFullYear();
  },
});
