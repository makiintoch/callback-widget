Meteor.startup(function () {
  process.env.MAIL_URL = 'smtp://postmaster@sandbox61e3902b3cdc4282861d06013fbc22c6.mailgun.org:Js86da$daJg@smtp.mailgun.org:25'
});

Meteor.methods({
  sendEmail: function(params) {
    Email.send({to: params.email, from: 'callback@widget.com', subject: params.subject, html: params.message});
  }
});