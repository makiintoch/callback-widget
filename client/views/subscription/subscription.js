Template.subscription.helpers({
  widgetsList: function() {
    return Widgets.find();
  },
  getSignature: function() {
  	return Session.get('signatureField')
  },
  getFields: function() {
  	var key = '7a7261585c525f685638615f536b74685f5b5776703770716e474e';

	var fields = {
	  WMI_MERCHANT_ID: '131114291158',
	  WMI_PAYMENT_AMOUNT: '10.00',
	  WMI_CURRENCY_ID: '643',
	  WMI_DESCRIPTION: 'BASE64:' + CryptoJS.enc.Base64.stringify(CryptoJS.enc.Utf8.parse('Оплата демонстрационного заказа')),
	  WMI_SUCCESS_URL: 'http://call-message.com/w1/paid',
	  WMI_FAIL_URL: 'http://call-message.com/w1/fail',
	  // Если требуется задать только определенные способы оплаты, раскоментируйте данную строку и перечислите требуемые способы оплаты.
	  // WMI_PTENABLED: ['UnistreamRUB', 'SberbankRUB', 'RussianPostRUB'],
	  widgetId: 'widgetId',
	  smsCount: 'smsCount'
	};

	var comparator = function(a, b){
	  var a = a.toLowerCase();
	  var b = b.toLowerCase();
	  return a > b ? 1 : a < b ? -1 : 0;
	};
	 
	var createInput = function(name, value){
	  return '<input type="hidden" name="' + name + '" value="' + value + '">';
	};
	 
	var inputs = '';
	var values = '';

	Object.keys(fields).sort(comparator).forEach(function(name) {
	  var value = fields[name];
	  if (Array.isArray(value)) {
	    values += value.sort(comparator).join('');
	    inputs += value.map(function(val){ return createInput(name, val); }).join('');
	  }
	  else {
	    values += value;
	    inputs += createInput(name, value);
	  }
	});

	Meteor.call('getSignature', values + key, function(error, result) {
    	inputs += createInput('WMI_SIGNATURE', result);

    	console.log(result);

    	Session.set('signatureField', inputs);
	});

	return inputs;
  }
});