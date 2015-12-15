Template.widgetAdd.events({
  'submit form': function(e) {
    e.preventDefault();

    var emails = [];

    $('.emails').each(function(index) {
      emails.push( $(this).val() );
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
      Router.go('widgetsList');
    });
  },
  'click .email-add': function(e) {
    e.preventDefault();

    //$(e.target).parent('div').find('input:first').clone(false).insertBefore($(e.target));
  }
});