Template.widgetEdit.events({
  'submit form': function(e) {
    e.preventDefault();

    var emails = [],
        time = {};

    $('.form-widget .emails .email').each(function(index) {
      if(this.value) {
        emails.push(this.value);
      }
    });

    var timeSameDayActive = $(e.target).find('#weekday-same').is(':checked') ? true : false;

    var widget = {
      id: this._id,
      name: $(e.target).find('[name=name]').val(),
      color: $(e.target).find('[name=color]').val(),
      schemaColor: $(e.target).find('.schema .active').data('schema'),
      url: $(e.target).find('[name=url]').val(),
      emails: emails,
      emailShortNotice: $(e.target).find('[name=email-short-notice]').is(':checked') ? true : false,
      timeSame: timeSameDayActive,
      position: $(e.target).find('[name=position]').val(),
      sound: $(e.target).find('[name=sound]').is(':checked') ? true : false
    };

    $('.form-widget .work-time ul li').each(function(index) {
      var day = $(this).find('.weekday-name').data('day'),
          start = $(this).find('select[name="time-start"]').val(),
          end = $(this).find('select[name="time-end"]').val(),
          status = ($($(this).find('.weekday-checkbox')).prop("checked")) ? true : false;

      time[day] = {start: start, end: end, status: status};
    });

    if(timeSameDayActive) {
      _.extend(widget, {timeSameDay: time});
    } else {
      _.extend(widget, {time: time});
    }

    Meteor.call('widgetUpdate', widget, function(error) {
      if (error) {
        throwError(error.reason);
      }
      throwMessage('Ваш виджет успешно сохранен');
    });
  },
});