(function() {
	var getNode = function(s) {
		return document.querySelector(s);
	},
	
	//get required nodes
	status = getNode('.chat-status span'),
	messages = getNode('.chat-messages'),
	textarea = getNode('.chat-text');
	userList = getNode('.user-name');
	chatTo = getNode('.chat-to');
	chattingWith = getNode('.chatting-with');

	//window.alert("New Message");
	//Set The name to logged in username
	
		var chatName = getCookie("doneDeedsUsername");
		chatName = chatName.replace("Bearer ", "");
		
		var chatWith = getCookie("chat-with");
		//console.log(chatWith);
		
		chattingWith.innerHTML = chatWith;
			
			
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
	
	statusDefault = status.textContent;
	
	setStatus = function(s) {
		status.textContent = s;
		
		if(s !== statusDefault){
			var delay = setTimeout(function(){
				setStatus(statusDefault);
				clearInterval(delay);
			}, 3000);
		}
	};
	
	setStatus('Testing');
	
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
		socket.on(chatName, function(data){
			if(data.length){
				messages,innerHTML = " "; 
				//Loop through results
				for(var x =0; x < data.length; x=x+1)
				{
					if(((data[x].to == chatName) && (data[x].name == chatWith )) || ((data[x].to == chatWith)&&(data[x].name == chatName)))
					{
						var message = document.createElement('div');
						message.setAttribute('class', 'chat-message');
						message.textContent = data[x].name + ':  ' +data[x].message;
						
						//Append messages
						messages.appendChild(message);
					}
					messages.scrollTop = messages.scrollHeight;
				}	
			}
		});
		
		
		//Lists All The Users
		socket.on('outputUsers', function(data){
			if(data.length)
			{
				//Loop through results
				userList.innerHTML = " ";
				for(var x =0; x < data.length; x=x+1)
				{
					var userNameButton = document.createElement('button');
					userNameButton.setAttribute('class', 'user-entry');
					userNameButton.setAttribute('onclick', 'docPlaceCookie("'+data[x].user_name+'")');					
					userNameButton.textContent = data[x].user_name;
					
					//Append
					userList.appendChild(userNameButton);
				}
			}
		});	
		
		placeCookie = function(userNameToChat) {
		document.cookie = "chat-with= "+ userNameToChat;
		//console.log(document.cookie);
		}
		
		
		
		//Listen For a Status
		socket.on('status', function(data){
			setStatus((typeof data === 'object') ? data.message : data);
			
			if(data.clear === true){
				textarea.value = '';
			}
		});
		

		//listen for keyDown
		textarea.addEventListener('keydown', function(event){
			var self = this,
			name = chatName;
			//var recept = 'simonhgillespie@gmail.com';
			var dt = new Date();
			//console.log(event.which);
			if(event.which === 13 && event.shiftKey === false){
				//console.log('Enter has been presses and message Sent');
				socket.emit('publicChatInput',{
					name: name,
					message: self.value,
					to: chatWith,
					time: dt.getTime()
				});
				
				event.preventDefault();
			}
		});
	}
})();