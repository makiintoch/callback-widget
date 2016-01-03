Template.profileEdit.helpers({
  name: function() {
    if(Meteor.user() && Meteor.user().profile) {
      return Meteor.user().profile.name;
    }
  },
  phone: function() {
    if(Meteor.user() && Meteor.user().profile) {
      return Meteor.user().profile.phone;
    }
  }
});

Template.profileEdit.events({
  'submit form': function(e) {
    e.preventDefault();

    var profileEdit = {
      name: $(e.target).find('[name=name]').val(),
      phone: $(e.target).find('[name=phone]').val()
    };

    Meteor.users.update(Meteor.userId(), {$set: {profile: profileEdit}});

    throwMessage('Ваш профиль успешно обновлен');
  }
});