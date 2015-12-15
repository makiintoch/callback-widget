Template.login.events({
  'submit form': function(e) {
    e.preventDefault();

    var login = {
      user: $(e.target).find('[name=login-email]').val(),
      password: $(e.target).find('[name=login-password]').val()
    };

    Meteor.loginWithPassword(login.user, login.password, function(error){
      if (error) {
        throwError(error.reason);
      }
    });
  }
});