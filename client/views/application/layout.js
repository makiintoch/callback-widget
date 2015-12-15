Template.layout.events({
    'click .logout': function(){
        Meteor.logout(function(error){
          if(error) {
            throwError(error.reason);
          }
        });
    }
});