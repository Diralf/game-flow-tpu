var express = require('express');
var cors = require('cors');
var bodyParser = require('body-parser');
var rp = require('request-promise-native');
var plantuml = require('node-plantuml-latest');

var app = express();

// your manifest must have appropriate CORS headers, you could also use '*'
app.use(cors({ origin: '*' }));
plantuml.useNailgun();

// http://expressjs.com/en/starter/static-files.html
app.use(express.static('public'));

app.post('/api/uml', bodyParser.json(), (req, res) => {
  
  rp(req.body.url)
    .then(function (htmlString) {
        res.send(htmlString);
    })
    .catch(function (err) {
        res.send(JSON.stringify(err));
    });
  
});

app.post('/api/uml/svg', bodyParser.json(), function(req, res) {
    res.set('Content-Type', 'image/svg+xml');
    var gen = plantuml.generate(req.body.uml, {format: 'svg'});
    
    gen.out.pipe(res);
});

app.post('/api/uml/img', bodyParser.json(), function(req, res) {
    res.set('Content-Type', 'image/png');
    var gen = plantuml.generate(req.body.uml, {format: 'png'});
    
    gen.out.pipe(res);
});

// http://expressjs.com/en/starter/basic-routing.html
app.get("*", function (request, response) {
  response.sendFile(__dirname + '/views/index.html');
});

// listen for requests :)
var listener = app.listen(process.env.PORT, function () {
  console.log('Your app is listening on port ' + listener.address().port);
});
