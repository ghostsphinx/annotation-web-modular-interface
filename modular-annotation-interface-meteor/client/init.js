import Camomile from 'camomile-client';

Router.route('/', function () {
  this.render('Home', {
    data: function () { return Items.findOne({_id: this.params._id}); }
  });
});

var res = fetch('http://localhost:3000/config')
.then(function(response){
  var restext = response.text();
  return restext;
})
.then(function(myresponse){
  var res = JSON.parse(myresponse);
  if (Object.keys(res)[0]=='camomile_api') {
    var camService = new Camomile(res.camomile_api);
  }
  else console.log('fail to get configuration');

  return camService;

});

export {res};