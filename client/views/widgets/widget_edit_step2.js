Template.widgetEditStep2.helpers({
  widget: function() {
    return Widgets.findOne({_id: this._id});
  },
  getTimeWork: function() {
    var widget = Widgets.findOne({_id: this._id});
    var time = widget.time;
    var weekDay = {mon: 'понедельник', tue: 'вторник', wed: 'среда', thu: 'четверг', fri: 'пятница', sat: 'суббота', sun: 'воскресенье'};

    var showTime = '<ul>';
    for(var key in time) {
      showTime += '<li>';
      showTime += '<input class="weekday-checkbox" type="checkbox" name="weekday[]" '+ (time[key].status ? 'checked' : '') +'>';
      showTime += '<span class="weekday-name" data-day="'+ key +'">'+ weekDay[key] +'</span>'
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