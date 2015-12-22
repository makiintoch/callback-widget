Meteor.startup(function () {
  process.env.MAIL_URL = 'smtp://postmaster@sandbox61e3902b3cdc4282861d06013fbc22c6.mailgun.org:Js86da$daJg@smtp.mailgun.org:25'
});

Meteor.methods({
  sendEmail: function(params, html) {
    Email.send({to: 'archibald@email.ua', from: 'meteor@meteor.com', subject: 'Тестовое письмо', html: 'Тестовое сообщение'});
  }
});