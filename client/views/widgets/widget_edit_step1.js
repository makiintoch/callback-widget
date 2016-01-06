Template.widgetEditStep1.helpers({
  widget: function() {
    return Widgets.findOne({_id: this._id});
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
  }
});

Template.widgetEditStep1.events({
  'click .email-add': function(e) {
    e.preventDefault();

    $('<p class="email-item"><span class="email-remove"></span><input name="emails[]" class="email" type="text" placeholder="E-mail"></p>').insertBefore('.form-widget .emails .email-add');
  },
  'click .email-remove': function(e) {
    $(e.target).parent('p').remove();
  }
});

Template.widgetEditStep1.rendered = function() {
  var elems = Array.prototype.slice.call(document.querySelectorAll('.switch'));

  elems.forEach(function(html) {
    var switchery = new Switchery(html);
  });
}