if (Accounts._resetPasswordToken) {  
  Session.set('resetPasswordToken', Accounts._resetPasswordToken);
}

Template.login.helpers({  
  resetPassword: function() {
    return Session.get('resetPasswordToken');
  }
});

Template.login.events({
  'submit .form-auth-login': function(e) {
    e.preventDefault();

    var login = {
      email: $(e.target).find('[name=email]').val(),
      password: $(e.target).find('[name=login-password]').val()
    };

    Meteor.loginWithPassword(login.email, login.password, function(error) {
      if (error) {
        throwError(error.reason);
      } else {
        Router.go('widgetsList');
      }
    });
  },
  'submit .form-auth-new-pass': function (e) {
    e.preventDefault();

    var password = $(e.target).find('[name=new-password]').val();

    Accounts.resetPassword( Session.get('resetPasswordToken'), password, function (error) {
      if (error) {
        throwError('К сожалению при восстановлении пароля произошла ошибка: '+error.reason);
      } else {
        throwMessage('Ваш пароль успешно изменен');
        Session.set('resetPasswordToken', null);
      };
    });
  }
});