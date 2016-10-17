var globalVar = {};
var session = {name:"", isAuth:false};

fetch('http://localhost:8070/config')
.then(function(response){
  var restext = response.text();
  return restext;
})
.then(function(myresponse){
  var res = JSON.parse(myresponse);
  if (Object.keys(res)[0]=='camomile_api') {
    Camomile.setURL(res.camomile_api);
    Camomile.me(function (err, data) {
      if (data.error) {
        session.name = '';
        session.isAuth = false;
      } else {
        session.name = data.username;
        session.isAuth = true;
      }
      globalVar.callback1(session);
      globalVar.callback2(session);
    });
  }
  else console.log('fail to get configuration');
});

var PubSub;
require(["/lib/PubSubJS-1.5.3/src/pubsub.js"], function(pubsub){
  PubSub = pubsub;
});