$(document).ready( function()  {
		var totalCharacters = 140;
		var showPosts = false;
			$("#postForm").keyup(function (event) {
			var inputText = event.target.value;
			/*  var titleText = event2.target.value; */  
			$("#charRemaining").html(totalCharacters - inputText.length);
	}); 
	getComments();
	
	var loggedInUserName = getUserName();
	
		function getComments() {
			$.get( "/getComments", function( data) {
				var posts= "";
				
				//for(var i=0; i<data.length; i++)
				for(var i = data.length-1; i>=0; i--)
				{
					if(data[i].userName == loggedInUserName || loggedInUserName == "admin")
					{
						var date = data[i].date_created;
						date = date.split("T");
						posts+="<div class='well'>" +
						"<div class ='row'>" +
						"<div class ='col-xs-1'>" + "<b>Title:</b><br> " +data[i].title + "</div>" +
						"<div class ='col-xs-5'>" + "<b>Description:</b><br> " + data[i].comment + "</div>" +
						"<div class ='col-xs-1'>" + "<b>Price:</b><br> €" + data[i].price + "</div>" +
						"<div class ='col-xs-1'>" + "<b>Location:</b> <br>" + data[i].location + "</div>" +
						"<div class ='col-xs-1'>" + "<b>Post Date:</b><br> " + date[0] + "</div>" +
						"<div class ='col-xs-1'>" + "<b>Category:</b><br> " + data[i].category + "</div>"+
						"<div class ='col-xs-1'><button type='button' name='delete\t" + data[i]._id + "\t"+data[i].userName + "' class='btn btn-danger'>Delete</button></div>" +
						"<div class ='col-xs-1'><button type='button' name='chat\t" + data[i].userName + "' class='btn'>Chat</button></div>" +
						"</div>" +
						"</div>";
					}	
					else
					{
						var date = data[i].date_created;
						date = date.split("T");
						posts+="<div class='well'>" +
						"<div class ='row'>" +
						"<div class ='col-xs-1'>" + "<b>Title:</b><br> " +data[i].title + "</div>" +
						"<div class ='col-xs-5'>" + "<b>Description:</b><br> " + data[i].comment + "</div>" +
						"<div class ='col-xs-1'>" + "<b>Price:</b><br> €" + data[i].price + "</div>" +
						"<div class ='col-xs-1'>" + "<b>Location:</b> <br>" + data[i].location + "</div>" +
						"<div class ='col-xs-1'>" + "<b>Post Date:</b><br> " + date[0] + "</div>" +
						"<div class ='col-xs-1'>" + "<b>Category:</b><br> " + data[i].category + "</div>"+
						"<div class ='col-xs-1'><button type='button' name='chat\t" + data[i].userName + "' class='btn'>Chat</button></div>" +
						"</div>" +
						"</div>";
					}
				}
				$( "#feedPosts" ).html( posts );
				$( "#count" ).html(data.length);
				
				setTimeout(getComments,10000);
		});
		}
		
		$("#feedPosts").click(function  (event)
		{
			//console.log(event.target.name);
			if(event.target.name)
			{
				var toDeCode = event.target.name;
				parts = toDeCode.split("\t");
				type = parts[0];
				msg = parts[1];
				uN = parts[2];
				//console.log(part1);
				if(type == "delete")
				{
					if(uN == getUserName()|| getUserName() == "admin")
					{
						$.ajax({
							url: '/removeComment/' + msg,
							type: 'DELETE',
							success: function(result) 
								{
									getComments();	
								}
							});
					}
				}
				else if(type == "chat")
				{
					document.cookie = "chat-with= "+ msg;
					console.log(document.cookie);
					document.location.href = "http://danu7.it.nuigalway.ie:8667/chat";
				}
			}		
		});
	
	$("#btn-count").click(function (event)  {
		var options ={ };
		if(!showPosts)
		{
			$("#feedPosts").show( "blind", options, 1000);
			showPosts = true;
		}
		else 
		{
			$("#feedPosts").hide( "blind", options, 1000);
			showPosts = false;
		}
	});
	
	function getUserName(){
		var uName = getCookie("doneDeedsUsername");
		uName = uName.replace("Bearer ", "");
			
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
		
		return uName;
	}

		
	$.get("/getComments", function(data, status){
	//alert("Data: " + data + "\nStatus " + status);
	});
	
	$("#postForm").submit(function (event) 
	{
		event.preventDefault();
		$.post("/addComment", {
			userName: getUserName(),
			comment: event.target.descriptionPost.value,
			price: event.target.pricePost.value,
            title: event.target.titlePost.value,
            location: event.target.locationPost.value,
            category: event.target.category.value
		}, function (result)  {
			$("#charRemaining").html(totalCharacters);
			event.target.reset();
			getComments();
		});
	});
	
});
	
