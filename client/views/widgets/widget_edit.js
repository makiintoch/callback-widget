Template.widgetEdit.helpers({
  widget: function() {
    return Widgets.findOne({_id: this._id});
  }
});

Template.widgetEdit.events({
  'submit form': function(e) {
    e.preventDefault();

    var emails = [];

    $('.emails').each(function(index) {
      emails.push( $(this).val() );
    });

    var widget = {
      name: $(e.target).find('[name=name]').val(),
      color: $(e.target).find('[name=color]').val(),
      url: $(e.target).find('[name=url]').val(),
      emails: emails,
      emailShortNotice: $(e.target).find('[name=email-short-notice]').is(':checked') ? true : false,
      position: {ver: 'bottom', hor: 'right'},
      sound: $(e.target).find('[name=sound]').is(':checked') ? true : false
    };

    Meteor.call('widgetUpdate', widget, function(error) {
      if (error) {
        throwError(error.reason);
      }
      Router.go('widgetsList');
    });
  }
});

Template.widgetEdit.rendered = function() {
  var elems = Array.prototype.slice.call(document.querySelectorAll('.switch'));
  elems.forEach(function(html) {
    var switchery = new Switchery(html);
  });

  $('#color').colorpicker();
}