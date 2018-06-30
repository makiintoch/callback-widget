Meteor.methods({
  sendEmail: function(params) {
    Email.send({to: params.email, from: 'noreply@calling-all.ru', subject: params.subject, html: params.message});
  }
});