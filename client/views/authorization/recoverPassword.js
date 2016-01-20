Template.forgotPassword.events({  
  'submit .form-auth-send-email': function(e) {
    e.preventDefault();

    var email = $(e.target).find('[name=forgot-email]').val();

    if (email) {
      Accounts.forgotPassword({email: email}, function(error){
        if (error) {
          if (error.message === 'User not found [403]') {
            throwError('Пользователь с таким email не найден');  
          } else {
            throwError('К сожалению при восстановлении пароля произошла ошибка: '+error.reason);  
          }
        } else {
          throwMessage('На Ваш e-mail('+email+') было отправлено письмо с инструкциями для восстановления пароля');
        }
      });
    } else {
      throwMessage('Пожалуйста введите валидный email');
    };
  }
});