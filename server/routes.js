var emailHandler = require("./emailing");
var express = require('express');
var router = express.Router();

router.route('/').post(emailHandler);
router.route('/time').get(
  function(req, res) {
    console.log("sending time!!!" + Date());
    var server_time = new Date() - 0;
    res.json({time: server_time});
});

module.exports = router;