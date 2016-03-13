Template.mainTemplate.events({
    'submit .main-form': function(e){
        e.preventDefault();

        var data = {
            email: $(e.target).find('[name=email]').val(),
            password: $(e.target).find('[name=password]').val(),
            profile : {
                referrer: document.referrer
            }
        };

        Meteor.loginWithPassword(data.email, data.password, function(error) {
            if(error.reason == 'User not found') {
                Accounts.createUser(data, function(error) {
                    if (error) {
                        throwError("К сожалению произошла ошибка: "+ error.reason);
                    } else {
                        Router.go('widgetsList');
                    }
                });
            } else {
                if (error) {
                    throwError("К сожалению произошла ошибка: "+ error.reason);
                } else {
                    Router.go('widgetsList');
                }
            }
        });
    },
    'click .main-login': function(e) {
        e.preventDefault();

        Modal.show('authorization');
    }
});