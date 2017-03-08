var debug = require('debug')('twiliochat-node:server');
var IpMessagingClient = require('twilio').IpMessagingClient;
var client = new IpMessagingClient(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);
var service = client.services(process.env.TWILIO_IPM_SERVICE_SID);

var watson = require('watson-developer-cloud');
var conversation = watson.conversation({
  username: process.env.WATSON_USERNAME,
  password: process.env.WATSON_PASSWORD,
  version: 'v1',
  version_date: '2017-02-03'
});

var context = {}; // Watsonとの会話の状態を保持

var WatsonServiceFactory = function(){
  return {
    sendMessage: function(message, channelSid){
      conversation.message({
        workspace_id: process.env.WATSON_WORKSPACE_ID,
        input: {'text': message},
        context: context
      },  function(err, response) {
        if (err) {
          return err;
        } else {
          context = response.context; // 会話の状態を取得
          var result = response.output.text.join().replace( /,/g , "" ) || '';  // Watsonの返信
          // チャットに投稿
          service.channels(channelSid).messages.create({
            body: result
          }).then(function(response) {
            debug('SUCCESS');
          }).fail(function(error) {
            debug('ERROR');
          });
          return result;
        }
      });
    }
  };
};
module.exports = WatsonServiceFactory;
