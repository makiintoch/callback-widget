Template.widgetEdit.helpers({
  widget: function() {
    return Widgets.findOne({_id: this._id});
  },
  absoluteUrl: function() {
    return Meteor.absoluteUrl();
  },
  getActiveClass: function(item, position) {
    if(item == position) {
      return 'active';
    }
  },
  showEmails: function() {
    var widget = Widgets.findOne({_id: this._id});
    var emails = widget.emails;
    var emailsElem = '';

    for(var i = 0; i < emails.length; i++) {
      if(i == 0) {
        emailsElem += '<p class="email-item"><input name="emails[]" class="email" type="text" value="'+ emails[i] +'" placeholder="E-mail"></p>';
      } else {
        emailsElem += '<p class="email-item"><span class="email-remove"></span><input name="emails[]" class="email" type="text" value="'+ emails[i] +'" placeholder="E-mail"></p>';
      }
    }

    return emailsElem;
  },
  getTimeWork: function() {
    var widget = Widgets.findOne({_id: this._id});
    var time = widget.time;

    var showTime = '<ul>';
    for(var key in time) {
      showTime += '<li>';
      showTime += '<input class="weekday-checkbox" type="checkbox" name="weekday[]" '+ (time[key].status ? 'checked' : '') +'>';
      showTime += '<span class="weekday-name" data-day="'+ key +'">'+ time[key].name +'</span>'
      showTime += ' с ';
      showTime += '<select class="select-time" name="time-start">'+ showSelectTime(time[key].start) +'</select>';
      showTime += ' до ';
      showTime += '<select class="select-time" name="time-end">'+ showSelectTime(time[key].end) +'</select>';
      showTime += '</li>';
    }
    showTime += '</ul>';

    function showSelectTime(selectedTime) {
      var date = new Date(0)
      var option = '';

      for(var i = 0; i < 1440; i = i+30) {
        var time = (date.getUTCHours() < 10 ? '0'+date.getUTCHours() : date.getUTCHours()) +':'+ (date.getUTCMinutes() < 10 ? '0'+date.getUTCMinutes() : date.getUTCMinutes());
        option += '<option '+ (selectedTime == time ? 'selected="selected"' : '') +'>'+ time +'</option>';
        date.setMinutes(date.getMinutes() + 30);
      }

      return option;
    }

    return showTime;
  }
});

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
      url: $(e.target).find('[name=url]').val(),
      emails: emails,
      emailShortNotice: $(e.target).find('[name=email-short-notice]').is(':checked') ? true : false,
      time: time,
      position: $(e.target).find('[name=position]').val(),
      sound: $(e.target).find('[name=sound]').is(':checked') ? true : false
    };

    Meteor.call('widgetUpdate', widget, function(error) {
      if (error) {
        throwError(error.reason);
      }
      Router.go('widgetsList');
    });
  },
  'click .widget-position .widget-position-item .position-item': function(e) {
    e.preventDefault();

    $('.widget-position .widget-position-item .position-item').removeClass('active');
    $(e.target).addClass('active');

    var pos = $(e.target).data('position');
    $('.widget-position').val(pos);
  },
  'click .email-add': function(e) {
    e.preventDefault();

    $('<p class="email-item"><span class="email-remove"></span><input name="emails[]" class="email" type="text" placeholder="E-mail"></p>').insertBefore('.form-widget .emails .email-add');
  },
  'click .email-remove': function(e) {
    $(e.target).parent('p').remove();
  }
});

Template.widgetEdit.rendered = function() {
  var elems = Array.prototype.slice.call(document.querySelectorAll('.switch'));
  elems.forEach(function(html) {
    var switchery = new Switchery(html);
  });

  $('.color').colorpicker({align: 'right'}).on('changeColor.colorpicker', function(event) {
    $('.color-show').css('backgroundColor', event.color);
  });
}