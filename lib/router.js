Router.configure({
  layoutTemplate: 'layout',
  loadingTemplate: 'loading',
  notFoundTemplate: 'notFound',
  waitOn: function() {
    return [Meteor.subscribe('userData'), Meteor.subscribe('widgets'), Meteor.subscribe('orders')];
  }
});

Router.map(function() {
  this.route('widgetsList', {path: '/'});
  this.route('widgetAdd', {path: '/widget_add'});
  this.route('widgetEdit', {
    path: '/widget-edit/:_id',
    data: function() { 
      var widget = Widgets.findOne(this.params._id);

      if (widget) {
        return widget;
      } else {
        this.render('notFound');
      }
      
    }
  });
  this.route('ordersList', {path: '/orders'});
  this.route('billing', {path: '/billing'});
  this.route('callback', {path: '/callback'});
  this.route('profile', {path: '/profile'});
  this.route('admin', {
    path:'/admin',
    template: 'accountsAdmin',
    onBeforeAction: function() {
      if (Meteor.loggingIn()) {
        this.render(this.loadingTemplate);
      } else if(!Roles.userIsInRole(Meteor.user(), ['admin'])) {
        this.redirect('/');
      }
    }
  });
});

var requireLogin = function() {
  if (! Meteor.user()) {
    this.render('accessDenied');
  } else {
    this.next();
  }
}

Router.onBeforeAction('loading');
Router.onBeforeAction(requireLogin);