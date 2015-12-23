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
    var emailsElem;

    for(var i = 0; i < emails.length; i++) {
      if(i == 0) {
        emailsElem += '<p><input name="emails[]" class="email" type="email" value="'+ emails[i] +'" placeholder="E-mail"></p>';
      } else {
        emailsElem += '<p><span class="remove-email"></span><input name="emails[]" class="email" type="email" value="'+ emails[i] +'" placeholder="E-mail"></p>';
      }
    }

    return emailsElem;
  }
});

Template.widgetEdit.events({
  'submit form': function(e) {
    e.preventDefault();

    var emails = [];

    $('.form-widget .emails .email').each(function(index) {
      if(this.value) {
        emails.push(this.value);
      }
    });

    var widget = {
      id: this._id,
      name: $(e.target).find('[name=name]').val(),
      color: $(e.target).find('[name=color]').val(),
      url: $(e.target).find('[name=url]').val(),
      emails: emails,
      emailShortNotice: $(e.target).find('[name=email-short-notice]').is(':checked') ? true : false,
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
  'click .widget-position .widget-position-item .item': function(e) {
    e.preventDefault();

    $('.widget-position .widget-position-item .item').removeClass('active');
    $(e.target).addClass('active');

    var pos = $(e.target).data('position');
    $('.widget-position').val(pos);
  },
  'click .email-add': function(e) {
    e.preventDefault();

    $('<p><span class="remove-email"></span><input name="emails[]" class="email" type="email" placeholder="E-mail"></p>').insertBefore('.form-widget .emails .email-add');
  },
  'click .remove-email': function(e) {
    $(e.target).parent('p').remove();
  }
});

Template.widgetEdit.rendered = function() {
  var elems = Array.prototype.slice.call(document.querySelectorAll('.switch'));
  elems.forEach(function(html) {
    var switchery = new Switchery(html);
  });

  $('#color').colorpicker();
}