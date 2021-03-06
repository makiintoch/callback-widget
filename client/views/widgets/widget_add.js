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
    };

    Meteor.call('widgetInsert', widget, function(error) {
      if (error) {
        throwError(error.reason);
      } else {
        throwMessage('Новый виджет успешно создан');
        Router.go('widgetsList');
      }

    });
  },
  'click .email-add': function(e) {
    e.preventDefault();

    $('<p class="email-item"><span class="email-remove"></span><input name="emails[]" class="email" type="text" placeholder="E-mail"></p>').insertBefore('.form-widget .emails .email-add');
  },
  'click .email-remove': function(e) {
    $(e.target).parent('p').remove();
  }
});