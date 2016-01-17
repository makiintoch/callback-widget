function timeWork(time, sameDay, sameDayActive) {
  var weekDay = {mon: 'Понедельник', tue: 'Вторник', wed: 'Среда', thu: 'Четверг', fri: 'Пятница', sat: 'Суббота', sun: 'Воскресенье'},
      showTime = '<p><input type="checkbox" id="weekday-same" name="weekday-same" '+ (sameDayActive ? 'checked' : '') +'> Будние дни по одному графику</p>';

  showTime += '<ul>';
  if(sameDayActive) {
      showTime += '<li>';
      showTime += '<input class="weekday-checkbox" type="checkbox" name="weekday[]" '+ (sameDay['same'].status ? 'checked' : '') +'>';
      showTime += '<span class="weekday-name" data-day="same">Будни</span>'
      showTime += ' с ';
      showTime += '<select class="select-time" name="time-start" '+ (sameDay['same'].status ? '' : 'disabled') +'>'+ showSelectTime(sameDay['same'].start) +'</select>';
      showTime += ' до ';
      showTime += '<select class="select-time" name="time-end" '+ (sameDay['same'].status ? '' : 'disabled') +'>'+ showSelectTime(sameDay['same'].end) +'</select>';
      showTime += '</li>';

      showTime += '<li>';
      showTime += '<input class="weekday-checkbox" type="checkbox" name="weekday[]" '+ (sameDay['sat'].status ? 'checked' : '') +'>';
      showTime += '<span class="weekday-name" data-day="sat">Суббота</span>'
      showTime += ' с ';
      showTime += '<select class="select-time" name="time-start" '+ (sameDay['sat'].status ? '' : 'disabled') +'>'+ showSelectTime(sameDay['sat'].start) +'</select>';
      showTime += ' до ';
      showTime += '<select class="select-time" name="time-end" '+ (sameDay['sat'].status ? '' : 'disabled') +'>'+ showSelectTime(sameDay['sat'].end) +'</select>';
      showTime += '</li>';

      showTime += '<li>';
      showTime += '<input class="weekday-checkbox" type="checkbox" name="weekday[]" '+ (sameDay['sun'].status ? 'checked' : '') +'>';
      showTime += '<span class="weekday-name" data-day="sun">Воскресенье</span>'
      showTime += ' с ';
      showTime += '<select class="select-time" name="time-start" '+ (sameDay['sun'].status ? '' : 'disabled') +'>'+ showSelectTime(sameDay['sun'].start) +'</select>';
      showTime += ' до ';
      showTime += '<select class="select-time" name="time-end" '+ (sameDay['sun'].status ? '' : 'disabled') +'>'+ showSelectTime(sameDay['sun'].end) +'</select>';
      showTime += '</li>';
  } else {
    for(var key in time) {
      showTime += '<li>';
      showTime += '<input class="weekday-checkbox" type="checkbox" name="weekday[]" '+ (time[key].status ? 'checked' : '') +'>';
      showTime += '<span class="weekday-name" data-day="'+ key +'">'+ weekDay[key] +'</span>'
      showTime += ' с ';
      showTime += '<select class="select-time" name="time-start" '+ (time[key].status ? '' : 'disabled') +'>'+ showSelectTime(time[key].start) +'</select>';
      showTime += ' до ';
      showTime += '<select class="select-time" name="time-end" '+ (time[key].status ? '' : 'disabled') +'>'+ showSelectTime(time[key].end) +'</select>';
      showTime += '</li>';
    }
  }
  showTime += '</ul>';

  return showTime;
}

function showSelectTime(selectedTime) {
  var date = new Date(0)
  var option = '';

  for(var i = 0; i < 1440; i = i+60) {
    var time = (date.getUTCHours() < 10 ? '0'+date.getUTCHours() : date.getUTCHours()) +':'+ (date.getUTCMinutes() < 10 ? '0'+date.getUTCMinutes() : date.getUTCMinutes());
    option += '<option '+ (selectedTime == time ? 'selected="selected"' : '') +'>'+ time +'</option>';
    date.setMinutes(date.getMinutes() + 60);
  }

  return option;
}

Template.widgetEditStep2.helpers({
  widget: function() {
    return Widgets.findOne({_id: this._id});
  },
  getTimeWork: function() {
    var widget = Widgets.findOne({_id: this._id}),
        time = widget.time,
        sameDay = widget.timeSameDay
        sameDayActive = widget.timeSame;

    return timeWork(time, sameDay, sameDayActive);
  },
  getTimeWorkGmt: function() {
    var widget = Widgets.findOne({_id: this._id}),
        arrayGmt = Array (
          [{key: '-12', value: '-12'}],
          [{key: '-11', value: '-11'}],
          [{key: '-10', value: '-10'}],
          [{key: '-9', value: '-9'}],
          [{key: '-8', value: '-8'}],
          [{key: '-7', value: '-7'}],
          [{key: '-6', value: '-6'}],
          [{key: '-5', value: '-5'}],
          [{key: '-4', value: '-4'}],
          [{key: '-3', value: '-3'}],
          [{key: '-2', value: '-2'}],
          [{key: '-1', value: '-1'}],
          [{key: '0', value: '+0'}],
          [{key: '1', value: '+1'}],
          [{key: '2', value: '+2'}],
          [{key: '3', value: '+3'}],
          [{key: '4', value: '+4'}],
          [{key: '5', value: '+5'}],
          [{key: '6', value: '+6'}],
          [{key: '7', value: '+7'}],
          [{key: '8', value: '+8'}],
          [{key: '9', value: '+9'}],
          [{key: '10', value: '+10'}],
          [{key: '11', value: '+11'}],
          [{key: '12', value: '+12'}],
          [{key: '13', value: '+13'}],
          [{key: '14', value: '+14'}]),
      timeGmtSelect = '<select name="work-time-gmt">';

    for(var i = 0; i < arrayGmt.length; i++) {
      timeGmtSelect += '<option value="'+ arrayGmt[i][0].key +'" '+ ((widget.timeGmt == arrayGmt[i][0].key) ? 'selected="selected"' : '') +'>'+ arrayGmt[i][0].value +'</option>';
    };

    timeGmtSelect += '</select>';

    return timeGmtSelect;
  }
});

Template.widgetEditStep2.events({
  'click #weekday-same': function(e) {
    var timeSameDayActive = $(e.target).is(':checked') ? true : false,
        widget = {
          id: this._id,
          timeSame: timeSameDayActive
        };

    Meteor.call('widgetUpdate', widget, function(error) {
      if (error) {
        throwError(error.reason);
      }
    });
  },
  'click input[name="weekday[]"]': function(e) {
    var parent = $(e.target).parent('li'),
        status = ($(e.target).is(':checked')) ? true : false;

    if(status) {
      parent.find('select[name="time-start"]').prop("disabled", false);
      parent.find('select[name="time-end"]').prop("disabled", false);
    } else {
      parent.find('select[name="time-start"]').prop("disabled", true);
      parent.find('select[name="time-end"]').prop("disabled", true);
    }
  }
});