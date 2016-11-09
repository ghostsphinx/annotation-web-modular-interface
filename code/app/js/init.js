var Camomile = require('camomile-client');

module.exports = fetch('http://localhost:8070/config')
.then(function(response){
  var restext = response.text();
  return restext;
})
.then(function(myresponse){
  var res = JSON.parse(myresponse);
  if (Object.keys(res)[0]=='camomile_api') {
    var camomile = new Camomile(res.camomile_api);
    return camomile;
  }
  else console.log('fail to get configuration');
  return null;
});

