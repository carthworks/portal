"use strict";

$(document).ready(function(){

	// Form Validation
	$("#gapp-signin-form").kendoValidator({
											validateOnBlur : true,
											errorTemplate: "<span class='help-block'><code>#=message#</code></span>"
	});
	
	$("#gapp-forgorpassword-form").kendoValidator({
											validateOnBlur : true,
											errorTemplate: "<span class='help-block'><code>#=message#</code></span>"
	});
		
	$('body').on('click','#gapp-forgotpassword-link',function(e){
		e.preventDefault();	
		$('#gapp-forgotpassword-container').addClass('animated pulse');
		$('#gapp-forgotpassword-container').removeClass('hide').addClass('show');
		$('#gapp-login-container').removeClass('show').addClass('hide');
	
	});
				
	$('body').on('click','#gapp-forgotpass-cancel',function(e){
	//	$('#gapp-forgotpassword-container').addClass('animated bounceOutLeft');
		e.preventDefault();
		$('#forgotemailid').val('');
		$('#gapp-forgotpassword-container').removeClass('show').addClass('hide');
		$('#gapp-login-container').addClass('show');
	
	});
	
	setTimeout(function(){
		if(allFilled('#username, #password')) $('#gapp-signin-submit').removeAttr('disabled');
	}, 1000);
	FnCheckEmptyFrmFields('#username, #password', '#gapp-signin-submit');
	
});

function FnLoginSubmit(){
	$('#gapp-login-submit, #gapp-login-cancel').attr('disabled',true);
	var validator = $("#gapp-signin-form").data("kendoValidator");
	validator.hideMessages();
	kendo.ui.progress($("#gapp-signin-form"), true);
	if (validator.validate()) {
		
		$('#gapp-login-submit, #gapp-login-cancel').attr('disabled',false);
		kendo.ui.progress($("#gapp-signin-form"), false);
		return true;
	} else {		
		
		$('#gapp-login-submit, #gapp-login-cancel').attr('disabled',false);
		kendo.ui.progress($("#gapp-signin-form"), false);
		var errors = validator.errors();
		console.log(errors);
		return false;
	
	}
}

function FnLoginCancel(){
	var VarFrmObj = document.getElementById('gapp-signin-form');
	VarFrmObj.reset();
	var validator = $("#gapp-signin-form").data("kendoValidator");
	validator.hideMessages();

}

function FnForgotPassword(){

	$('#gapp-forgotpass-submit, #gapp-forgotpass-cancel').attr('disabled',true);
	var validator = $("#gapp-forgorpassword-form").data("kendoValidator");
	validator.hideMessages();
	kendo.ui.progress($("#gapp-forgorpassword-form"), true);
	if (validator.validate()) { //alert('success');
	
	} else {
		$('#gapp-forgotpass-submit, #gapp-forgotpass-cancel').attr('disabled',false);
		kendo.ui.progress($("#gapp-forgorpassword-form"), false);
		var errors = validator.errors();
		console.log(errors);
		return false;
	}
	
}