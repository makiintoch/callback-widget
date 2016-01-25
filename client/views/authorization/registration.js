Template.registration.events({
  'submit form': function(e) {
    e.preventDefault();

    var registration = {
      email: $(e.target).find('[name=email]').val(),
      password: $(e.target).find('[name=password]').val()
    };

    var pattern = /^([a-z0-9_\.-])+@[a-z0-9-]+\.([a-z]{2,4}\.)?[a-z]{2,4}$/i;
    if (!pattern.test(registration.email)) {
      throwError("Введите корректный email");
    } else {
      Accounts.createUser(registration, function(error) {
        if (error) {
          throwError(error.reason);
        } else {
          Router.go('widgetsList');
        }
      });
    };
  }
});