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
      //emailShortNotice: $(e.target).find('[name=email-short-notice]').is(':checked') ? true : false,
      timeSame: timeSameDayActive,
      scenarios: {
        first: {status: $(e.target).find('[name=scenarios-first]').is(':checked') ? true : false},
        second: {status: $(e.target).find('[name=scenarios-second]').is(':checked') ? true : false, time: $(e.target).find('[name=scenarios-second-min]').val()},
        third: {status: $(e.target).find('[name=scenarios-third]').is(':checked') ? true : false, time: $(e.target).find('[name=scenarios-third-min]').val()},
        fourth: {status: $(e.target).find('[name=scenarios-fourth]').is(':checked') ? true : false},
        fifth: {status: $(e.target).find('[name=scenarios-fifth]').is(':checked') ? true : false}
      },
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

Template.widgetEdit.rendered = function() {
  var elems = Array.prototype.slice.call(document.querySelectorAll('.switch'));

  elems.forEach(function(html) {
    var switchery = new Switchery(html);
  });
}