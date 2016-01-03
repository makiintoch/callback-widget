Template.forgotPassword.events({
  'submit form': function(e) {
    e.preventDefault();


    var email = $(e.target).find('[name=forgot-email]').val();

    console.log(email);

    Accounts.forgotPassword({email: email}, function(error){
      if (error) {
        throwError(error.reason);
      } else {
        throwMessage('На Ваш e-mail было отправлено письмо с инструкциями для восстановления пароля');
      }
    });
  }
});