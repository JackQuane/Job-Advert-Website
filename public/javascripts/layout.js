$(document).ready(
	(function() {
		var getNode = function(s) {
			return document.querySelector(s);
		},
		
		//get required nodes
		layoutUsername = getNode('.layout-username');
		
		var loggedInUsername = getCookie("doneDeedsUsername");
		
		loggedInUsername = loggedInUsername.replace("Bearer ", "");
		layoutUsername.innerHTML = loggedInUsername;
			
		function getCookie(cname)
		{
			var name = cname + "=";
			var decodedCookie = decodeURIComponent(document.cookie);
			var ca = decodedCookie.split(';');
			for(var i = 0; i <ca.length; i++) {
				var c = ca[i];
				while (c.charAt(0) == ' ') {
					c = c.substring(1);
				}
				if (c.indexOf(name) == 0) {
					return c.substring(name.length, c.length);
				}
			}
			return "";
		}
		
		
		try{
		var socket = io.connect('http://danu7.it.nuigalway.ie:8663');
	}catch(e)
	{
		//Set status to warn user
	}
	
	if(socket !== undefined){
		//console.log('socket is not undefined and is OK');
		
		//Listen For Output (Messages from other users)
		//socket.on('publicChatOutput', function(data){
		socket.on(loggedInUsername+"\t alert", function(data){
			window.alert("New Message From: " + "data[0].name");
		});
	}
	})
);

