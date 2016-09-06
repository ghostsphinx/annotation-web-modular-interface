var express = require("express"),
    app = express(),
    program = require('commander'),
    fs = require('fs'),
    request = require('request'),
    async = require('async'),
    sprintf = require('sprintf').sprintf;


var YAML = require('yamljs');

// remember cookie
var request = request.defaults({
    jar: true
});

// read parameters from command line or from environment variables
// (CAMOMILE_API, CAMOMILE_LOGIN, CAMOMILE_PASSWORD, PYANNOTE_API)

// PBR patch : support parametrized shotIn and shotOut
program
    .option('--config <path>', 'path of the configuration file (e.g. ./config.yml)')
    .parse(process.argv);

var yamlObject = YAML.load(program.config);
var camomile_api = 'http://' + yamlObject.camomile.host;
var login = yamlObject.camomile.username;
var password = yamlObject.camomile.password;
var campaign_name = yamlObject.campaign.name;
var port = 8070;

// configure express app
app.configure(function () {
    app.use(express.methodOverride());
    app.use(express.bodyParser());
    app.use(express.static(__dirname + '/app'));
    app.use(app.router);
});

// handle the hidden form submit
app.post('/', function (req, res) {
    res.redirect('/');
});

// log in Camomile API and callback
function log_in(callback) {

    var options = {
        url: camomile_api + '/login',
        method: 'POST',
        body: {
            'username': login,
            'password': password
        },
        json: true
    };

    request(
        options,
        function (error, response, body) {
            // TODO: error handling
            callback(null);
        });
};

// log out from Camomile API and callback
function log_out(callback) {

    var options = {
        url: camomile_api + '/logout',
        method: 'POST'
    };

    request(
        options,
        function (error, response, body) {
            // TODO: error handling
            callback(null);
        });
};

function getQueueByName(name, callback) {

    var options = {
        url: camomile_api + '/queue',
        method: 'GET',
        qs: {
            name: name
        },
        json: true,
    };

    request(
        options,
        function (error, response, body) {
            if (body.length === 0) {
                queue = undefined;
            } else {
                queue = body[0]._id;
            };
            callback(error, queue);
        });
};



function getAllQueues(callback) {

    async.parallel({

            // MediaEval "label" use case
            labelIn: function (callback) {
                //getQueueByName('  mediaeval.label.in', callback);
                getQueueByName(yamlObject.annotation.label.queue.todo, callback);
            },
            labelOut: function (callback) {
                //getQueueByName('mediaeval.label.out', callback);
                getQueueByName(yamlObject.annotation.label.queue.done, callback);
            },
        },
        function (err, queues) {
            callback(err, queues);
        });
};

// create NodeJS route "GET /config" returning front-end configuration as JSON
// and callback (passing no results whatsoever)
function create_config_route(queues, callback) {

    // ~~~~ Sample /config response ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    // {
    //     'camomile_api': 'http://camomile.fr/api',
    //     'pyannote_api': 'http://pyannote.lu',
    //     'queues': {
    //         'shotIn': '54476ba692e66a08009cc355',
    //         'shotOut': '54476ba692e66a08009cc356',
    //         'headIn': '54476ba692e66a08009cc357',
    //         'headOut': '54476ba692e66a08009cc358',
    // }
    // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

    var get_config = function (req, res) {
        res.json({
            'camomile_api': camomile_api,
            //'pyannote_api': pyannote_api,
            'queues': {
                'labelIn': queues.labelIn,
                'labelOut': queues.labelOut,
            }
        });
    };

    app.get('/config', get_config);

    console.log('   * labelIn  --> /queue/' + queues.labelIn);
    console.log('   * labelOut --> /queue/' + queues.labelOut);

    callback(null);

}


// create AngularJS module 'Config' in /app/config.js ('DataRoot' + 'ToolRoot')
// and callback (passing no results whatsoever)
// WARNING: this should be deprecated in favor of route "GET /config"
function create_config_file(callback) {

    // ~~~~ Sample /app/config.js ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    //     angular.module('myApp.config', [])
    //         .value('DataRoot', 'http://camomile.fr/api')
    //         .value('ToolRoot', 'http://pyannote.lu');
    // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

    async.waterfall([
        function(callback){
            config_js = sprintf(
                "angular.module('myApp.config', [])" + "\n" +
                "   .value('DataRoot', '%s')",
                camomile_api//, list
            );
            callback(null,config_js);
        },
        function(config_js, callback){
            fs.writeFile(
                __dirname + '/app/config.js', config_js,
                function (err) {
                    if (err) {
                        console.log(err);
                    } else {
                        callback(null);
                    }
                }
            );
        }
        ],function(err, results){
            //nothing to do
        }
    );
    callback(null);
};

var get_get_corpus_id = function(name){
    return function(callback){
        var options = {
            url: camomile_api + '/corpus',
            method: 'GET',
            qs: {
                name: name
            },
            json: true,
        };

        request(
            options,
            function (error, response, corpora) {
                if (error || corpora.length === 0) {
                    console.log('ERROR | could not find campaign corpus');
                    corpus_id = undefined;
                } else {
                    corpus_id = corpora[0]._id;
                };
                callback(error, corpus_id);
            });
    }
};

// Returns a function that
// * takes no input
// * retrieves the list of names
// * passes it to a callback
var get_get_names = function() {
  return function(corpus_id, callback) {
      var options = {
          url: camomile_api + '/corpus/' + corpus_id + '/metadata/annotation.evidence.',
          method: 'GET',
          json: true,
      };
      request(
          options,
          function (error, response, names) {
              if (error) {
                console.log('ERROR | could not retrieve list of names')
              }
              callback(error, names, corpus_id);
          });
  };
};

// Returns a function that
// * takes a name as input
// * retrieves the content of the correspond image
// * saves it to disk
// * calls the callback

var get_get_one_image = function(corpus_id) {
  return function(name, callback) {

    var options = {
        url: camomile_api + '/corpus/' + corpus_id + '/metadata/annotation.evidence.' + name  + '.0.image',
        method: 'GET',
        json: true,
    };

    request(
        options,
        function (error, response, image) {
          if (error) {
            console.log('ERROR | could not retrieve image for ' + name + '.')
            callback(error);
          } else {
            var b64 = image.data.replace(/^data:image\/png;base64,/,"");
            fs.writeFileSync('app/static/' + name + '.png', b64, 'base64');
            callback(null, name);
          }
        });
  };
};

// Returns a function that
// * takes a list of name as input
// * retrieves and saves all of them in parallel
// * calls the callbach

var get_get_all_images = function() {
  return function(names, corpus_id, callback) {
    async.eachLimit(
      names,  // list of names
      10,     // at most 10 names at a time
      get_get_one_image(corpus_id),  // function that retrieves and saves image
      function (err) {
        if (err) {
          console.log('ERROR | could not retrieve and/or save images');
          callback(err);
        } else {
          console.log('SUCCESS | ' + names.length + ' images');
          callback(null);
        }
      }
    );
  };
};

var create_static_dir = function(callback) {
  if (!fs.existsSync("app/static")) {
    fs.mkdirSync("app/static");
  }
  callback();
};


// Function that
// * logs in
// * refresh all images
// * logs out
var refresh_images = function() {
  async.waterfall(
    [log_in, create_static_dir, get_get_corpus_id(campaign_name), get_get_names(), get_get_all_images(), log_out]
  );
};

// run app when everything is set up
function run_app(err, results) {
    app.listen(port);
    console.log('App is running at http://localhost:' + port + ' with');
    console.log('   * Camomile API --> ' + camomile_api);
    refresh_images();
    setInterval(refresh_images, 60 * 60 * 1000);  // refresh images every hour
};

// this is where all these functions are actually called, in this order:
// log in, create queues, create route /config, log out, create /app/config.js
// and (then only) run the app
async.waterfall(
    [log_in, getAllQueues, create_config_route, create_config_file, log_out],
    run_app
);
