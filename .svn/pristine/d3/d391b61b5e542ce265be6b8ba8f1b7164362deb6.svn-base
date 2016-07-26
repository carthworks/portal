"use strict";

$(document).ready(function(){

	// Form Validation
	$("#gapp-addclient-form").kendoValidator({
											validateOnBlur : true,
											errorTemplate: "<span class='help-block'><code>#=message#</code></span>",
											rules : {
												available:function(input){
													var validate = input.data('available');
													var VarExist = true;
													if (typeof validate !== 'undefined' && validate !== false) {
														var url = input.data('available-url');
														if (input.is('[name=tenantId]')) {
															var VarParam = {"domain": {"domainName": VarCurrentTenantInfo.tenantDomain},"fieldValues": [{"key": "tenantId","value": FnTrim(input.val())}],"uniqueAcross":"Application"};
														}
														
														$.ajax({
															type:'POST',
															cache: true,
															async: false,
															contentType: 'application/json; charset=utf-8',
															url: GblAppContextPath+"/ajax" + url,
															data: JSON.stringify(VarParam),
															dataType: 'json',
															success: function(result) {
																var ObjExistStatus = result;																
																if(ObjExistStatus.status == 'SUCCESS'){ // Exist in db
																	VarExist = true;
																} else if(ObjExistStatus.status == 'FAILURE') { // Does not exist in db
																	VarExist = false;
																}
															},
															error : function(xhr, status, error) {
															
															}
														});
													}
													return VarExist;
												}
											},
											messages : {
												available: function(input) { 
													return input.data("available-msg");
												}
											}
	});

	$('#gapp-client-save').prop('disabled', true);
	FnCheckEmptyFrmFields('#tenantName, #tenantId, #firstName, #lastName, #contactEmail', '#gapp-client-save');
});

function FnGetFormFieldValues(VarFrmId,VarAllowCond){
	var ArrFieldValuesJSONObj = [];
	$('#'+VarFrmId).find(VarAllowCond).each(function(){
		var ObjFieldMap = {};
		var VarFieldName = $(this).attr('name');
		var VarFieldValue = FnTrim($(this).val());
		if (!(typeof VarFieldValue === "undefined") && VarFieldValue!='') {
			if ($(this).is("[type='text']") || $(this).is("[type='email']") || $(this).is("[type='url']")) {
				ObjFieldMap["key"] = VarFieldName;
	            ObjFieldMap["value"] = VarFieldValue;
			}
			
			ArrFieldValuesJSONObj.push(ObjFieldMap);
		}
	});
	
	return ArrFieldValuesJSONObj;
}

function FnGetClientTemplates(){
	var ArrTemplates = [];
	var ArrTmp = VarClientTemplates.split(',');
	$.each(ArrTmp,function(key,template){
		var element = {};
		element['entityTemplateName'] = template;
		element['globalEntityType'] = "MARKER";
		ArrTemplates.push(element);
	});
	return ArrTemplates;
}

function FnSaveClient(){
	$('#gapp-client-save, #gapp-client-cancel').attr('disabled',true);
	var validator = $("#gapp-addclient-form").data("kendoValidator");
	validator.hideMessages();
	$("#GBL_loading").show();
	
	if (validator.validate()) {
		if(VarEditClientId == ''){ // Create Client
			var VarUrl = GblAppContextPath+'/ajax' + VarCreateClientUrl;
			var VarParam = {};
			var VarStatus = 'ACTIVE';
			$("input[name='statusName']").each(function(){
				if($(this).is(':checked') == true){
					VarStatus = $(this).val();
				}
			});
			VarParam["domain"] = {"domainName" : VarCurrentTenantInfo.tenantDomain};			
			VarParam['entityStatus'] = {"statusName" : VarStatus};
			VarParam['fieldValues'] = FnGetFormFieldValues("gapp-addclient-form","input[type=text],input[type=email]");
			var ObjImageFile = $("#client-logo").prop("files")[0];
			if(!$.isEmptyObject(ObjImageFile)){
				var VarImageName = '';
				var VarClientId = FnTrim($('#tenantId').val());
				VarImageName = VarClientId +'.'+VarCurrentTenantInfo.tenantDomain+'.png';			
				VarParam['fieldValues'].push({"key":"image","value":VarImageName});				
			}
			VarParam['templates'] = FnGetClientTemplates();
			console.log(JSON.stringify(VarParam));
			//return false;
			FnMakeAsyncAjaxRequest(VarUrl, 'POST', JSON.stringify(VarParam), 'application/json; charset=utf-8', 'json', FnResSaveClient);
		} else { // Update Client
				
			var VarUrl = GblAppContextPath+'/ajax' + VarUpdateClientUrl;
			VarUrl = VarUrl.replace("{tenant_id}",VarEditClientId);
			VarUrl = VarUrl.replace("{domain}",GblClientDomain);
			var VarParam = {};
			var VarStatus = 'ACTIVE';
			$("input[name='statusName']").each(function(){
				if($(this).is(':checked') == true){
					VarStatus = $(this).val();
				}
			});
			VarParam['entityStatus'] = {"statusName" : VarStatus};
			VarParam['fieldValues'] = FnGetFormFieldValues("gapp-addclient-form","input[type=text],input[type=email]");
			console.log(VarParam);
			
			FnMakeAsyncAjaxRequest(VarUrl, 'PUT', JSON.stringify(VarParam), 'application/json; charset=utf-8', 'json', FnResUpdateClient);
		}
		
	} else {
		$('#gapp-client-save, #gapp-client-cancel').attr('disabled',false);
		$("#GBL_loading").hide();
		var errors = validator.errors();
		console.log(errors);
		return false;
	}
}

function FnResSaveClient(response){
	
	var ArrResponse = response;
	$('#gapp-client-save, #gapp-client-cancel').attr('disabled',false);
	$("#GBL_loading").hide();
	if(ArrResponse.status == 'SUCCESS'){	
		var ObjImageFile = $("#client-logo").prop("files")[0];
		if(!$.isEmptyObject(ObjImageFile)){ // Upload Client Logo
			
			var options = {
						url:GblAppContextPath+"/upload/client",
						success:FnResImageUpload
			};
			
			$('#gapp-addclient-form').ajaxSubmit(options);
		}
		 
		notificationMsg.show({
			message : 'Client added successfully'
		}, 'success');
		
		FnFormRedirect('gapp-client-list',GBLDelayTime);
		
	} else {
		notificationMsg.show({
			message : ArrResponse['errorMessage']
		}, 'error');
	}
		
}

function FnResUpdateClient(response){
	console.log(response);
	var ArrResponse = response;
	$('#gapp-client-save, #gapp-client-cancel').attr('disabled',false);
	$("#GBL_loading").hide();
	if(ArrResponse.status == 'SUCCESS'){
		var ObjImageFile = $("#client-logo").prop("files")[0];
		if(!$.isEmptyObject(ObjImageFile)){ // Upload Client Logo
			var options = {
						url:GblAppContextPath+"/upload/client",
						success:FnResImageUpload
			};
			$("#gapp-addclient-form :input").prop("disabled", false);
			$('#gapp-addclient-form').ajaxSubmit(options);
		}
		
		notificationMsg.show({
			message : 'Client  updated successfully'
		}, 'success');
		
		FnFormRedirect('gapp-client-list',GBLDelayTime);
		
	} else {
		notificationMsg.show({
			message : ArrResponse['errorMessage']
		}, 'error');
	}
}

function FnResImageUpload(response,status){
	$('#client-logo').val('');
	$('#client-logo-info').html('');
}

function FnCancelClient(){
		
	if(GBLcancel > 0){
		$('#GBLModalcancel #hiddencancelFrm').val('gapp-client-list');
		$('#GBLModalcancel').modal('show');
	} else {
		$('#gapp-client-list').submit();
	}
}

function FnNavigateClientList(){
	$('#gapp-client-list').submit();
}

function FnGetClientDetails(VarClientId){
	$("#gapp-addclient-form :input").prop("disabled", true);
	$('#gapp-client-save').attr('disabled',true);
	$("#gapp-client-cancel").prop("disabled", false);
	var VarUrl = GblAppContextPath+'/ajax' + VarViewClientUrl;
	VarUrl = VarUrl.replace("{tenant_id}",VarClientId);
	VarUrl = VarUrl.replace("{domain}",VarCurrentTenantInfo.tenantDomain);	
	FnMakeAjaxRequest(VarUrl, 'GET', '', 'application/json; charset=utf-8', 'json', FnResClientDetails);
}

var GblClientDomain = '';
function FnResClientDetails(response){
	var ArrResponse = response;
	if(!$.isEmptyObject(ArrResponse)){
		$.each(ArrResponse['fieldValues'],function(key,obj){
			if($('#gapp-addclient-form #'+obj['key'])){
				$('#gapp-addclient-form #'+obj['key']).val(obj['value']);
			}
			
			if(obj['key'] == 'domain'){
				GblClientDomain = obj['value'];
			}
			
		});
		
		if(ArrResponse['entityStatus']['statusName'] == 'ACTIVE'){
			$('#gapp-addclient-form #statusName_active').attr('checked',true);
		} else {
			$('#gapp-addclient-form #statusName_inactive').attr('checked',true);
		}
	}
}

function FnEditClient(){
	$("#gapp-addclient-form :input").prop("disabled", false);
	$("#gapp-client-save").prop("disabled", false);
	$('#tenantId').prop("disabled", true);
	$('.pageTitleTxt').text('Edit Client');
	$('#gapp-client-edit').hide();
}