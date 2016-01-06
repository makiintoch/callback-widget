Template.widgetEditStep3.helpers({
  widget: function() {
    return Widgets.findOne({_id: this._id});
  },
  getActiveClass: function(item, position) {
    if(item == position) {
      return 'active';
    }
  },
  getActiveSchema: function(colorSchema) {
    var widget = Widgets.findOne({_id: this._id});

    if(colorSchema == widget.schemaColor) {
      return 'active';
    }
  },
  absoluteUrl: function() {
    return Meteor.absoluteUrl();
  },
});

Template.widgetEditStep3.events({
  'click .widget-position .widget-position-item .position-item': function(e) {
    e.preventDefault();

    $('.widget-position .widget-position-item .position-item').removeClass('active');
    $(e.target).addClass('active');

    var pos = $(e.target).data('position');
    $('.widget-position').val(pos);
  },
  'click .schema-color': function(e) {
    $('.schema .schema-color').removeClass('active');
    $(e.target).addClass('active');
  }
});

Template.widgetEditStep3.rendered = function() {
  $('.color').colorpicker({align: 'right'}).on('changeColor.colorpicker', function(event) {
    $('.color-show').css('backgroundColor', event.color);
  });
}