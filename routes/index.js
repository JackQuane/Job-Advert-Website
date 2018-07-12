var express = require('express');
var router = express.Router();
var Comment = require('../models/comments');
var jwt = require('jsonwebtoken');

 /*GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Home' });
});

router.get('/login', function(req, res, next) {
  res.render('login', { title: 'Login' });
});

/* Get Feed Page */
router.get('/feed', function(req, res, next) {
	
	try {
		var jwtString = req.cookies.Authorization.split(" ");
		var profile = verifyJwt(jwtString[1]);
		if (profile)  {
			res.render('feed');
		}
	}catch (err) {
			res.json({
				"status": "error",
				"body": [
					"You are not logged in."
					]
			});
	}
    /*res.render('feed', { title: 'Feed' });*/
});

/*Shows the chat Page*/
router.get('/chat', function(req, res, next) {
	
	try {
		var jwtString = req.cookies.Authorization.split(" ");
		var profile = verifyJwt(jwtString[1]);
		if (profile)  {
			res.render('chat');
		}
	}catch (err) {
		
			/*res.json({
				"status": "error",
				"body": [
					"You are not logged in."
					]
			});*/
			res.status(401).json
			({
				"status": "info",
				"body": "You Are Not Logged In"
			});
	}
});



/* Adds Comments */
router.post('/addComment', function(req, res, next)  {
	//Extract the request body which contains the comments
	comment = new Comment(req.body);
	console.log("=======================================");
	console.log(comment);
	comment.save(function (err, savedComment) {
		if (err)
			throw (err)
		
		res.json({
			"id": savedComment._id
		});
	});
});

//Retreive Comments 
router.get('/getComments', function(req, res, next) {
	
	Comment.find({}, function (err, comments) {
		if(err)
			res.send(err);
		
		res.json(comments);
	})
});

//Deletes Comments
router.delete('/removeComment/:id', function(req, res, next) {
	var id = req.params.id;
	Comment.remove({_id:id}, function (err) {
		if(err)
			res.send(err);
		
		res.json({status : "successfully removed the comment"});
		});
});

function verifyJwt(jwtString)
{
	var value = jwt.verify(jwtString, 'CSIsTheWorst');
	return value;
}

module.exports = router;

