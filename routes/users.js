var express = require('express');
var router = express.Router();
var User = require('../models/users');
var jwt = require('jsonwebtoken');


module.exports = router;


router.post('/login', function(req, res, next)
{
	var username = req.body.user_name;
	var password = req.body.password;
	User.findOne({'user_name': username}, function (err, user) 
		{
			if (err)
			{
				res.send(err);
			}
			if (user)
			{
				if (user.validPassword(password))
				{
					user.access_token = createJwt({user_name: username});
					user.save();
					res.cookie('Authorization', 'Bearer ' + user.access_token);
					res.cookie('doneDeedsUsername', 'Bearer ' + username);
					res.json({'success' : 'loggedIn'});
					
				}
				else
				{
					res.status(401).send({
						"status": "error",
						"body": "Email or Password does not match"
					});
						
				}
			}
			else
			{
				res.status(401).send({
					"status": "error",
					"body": "Username not found"
				});
			}
		});
	});	
	
	//////////////////////////////////// start of google login
	router.post('/googleLogin', function(req, res, next)
{
	var name = req.body.name;
	var email = req.body.email;
	var ID = req.body.ID;
	
	console.log(email);
	
	/////////////////////////////////////////////////////
	User.findOne({ 'user_name' : email }, function(err, user)
		{
			//checks for user with that email
			if(user)
			{
				/*
				res.status(401).json
				({
					"status": "info",
					"body": "Username already taken"
				});*/
				user.access_token = createJwt({user_name: email});
				user.save();
				res.cookie('Authorization', 'Bearer ' + user.access_token);
				res.cookie('doneDeedsUsername', 'Bearer ' + email);
				res.json({'success' : 'loggedIn'});
				
				
			}
			else
			{
				//If there is no matching username create a new one
				var newUser = new User();
				
				//Set the users local credentials
				newUser.user_name = email;
				//newUser.password = newUser.generateHash(password);
				newUser.access_token = createJwt({user_name: email});
				res.cookie('Authorization', 'Bearer ', + newUser.access_token);
				res.cookie('doneDeedsUsername', 'Bearer ' + email);
				res.json({'success' : 'loggedIn'});
				newUser.save(function(err, user)
				{
					/*if (err)
						throw err;
					res.json('success : account created');*/
				});
			}
			
		});
	});	
//////////////////////////////////////////////////////////// end of google log in

router.post('/register', function(req, res, next)
{
	var username = req.body.user_name;
	var password = req.body.password;
	//Checks if account allready exists
	
	User.findOne({ 'user_name' : username }, function(err, user)
	{
		if(err)
			res.send(err);
		//checks for user with that email
		if(user)
		{
			res.status(401).json
			({
				"status": "info",
				"body": "Username already taken"
			});
		}
		else
		{
			//If there is no matching username create a new one
			var newUser = new User();
			
			//Set the users local credentials
			newUser.user_name = username;
			newUser.password = newUser.generateHash(password);
			newUser.access_token = createJwt({user_name:username});
			newUser.save(function(err, user)
			{
				if (err)
					throw err;
				res.cookie('Authorization', 'Bearer ', + newUser.access_token);
				res.json('success : account created');
			});
		}
	});
});


router.get('/register', function(req, res, next) {
	res.render('register');
});

router.get('/login', function(req, res, next) {
	res.render('login');
});
				
// Create a JWT
function createJwt(profile)
{
	return jwt.sign(profile, 'CSIsTheWorst',
	{
		expiresIn: '10d'
	});
}

module.exports = router;