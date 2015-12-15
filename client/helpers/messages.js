Messages = new Meteor.Collection(null);

throwMessage = function(message) {
  Messages.insert({message: message})
}