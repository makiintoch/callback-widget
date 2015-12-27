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
    data: function() { return Widgets.findOne(this.params._id)}
  });
  this.route('ordersList', {path: '/orders'});
  this.route('billing', {path: '/billing'});
  this.route('callback', {path: '/callback'});
  this.route('profile', {path: '/profile'});
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