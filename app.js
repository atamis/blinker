
/**
 * Module dependencies.
 */

var express = require('express');
var fs = require('fs')

var app = module.exports = express.createServer();

// Configuration

app.configure(function(){
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(app.router);
  app.use(express.static(__dirname + '/public'));
});

app.configure('development', function(){
  app.use(express.errorHandler({ dumpExceptions: true, showStack: true })); 
});

app.configure('production', function(){
  app.use(express.errorHandler()); 
});

// Data

var config_file = "./state.json"
var state = {speed: 60, colors: ["black", "white"]}

fs.readFile(config_file, function(err, data){
  if (!err) {
    state = JSON.parse(data)
  }
});

var save_config = function() {
fs.writeFile(config_file, JSON.stringify(state), function (err) {
  if (err) throw err;
  console.log('Config saved');
});
}

// Routes

app.get('/', function(req, res){
  res.render('index', {
    title: 'Blinker',
    speed: state.speed,
    colors: state.colors.join(", ")
  });
});

app.get('/state', function(req, res){
  res.json(state);
});

app.post('/state', function(req, res){
  var x = req.body
  if (!(x.color instanceof Array)) {
    x.colors = x.colors.split(/, ?/)
  }
  state = req.body
  console.log(state)
  save_config()
  res.end()
});


app.listen(3000);
console.log("Express server listening on port %d in %s mode", app.address().port, app.settings.env);
