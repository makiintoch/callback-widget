Meteor.methods({
	getSignature: function(data) {
	  var crypto = Npm.require('crypto'),
      	  result = crypto.createHash('md5').update(data).digest('base64');

      return result;
	}
});