var express    =    require('express');
var app        =    express();
var path = require('path');
var csv = require('csv');


require('./router/main')(app);
app.set('views',__dirname + '/views');
app.set('view engine', 'ejs');
app.engine('html', require('ejs').renderFile);
app.use(express.static(path.join(__dirname, 'static')));

var server     =    app.listen(8080,function(){
	console.log("Express is running on port 8080");
});
var io = require('socket.io')(server);

var neurosky = require('node-neurosky');

var client = neurosky.createClient({
	appName:'NeuroSky',
	appKey:'0fc4141b4b45c675cc8d3a765b8d71c5bde9390'
});

var $socket;
io.on('connection', function (socket) {
	$socket = socket;

	socket.on('signal', function (data) {
		console.log(data);
	});

});

//var five = require("johnny-five"),
//board = new five.Board();

var meditationvalue;
var meditationarray = [];

client.on('data',function(data){
		console.log(data);
		
		$socket.emit('neurosky', data);
		meditationvalue = data.eSense.meditation;
		



	});





// board.on("ready", function() {
// 	console.log("board ready");
//   // Create an Led on pin 13
//   var lightbulb = new five.Led(7);
//   lightbulb.on();

//   // Strobe the pin on/off, defaults to 100ms phases
  


// });

client.connect();





