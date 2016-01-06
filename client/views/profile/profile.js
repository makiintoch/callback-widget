function addZero(i) {
  if (i < 10) {
    i = "0" + i;
  }
  return i;
}

Template.profile.helpers({
  email: function() {
    return Meteor.user().emails[0].address;
  },
  date: function() {
    var date = new Date(Meteor.user().createdAt);

    return addZero(date.getDate()) + '.' + addZero((date.getMonth() + 1))  + '.' + date.getFullYear();
  },
  time: function() {
    var time = new Date(Meteor.user().createdAt);

    return addZero(time.getHours()) + ":" + addZero(time.getMinutes());
  }
});

Template.profile.events({
  'submit form': function(e) {
    e.preventDefault();

    var changePassword = {
      oldPassword: $(e.target).find('[name=old-password]').val(),
      newPassword: $(e.target).find('[name=password]').val()
    };

    Accounts.changePassword(changePassword.oldPassword, changePassword.newPassword, function(error){
      if (error) {
        throwError(error.reason);
      } else {
        throwMessage('Пароль был успешно изменен');
      }
    });
  }
});