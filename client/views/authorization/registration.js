Template.registration.events({
  'submit form': function(e) {
    e.preventDefault();

    var registration = {
      username: $(e.target).find('[name=username]').val(),
      email: $(e.target).find('[name=email]').val(),
      password: $(e.target).find('[name=password]').val()
    };

    Accounts.createUser(registration, function(error) {
      if (error) {
        throwError(error.reason);
      }
    });
  }
});