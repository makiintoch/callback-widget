Template.changePassword.events({
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