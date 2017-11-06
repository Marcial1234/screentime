var atob = require('atob');
var nodemailer = require('nodemailer');

var money_formatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  // the default value for minimumFractionDigits depends on the currency
  // minimumFractionDigits: 2,
});

var format_invoice_html = function (form) {
  
  var message = [];

  var attributes = Object.keys(form);
  attributes.forEach(function(atr) {
    message.push(["<b>", atr.toUpperCase(), "</b>: ", form[atr]].join(""));
  });

  return message.join("<br>");
}


module.exports = function (req, res) {

  // Double check end of investment round here
  if (new Date() > new Date(2017, 10, 7, 12))
  {
    console.log(req.body);
    console.log("nice try!");
    return;
  }

  var message = format_invoice_html(req.body);
  var subject = "Investment from " + req.body.name; 

  // Basic Email Settings
  var mailOptions = {
    to: [process.env.GMAIL_USERNAME, "investments@screentimeuf.com"].concat(req.body.to),
    from: process.env.GMAIL_USERNAME,
    subject: subject,
    html: message
  };

  var transporter = nodemailer.createTransport({
    // service: 'Gmail',
    host: 'smtp.gmail.com',
    clientId: process.env.CLIENT_ID,
    secure: true,
    port: 465,
    auth: {
      user: process.env.GMAIL_USERNAME,
      pass: atob(process.env.GMAIL_PASSWORD)
    }
  });
  
  // Token generation/retrival
  transporter.set('oauth2_provision_cb', function(user, renew, callback) {
    var accessToken = userTokens[user];
    if (!accessToken) {
      return callback(new Error('Unknown user'));
    } else {
      return callback(null, accessToken);
    }
  });

  transporter.sendMail(mailOptions, function(error, info) {
    if (error) {
      console.log(error);
      res.json({result: 'error'});
    } else {
      console.log('Message sent: ' + info.response);
      res.json({result: info.response});
    }
  });
};