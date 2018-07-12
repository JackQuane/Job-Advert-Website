$(document).ready(
	function()
	{
		$("#reg-form").submit(function (event)
		{
			event.preventDefault();
			$.ajax({
				type: 'POST',
				url: '/users/register',
				dataType: 'json',
				data: {
					'user_name': event.target.inputUsername.value,
					'password': event.target.inputPassword.value
				},
				success: function(token)
				{
					$(location).attr('href', '/login' );
				},
				error: function(errMsg)
				{
					/*
					swal(
						'Oops...',
						errMsg.responseJSON.body,
						'error'
						)
						*/
				}
			});
		});
		
		$("#log-form").submit(function (event) 
		{
			event.preventDefault();
			
			$.ajax({
				type: 'POST',
				url: '/users/login',
				dataType: 'json',
				data:{
					'user_name': event.target.inputUsername.value,
					'password': event.target.inputPassword.value					
				},
				success: function(token)
				{
					$(location).attr('href', '/feed' );
				},
				error: function(errMsg)
				{
					swal(
						'Oops...',
						errMsg.responseJSON.body,
						'error'
						)
				}
			});
		});
		
		$("#logout").click(function (event)
		{
			Cookies.remove('Authorization');
			Cookies.remove('doneDeedsUsername');
			$(location).attr('href', '/');
		});
});