Template.widgetEdit.events({
  'submit form': function(e) {
    e.preventDefault();

    var emails = [];
    var time = {};

    $('.form-widget .emails .email').each(function(index) {
      if(this.value) {
        emails.push(this.value);
      }
    });

    $('.form-widget .work-time ul li').each(function(index) {
      var day = $(this).find('.weekday-name').data('day'),
          start = $(this).find('select[name="time-start"]').val(),
          end = $(this).find('select[name="time-end"]').val(),
          name = $(this).find('.weekday-name').text(),
          status = ($($(this).find('.weekday-checkbox')).prop("checked")) ? true : false;

      time[day] = {start: start, end: end, name: name, status: status};
    });

    var widget = {
      id: this._id,
      name: $(e.target).find('[name=name]').val(),
      color: $(e.target).find('[name=color]').val(),
      schemaColor: $(e.target).find('.schema .active').data('schema'),
      url: $(e.target).find('[name=url]').val(),
      emails: emails,
      emailShortNotice: $(e.target).find('[name=email-short-notice]').is(':checked') ? true : false,
      time: time,
      position: $(e.target).find('[name=position]').val(),
      sound: $(e.target).find('[name=sound]').is(':checked') ? true : false
    };

    console.log(widget);

    Meteor.call('widgetUpdate', widget, function(error) {
      if (error) {
        throwError(error.reason);
      }
      throwMessage('Ваш виджет успешно сохранен');
      Router.go('widgetsList');
    });
  },
});