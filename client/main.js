if (Meteor.isServer) {
    Meteor.startup(function () {
        // create a couple of roles if they don't already exist
        if(!Meteor.roles.findOne({name: "manager"}))
            Roles.createRole("manager");

        if(!Meteor.roles.findOne({name: "user"}))
            Roles.createRole("user");
    });
}