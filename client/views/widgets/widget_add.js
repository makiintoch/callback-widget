Template.widgetAdd.events({
  'submit form': function(e) {
    e.preventDefault();

    var emails = [];

    $('.form-widget .emails .email').each(function(index) {
      if(this.value) {
        emails.push(this.value);
      }
    });

    var widget = {
      name: $(e.target).find('[name=name]').val(),
      url: $(e.target).find('[name=url]').val(),
      emails: emails,
      type: $(e.target).find('[name=type]').val(),
    };

    Meteor.call('widgetInsert', widget, function(error) {
      if (error) {
        throwError(error.reason);
      }
      throwMessage('The widget was added.');
      Router.go('widgetsList');
    });
  },
  'click .email-add': function(e) {
    e.preventDefault();

    $('<p><span class="remove-email"></span><input name="emails[]" class="email" type="email" placeholder="E-mail"></p>').insertBefore('.form-widget .emails .email-add');
  },
  'click .remove-email': function(e) {
    $(e.target).parent('p').remove();
  }
});