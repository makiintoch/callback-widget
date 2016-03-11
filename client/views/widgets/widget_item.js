Template.widgetItem.helpers({
  endDateWorkWidget: function() {
    var widget = Widgets.findOne({_id: this._id});

    return moment(widget.endDate).fromNow();
  },
  widgetCode: function() {
    var widget = Widgets.findOne({_id: this._id});

    return '<script type="text/javascript" charset="utf-8" src="' + Meteor.absoluteUrl() + 'api/v1/widgets/widget-get?key='+ widget.key +'"></script>';
  },
  widgetOrders: function() {
    var ordersCount = Orders.find({widgetId: this._id}).count();

    function declOfNum(number, titles) {
      cases = [2, 0, 1, 1, 1, 2];
      return titles[ (number%100>4 && number%100<20)? 2 : cases[(number%10<5)?number%10:5] ];
    }

    return ((ordersCount == 0) ? 'нет' : ordersCount) +' '+ declOfNum(ordersCount, ['заявка', 'заявки', 'заявок']);
  }
});

Template.widgetItem.events({
  'click .widget-modal': function(e) {
    e.preventDefault();

    var widgetId = this._id;

    Modal.show('widgetRemoveModal');

    $(".widget-delete").on("click", function(e){
      Modal.hide('widgetRemoveModal');

      Meteor.call('widgetRemove', widgetId, function(error) {
        if (error) {
          throwError(error.reason);
        } else {
          throwMessage('Ваш виджет успешно удален!');
        }
      });
    });
  },
  'click .show-code': function(e) {
    e.preventDefault();
    var code = $('.copy-code').data('clipboard-text');

    Modal.show('widgetShowCodeModal', {code: code});
  },
  'click .copy-code': function(e) {
    e.preventDefault();

    new Clipboard('.copy-code');

    throwMessage('Код виджета скопирован в буфер');
  },
  'click .link-service a': function(e) {
    e.preventDefault();

    var idx = $(e.target).index();

    switch(idx) {
      case 1:
        Modal.show('widgetShowServiceModal', {data: {title: 'Перезвоним за 7 секунд', text: '<h2>Как это работает?</h2><p><b>СОЕДИНЕНИЕ НА ЛИНИИ + ЗАПИСЬ РАЗГОВОРА</b></p><ol><li>Виджет оценивает поведение посетителя сайта по выбранным факторам и предлагает соединить с оператором в нужный момент</li><li>Виджет звонит на телефон менеджеру по продажам</li><li>Виджет звонит клиенту</li></ol><p>Цена 5 руб минута.</p>'}});
        break;
      case 2:
        Modal.show('widgetShowServiceModal', {data: {title: 'Отправка СМС уведомлений', text: '<p><b>Отправка заявок на СМС.</b></p><p>Если по каким либо причинам Вам удобнее получать заявки с формы по СМС на телефон, а не на почту, подключите услуги и введите номер….</p><p>Стоимость 3 руб. смс. Ограничение по символам зависит от Вашего оператора.</p><p><b>Отправка СМС клиенту.</b></p><p>После того, как клиент ввел номер и нажал кнопку отправить, мы можем дополнительно отправить ему заранее подготовленное СМС от спец предложениях, акциях или просто благодарность от имени компании.</p><p>Стоимость 3 руб. смс. Ограничение по символам зависит от Вашего оператора.</p>'}});
        break;
      case 3:
        Modal.show('widgetShowServiceModal', {data: {title: 'Онлайн чат', text: '<p>Общайтесь с клиентом  в чате прямо с сайта.</p><p><img src="img/service_chat.png" alt="Онлайн чат"></p><p>Цена 150 руб  в месяц.</p>'}});
        break;
    };

    $(".widget-service").on("click", function(e){
      var info = $(e.target).parent('.modal-footer').parent('.modal-content').find('.modal-title').text();
      Modal.hide('widgetShowServiceModal');
      throwMessage('Мы добавим эту услугу в ближайшее время!', 'Спасибо что обратились');

      Meteor.call('sendEmail', {email: 'anton.l@bk.ru', subject: 'Заказ доп. услуги от'+ Meteor.user().emails[0].address, message: '<p><b>Заказ доп. услуги:</b>'+info+'</p>'});
    });
  }
});