var atob = require('atob');
var nodemailer = require('nodemailer');

var money_formatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  // the default value for minimumFractionDigits depends on the currency
  // minimumFractionDigits: 2,
});

var format_invoice_html = function (form) {
  // To be changed A LOT!!!
  
  console.log("PORTTTTTT: " + (process.env.PORT||5000));
  var message = [];
  
  // empleados:1,
  // extra: 1, => new name?
  var ignore_attributes = {email: 1, to: 1, extra: 1, subject:1, };
  var money_attributes  = {precio: 1, materiales: 1, total: 1,};

  var attributes = Object.keys(form);
  attributes.forEach(function(atr) {
    if (!(atr in ignore_attributes) && form[atr]) {
      if (atr in money_attributes) {
        form[atr] = money_formatter.format(form[atr]);
      }

      message.push(["<b>", atr.toUpperCase(), "</b>: ", form[atr]].join(""));
    }
  });

  return message.join("<br>");
}


module.exports = function (req, res) {

  var message = [];
  if (req.body.email) {
    if (!req.body.cliente) {
      req.body.cliente = "FACTURA SIN NOMBRE";
    } else {
      req.body.subject = ["Factura de", req.body.cliente].join(" ");
    }
    
    message = format_invoice_html(req.body);
  }
  else {
    // hadler simple logger
    req.body = {to: message, subject: "Prueba"};
    message = JSON.stringify(req.body);
  }

  // Basic Email Settings
  var mailOptions = {
    to: [process.env.GMAIL_USERNAME].concat(req.body.to),
    from: process.env.GMAIL_USERNAME,
    subject: req.body.subject,
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