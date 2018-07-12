var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var index = require('./routes/index');
var users = require('./routes/users');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

// uncomment after placing your favicon in /public
app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', index);
app.use('/users', users);
var mongo = require('mongodb').MongoClient,
	client = require('socket.io').listen(8663).sockets;
	
	/////////////////////////////////////////////////////   Start Of Private Chat With Socket IO
mongo.connect('mongodb://mongodb3481gs:we1fez@danu7.it.nuigalway.ie:8717/mongodb3481', function(err, db)
{
	if(err) throw err;
	
	client.on('connection', function(socket)
	{
		
		var tempsss = socket.handshake.headers.cookie;
		var tempSplit = tempsss.split(";");
		var doneDeedsCookie;
		
		for(i = 0; i<tempSplit.length;i++)
		{
			if((tempSplit[i].search("doneDeedsUsername") >=0))
			{
				doneDeedsCookie = tempSplit[i];
				var tempSplit = doneDeedsCookie.split("Bearer:");
			}
		}
		for(i = 0; i<tempSplit.length;i++)
		{
			if((tempSplit[i].search("doneDeedsUsername") >=0))
			{
				doneDeedsCookie = tempSplit[i];
				doneDeedsCookie = doneDeedsCookie.replace("%40", "@");
				var tempSplit = doneDeedsCookie.split("Bearer%20");
			}
		}
		clientUsername = tempSplit[1];

		var col = db.collection('messages');
		var usersCol = db.collection('users');//For Usernames
		
		var sendStatus = function(s){
			socket.emit('status', s);
		};
		var messagesToSend = [];
		
		//Emit All Messages To other Logged On Users
		col.find().limit(100).sort({_id: 1}).toArray(function(err, res){
			if(err) throw err;
			
			for(i = 1; i<res.length;i++)
			{
				if((res[i].name == clientUsername) || (res[i].to == clientUsername))
				{
					messagesToSend.push(res[i]);
				}
			}
			socket.emit(clientUsername, messagesToSend);
			//socket.emit('publicChatOutput', res);
		});
		
		//Emit all Users to logged in users
		usersCol.find().limit(100).sort({_id: 1}).toArray(function(err, res){
			if(err) throw err;
			socket.emit('outputUsers', res);
		});
		
		
		//Wait for the input	
		socket.on('publicChatInput', function(data) 
		{
			var name = data.name;
			var message = data.message;
			whitespacePattern = /^\s*$/;
			
			if(whitespacePattern.test(message))
			{
				sendStatus('Message Is Missing');
			}
			
			else
			{
				col.insert({name: name, message: message, to: data.to, time: data.time},function(){
					
					//Emit latest message to all cleints
					if((data.name == clientUsername) || (data.to == clientUsername))
					{
						client.emit(clientUsername, [data]);
						client.emit(data.to, [data]);
						client.emit(data.to+"\t alert", [data]);
						
						sendStatus
						({
							message: "Message Sent",
							clear: true
						});
					}
				});	
			}
		});
	});
});	
//====================================================================================================================================================

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;