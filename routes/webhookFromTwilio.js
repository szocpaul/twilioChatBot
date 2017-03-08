var express = require('express');
var router = express.Router();
var debug = require('debug')('twiliochat-node:server');
var WatsonService = require('../services/watsonService');
var watsonService = new WatsonService();

// POST /webhookFromTwilio
router.post('/', function (req, res) {
  var channelSid = req.body.ChannelSid || ''; // チャットチャネルID
  var body = req.body.Body || ''; // チャットメッセージ

  // watsonBotにメッセージを送信
  watsonService.sendMessage(body, channelSid);

  res.send('OK');
});

module.exports = router;
