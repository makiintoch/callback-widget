if ( Meteor.users.find().count() === 0 ) {
    var userId = Accounts.createUser({
        username: 'your username',
        email: 'your email',
        password: 'your password',
        profile: {
            first_name: 'fname',
            last_name: 'lname',
            company: 'company',
        }
    });

    Roles.addUsersToRoles(userId, ['admin']);
}

// create a couple of roles if they don't already exist
if(!Meteor.roles.findOne({name: "manager"}))
    Roles.createRole("manager");

if(!Meteor.roles.findOne({name: "user"}))
    Roles.createRole("user");