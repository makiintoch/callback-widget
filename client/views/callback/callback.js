Template.callback.events({
  'submit form': function(e) {
    e.preventDefault();

    var callback = {
      name: $(e.target).find('[name=name]').val(),
      email: $(e.target).find('[name=email]').val(),
      message: $(e.target).find('[name=message]').val()
    }, message = '';

    message += '<h1>С Вашего сайта поступило письмо!</h1>';
    message +=  '<table>';
    message += '<tr><td><b>Имя:</b></td><td>'+ callback.name +'</td></tr>';
    message += '<tr><td><b>E-mail:</b></td><td>'+ callback.email +'</td></tr>'
    message += '<tr><td><b>Сообщение:</b></td><td>'+ callback.message +'</td></tr>';
    message += '</table>';

    var emailSend = {
      subject: 'Письмо: '+ Meteor.absoluteUrl(),
      email: 'archibald@email.ua',
      message: message
    };

    Meteor.call('sendEmail', emailSend);
    throwMessage('Email was sended.');
    Router.go('widgetsList');
  }
});