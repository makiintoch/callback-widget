(function() {
  "use strict";

  var widget = {
    getOptions: function() {
      var widgetTag = $('.wf-widget');

      var color = widgetTag.data('color'),
          sound = widgetTag.data('sound');

      return {
        color: color,
        sound: sound
      }
    },
    getWidgetIconElem: function() {
      return $(".wf-widget-icon");
    },
    getWidgetNameElem: function() {
      return $(".wf-widget-name-icon");
    },
    getWidgetPhoneElem: function() {
      return $(".wf-widget-phone-icon");
    },
    getHeightWindow: function() {
      return $(window).height();
    },
    getDocumentWindow: function() {
      return $(document).height();
    },
    setHeightWindow: function() {
      $('.wf-widget').css('height', widget.getHeightWindow());

      $(window).resize(function() {
        $('.wf-widget').css('height', widget.getHeightWindow());
      });
    },
    setWidgetPosition: function() {
      var windowHeight = widget.getHeightWindow();
      var documentScrollTopHeight = document.body.scrollTop;
      var ver = (windowHeight - 150) + documentScrollTopHeight + 'px';
      var hor = '75px';

      $('.wf-widget-call').css({top: ver, right: hor});
    },
    resizeWindow: function() {
      $(window).resize(function() {
        widget.setWidgetPosition();
      });
    },
    scrollDocument: function() {
      $(window).scroll(function() {
        widget.setWidgetPosition();
      });
    },
    rotateButtons: function() {
      var icon = widget.getWidgetIconElem();
      var name = widget.getWidgetNameElem();
      var phone = widget.getWidgetPhoneElem();

      var intervalId = setInterval(function() {
        if($(name).hasClass('wf-rotate-icon')) {
          $(name).removeClass('wf-rotate-icon');
          $(phone).addClass('wf-rotate-icon');
        } else {
          $(phone).removeClass('wf-rotate-icon');
          $(name).addClass('wf-rotate-icon');
        }
      }, 4000);
    },
    showWidget: function() {
      $('.wf-widget-call').on('click', function() {
        $(this).addClass('wf-hide');
        $('.wf-widget-content').css('right', 0);
      });
    },
    hideWidget: function() {
      $('.wf-close').on('click', function() {
        $('.wf-widget-call').removeClass('wf-hide');
        $('.wf-widget-content').css('right', '-350px');
      });
    },
    createWidget: function() {
      var widgetOptions = widget.getOptions();
      $('.wf-widget').append('<div class="wf-widget-call" style="top: 0; right: 75px;"><div class="wf-widget-bg" style="background: '+ widgetOptions.color +';"><span class="wf-widget-triangle" style="border-color: transparent transparent transparent '+ widgetOptions.color +';"></span></div><span class="wf-widget-icon wf-widget-name-icon wf-rotate-icon"></span><span class="wf-widget-icon wf-widget-phone-icon"></span></div>')
    },
    run: function() {
      widget.createWidget();
      widget.setHeightWindow();
      widget.setWidgetPosition();
      widget.rotateButtons();
      widget.resizeWindow();
      widget.scrollDocument();
      widget.showWidget();
      widget.hideWidget();
    }
  };

  widget.run();
})();