Template.login.events({
  'submit form': function(e) {
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
  }
});