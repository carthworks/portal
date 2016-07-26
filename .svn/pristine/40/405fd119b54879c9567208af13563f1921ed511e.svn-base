"use strict";

$(document).ready(function(){

	// Form Validation
	$("#gapp-fcu-form").kendoValidator({
										validateOnBlur : true,
										errorTemplate: "<span class='help-block'><code>#=message#</code></span>",
										rules : {
											available:function(input){
												var validate = input.data('available');
												var VarExist = true;
												if (typeof validate !== 'undefined' && validate !== false) {
													var url = input.data('available-url');
													var VarParam = {"domain": {"domainName": VarCurrentTenantInfo.tenantDomain},"fieldValues": [{"key": "entityName","value": FnTrim(input.val())}]};
													$.ajax({
														type:'POST',
														cache: true,
														async: false,
														contentType: 'application/json; charset=utf-8',
														url: "/portal/ajax" + url,
														data: JSON.stringify(VarParam),
														dataType: 'json',
														success: function(result) {
															var ObjExistStatus = result;																
															if(ObjExistStatus.status == 'SUCCESS'){ // Does not exist in db 
																VarExist = true;
															} else if(ObjExistStatus.status == 'FAILURE') { // Exist in db
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
	
	FnGetFacilityList();
	
	if(VarEditEquipId != ''){
		FnGetPointsTag();
		FnGetFCUEquipmentDetails(VarEditEquipId);
	}

});

var ArrPointsTag = [];
function FnGetPointsTag(){
	var VarUrl = '/portal/ajax' + VarPointTagsUrl;
	var VarParam = {};
	VarParam['domain'] = {"domainName" : VarLUDomainName};
	VarParam['entityTemplate'] = {"entityTemplateName" : "Skyspark point tag"};
	FnMakeAjaxRequest(VarUrl, 'POST', JSON.stringify(VarParam), 'application/json; charset=utf-8', 'json', FnResPointsTag);
}

function FnResPointsTag(response){
	var ArrResponse = response;
	var VarResCount = ArrResponse.length;
	
	if(VarResCount > 0){
		$.each(ArrResponse,function(){
			$(this.dataprovider).each(function() {
				var key = this.key;
				if(key == 'pointName'){
					ArrPointsTag.push({"name":this.value});
				}
			});
		});
	}
	
}

var GblFacilityTimeZones = {};
function FnGetFacilityList(){
	var VarUrl = '/portal/ajax' + VarListFacilityUrl;
	VarUrl = VarUrl.replace("{domain}",VarCurrentTenantInfo.tenantDomain);
	VarUrl = VarUrl.replace("{templatename}","AvocadoFacilityTemplate");	
	FnMakeAjaxRequest(VarUrl, 'GET', '', 'application/json; charset=utf-8', 'json', FnResFacilityList);
}

function FnResFacilityList(response){
	//console.log(response);
	var ArrResponse = response;
	var VarResLength = ArrResponse.length;
	if(VarResLength > 0){
		var ArrResponseData = [];
		$(ArrResponse).each(function(){
			var element = {};
			element['entity'] = {};
			element['entity']['domain'] = this.domain;
			element['entity']['entityTemplate'] = {"entityTemplateName":this.entityTemplate.entityTemplateName};
			element['entity']['globalEntity'] = this.globalEntity;
			element['entity']['identifier'] = this.identifier;
			var VarFName = '';
			$(this.dataprovider).each(function() {
				var key = this.key;
				if(key == 'facilityName'){
					element['text'] = this.value;
					VarFName = this.value;
				} else if(key == 'timeZone'){
					GblFacilityTimeZones[VarFName] = this.value;
				}
			});
			ArrResponseData.push(element);
		});
		
		var VarFacilityTxt = '';
		VarFacilityTxt += "<option value=''>Select Facility</option>";	
		
		$.each(ArrResponseData,function(key,obj){
			var VarOptionValue = JSON.stringify(obj['entity']);
			var VarOptionText = obj['text'];
			VarFacilityTxt += "<option value='"+VarOptionValue+"'>"+VarOptionText+"</option>";
		});
		
		$('#facility').html(VarFacilityTxt);
	}	
}

function FnGetFCUEquipmentDetails(VarEquipIdentifier){
	$("#gapp-fcu-form :input").prop("disabled", true);
	$('#gapp-fcu-save').attr('disabled',true);
	$("#gapp-fcu-cancel").prop("disabled", false);
	
	var VarUrl = '/portal/ajax' + VarViewEquipUrl;
	var VarParam = {};
	VarParam['domain'] = {"domainName" : VarCurrentTenantInfo.tenantDomain};
	VarParam['globalEntity'] = {"globalEntityType" : "MARKER"};
	VarParam['entityTemplate'] = {"entityTemplateName" : "AvocadoFCUTemplate"};
	VarParam['identifier'] = {"key": "identifier","value": VarEquipIdentifier};
	//console.log(VarParam);
	FnMakeAjaxRequest(VarUrl, 'POST', JSON.stringify(VarParam), 'application/json; charset=utf-8', 'json', FnResFCUEquipmentDetails);
}

function FnResFCUEquipmentDetails(response){
	//console.log(response);
	var ArrResponse = response;
	if(!$.isEmptyObject(ArrResponse)){
		$.each(ArrResponse['fieldValues'],function(key,obj){
			if($('#gapp-fcu-form #'+obj['key'])){
				if(obj['key'] != 'rfrVFD' && obj['key'] != 'sfrVFD' && obj['key'] != 'ees'){
					if(obj['key'] == 'facilityName'){
						$("#facility option:contains('"+obj['value']+"')").attr('selected', true);
					} else {
						$('#gapp-fcu-form #'+obj['key']).val(obj['value']);
					}
				} else if(obj['key'] == 'rfrVFD'){
					if(obj['value'] != undefined && obj['value'] == 'true'){
						$('#gapp-fcu-form #'+obj['key']).attr('checked',true);							
						FnreturnFanRatingChecked();
					} else {
						$('#gapp-fcu-form #'+obj['key']).attr('checked',false);
					}
				} else if(obj['key'] == 'sfrVFD'){
					if(obj['value'] != undefined && obj['value'] == 'true'){
						$('#gapp-fcu-form #'+obj['key']).attr('checked',true);							
						FnsupplyFanRatingChecked();
					} else {
						$('#gapp-fcu-form #'+obj['key']).attr('checked',false);
					}
				} else if(obj['key'] == 'ees'){
					if(obj['value'] != undefined && obj['value'] == 'true'){
						$('#gapp-fcu-form #'+obj['key']).attr('checked',true);							
					} else {
						$('#gapp-fcu-form #'+obj['key']).attr('checked',false);
					}
				}
			} else if(obj['key'] == 'facilityName'){
				$("#facility option:contains('"+obj['value']+"')").attr('selected', true);
			}
		});
		
		var ArrPoints = [];
		if(ArrResponse['points'] != undefined){
			$.each(ArrResponse['points'],function(){
				var element = {};
				$(this.dataprovider).each(function() {
					var key = this.key;
					var value = ((this.value != undefined)? this.value : "");
					element[key] = value;
				});
				element["identifier"] = this.identifier.value;
				element["status"] = this.entityStatus.statusName;
				ArrPoints.push(element);
			});
		}
		//console.log(ArrPoints);
		FnResFCUPointList(ArrPoints);
	}	
}

function FnResFCUPointList(ArrPoints){
		
	var ArrColumns = [{field: "pointId",title: "Point Id",width: 110},{field: "pointName",title: "Point Name",width: 100},{field: "dataType",title: "Data Type",width: 80,},{field: "physicalQuantity",title: "Physical Quantity",width: 80},{field: "unit",title: "Unit of Measurement",width: 100},{field: "tags",title: "Tags",editor:tagsDropdownEditor,width: 100}];
	var ObjGridConfig = {
		"scrollable" : false,
		"filterable" : { mode : "row" },
		"sortable" : true,
		"pageable" : { pageSize: 10,numeric: true,pageSizes: true,refresh: true },
		"selectable" : false,
		"editable": true
	};
	
	var dataSource = new kendo.data.DataSource({
		  data: ArrPoints,
		  schema   : {
				model: {
					pointId    : "pointId",
					fields: {
						pointId       : { type: 'string' },
						pointName       : { type: 'string' },
						dataType       : { type: 'string' },
						physicalQuantity: { type: 'string' },
						unit : { type: 'string' },
						tags   : { }
					}
				}
			}
		});
	
	$(".k-grid-content").mCustomScrollbar('destroy');
	FnDrawGridView('#gapp-fcupoint-list',ArrPoints,ArrColumns,ObjGridConfig);
			
}

function tagsDropdownEditor(container, options){
	
	var input = $("<select multiple='multiple'/>");
	input.attr("name", options.field);
	input.appendTo(container);
		
	input.kendoMultiSelect({
		dataValueField: "name",
		dataTextField: "name",
		dataSource: ArrPointsTag,
		autobind: false
    });
	 
}


//supply fan rating checkbox control
$(".gapp-sfcMakeModel").hide();
function FnsupplyFanRatingChecked(){
var sfcchecked = $("#sfrVFD").is(":checked");
	if(sfcchecked){
		$(".gapp-sfcMakeModel").fadeIn("slow");
	}else{
		$(".gapp-sfcMakeModel").fadeOut("slow");
	}
}

//return fan rating checkbox control
$(".gapp-rfcMakeModel").hide();
function FnreturnFanRatingChecked(){
var sfcchecked = $("#rfrVFD").is(":checked");
	if(sfcchecked){
		$(".gapp-rfcMakeModel").fadeIn("slow");
	}else{
		$(".gapp-rfcMakeModel").fadeOut("slow");
	}
}

function FnGetFormFieldValues(VarFrmId,VarAllowCond){
	var ArrFieldValuesJSONObj = [];
	$('#'+VarFrmId).find(VarAllowCond).each(function(){
		var ObjFieldMap = {};
		var VarFieldName = $(this).attr('name');
		var VarFieldValue = FnTrim($(this).val());
		if (!(typeof VarFieldValue === "undefined") && VarFieldValue!='') {
			if ($(this).is("[type='text']") || $(this).is("[type='email']") || $(this).is("[type='url']")) {
				if($(this).is("[type='text']") && $(this).hasClass('date-picker')){
					ObjFieldMap["key"] = VarFieldName;
					VarFieldValue = VarFieldValue.split("/");
					VarFieldValue = new Date(VarFieldValue[1]+'/'+VarFieldValue[0]+'/'+VarFieldValue[2]).getTime();
					ObjFieldMap["value"] = VarFieldValue.toString();
				} else {
					ObjFieldMap["key"] = VarFieldName;
					ObjFieldMap["value"] = VarFieldValue;
				}
			} else if($(this).is("select")){
				if($(this).attr('multiple') == undefined){
					if(VarFieldName=='facility'){
						ObjFieldMap["key"] = "facilityName";
					} else {
						ObjFieldMap["key"] = VarFieldName;
					}
					ObjFieldMap["value"] = FnTrim($(this).find('option:selected').text());
				} else {
					ObjFieldMap["key"] = VarFieldName;
					var ArrVal = VarFieldValue.split(',');
					ObjFieldMap["value"] = ArrVal;
				}
			} else if($(this).is("[type='checkbox']")){
				ObjFieldMap["key"] = VarFieldName;
				ObjFieldMap["value"] = ( ($(this).is(':checked') == true) ? "true" : "false" );
			}
			
			ArrFieldValuesJSONObj.push(ObjFieldMap);
		}
	});
	
	return ArrFieldValuesJSONObj;
}

function FnGetEquipmentTemplate(){
	var ObjTemplate = {};
	ObjTemplate['entityTemplate'] = {"entityTemplateName" : "AvocadoFCUTemplate"};
	if(VarEditEquipId != ''){
		ObjTemplate['identifier'] = {"key": "identifier","value": VarEditEquipId};
		ObjTemplate['domain'] = {"domainName": VarCurrentTenantInfo.tenantDomain};
		ObjTemplate['globalEntity'] = {"globalEntityType": "MARKER"};
	}
	return ObjTemplate;
}

function FnConstructSkySparkTags(){

	var ObjSkySparkTags = {};
	ObjSkySparkTags['facilityName'] = FnTrim($('#facility').find('option:selected').text());
	ObjSkySparkTags['client'] = VarCurrentTenantInfo.tenantName;
	ObjSkySparkTags['equipmentName'] = FnTrim($('#name').val());
	ObjSkySparkTags['equipmentId'] = FnTrim($('#equipmentId').val());
	ObjSkySparkTags['make'] = FnTrim($('#make').val());
	ObjSkySparkTags['model'] = FnTrim($('#model').val());
	ObjSkySparkTags['ees'] = (($('#ees').is(':checked') == true) ? true : false);
	ObjSkySparkTags['ahu'] = false;
	ObjSkySparkTags['fcu'] = true;
	ObjSkySparkTags['fahu'] = false;
	ObjSkySparkTags['airSide'] = true;
	ObjSkySparkTags['hvac'] = true;
	ObjSkySparkTags['hvacType'] = "Air Side";
	ObjSkySparkTags['floor'] = FnTrim($('#floor').val());
	ObjSkySparkTags['timeZone'] = FnTrim($('#timeZone').val());
		
	return ObjSkySparkTags;
	
}

function FnGetSkySparkPointTags(){
	var ArrTags = [];
	var ArrData = $('#gapp-fcupoint-list').data("kendoGrid").dataSource.data();
	//console.log(ArrData);
	//return false;
	var VarDataCount = ArrData.length;
	if(VarDataCount > 0){
		$.each(ArrData,function(key,obj){
			var element = {};
			element['pointId'] = obj['pointId'];
			element['identifier'] = obj['identifier'];
			var ArrPointTags = obj['tags'];
			if(ArrPointTags.length > 0){
				var VarPointTags = ArrPointTags.join(',');
			} else {
				var VarPointTags = '';
			}
			element['tags'] = VarPointTags;
			
			ArrTags.push(element);
		});
	}
	return ArrTags;
}


function FnSaveFCU(){
	$('#gapp-fcu-save, #gapp-fcu-cancel').attr('disabled',true);
	var validator = $("#gapp-fcu-form").data("kendoValidator");
	validator.hideMessages();
	//kendo.ui.progress($("#gapp-fcu-form"), true);
	$("#GBL_loading").show();
	if (validator.validate()) { //alert('success');
		if(VarEditEquipId == ''){ //Create FCU
		
			var VarUrl = '/portal/ajax' + VarCreateEquipUrl;
			//console.log(VarUrl);
			var VarParam = {};
			VarParam['equipment'] = FnGetEquipmentTemplate();
			VarParam['facility'] = JSON.parse($('#facility').val());
			VarParam['fieldValues'] = FnGetFormFieldValues("gapp-fcu-form","input[type=text],select,input[type=checkbox]");			
			VarParam['skySparkEquipmentTags'] = FnConstructSkySparkTags();
			//console.log(VarParam);
			
			FnMakeAsyncAjaxRequest(VarUrl, 'POST', JSON.stringify(VarParam), 'application/json; charset=utf-8', 'json', FnResSaveFCU);
			
		} else {
		
			var VarUrl = '/portal/ajax' + VarUpdateEquipUrl;
			var VarParam = {};
			VarParam['equipment'] = FnGetEquipmentTemplate();
			VarParam['fieldValues'] = FnGetFormFieldValues("gapp-fcu-form","input[type=text],select,input[type=checkbox]");
			VarParam['skySparkEquipmentTags'] = FnConstructSkySparkTags();
			VarParam['skySparkPointTags'] = FnGetSkySparkPointTags();
			//console.log(VarParam);
			FnMakeAsyncAjaxRequest(VarUrl, 'PUT', JSON.stringify(VarParam), 'application/json; charset=utf-8', 'json', FnResUpdateFCU);
			
		}
	} else {
		$('#gapp-fcu-save, #gapp-fcu-cancel').attr('disabled',false);
		//kendo.ui.progress($("#gapp-fcu-form"), false);
		$("#GBL_loading").hide();
		var errors = validator.errors();
		console.log(errors);
		return false;
	}
}

function FnResSaveFCU(response){
	//console.log(response);
	var ObjResponse = response;
	$('#gapp-fcu-save, #gapp-fcu-cancel').attr('disabled',false);
	//kendo.ui.progress($("#gapp-fcu-form"), false);
	$("#GBL_loading").hide();
	if(!$.isEmptyObject(ObjResponse)){
	
		if(ObjResponse.errorCode == undefined){
			FnAttachParentChildEntity(ObjResponse);
		} else {
			notificationMsg.show({
				message : ObjResponse['errorMessage']
			}, 'error');
		}
	
	} else {
		
		notificationMsg.show({
			message : 'Error'
		}, 'error');
		
	}
	
}

function FnResUpdateFCU(response){

	var ArrResponse = response;
	$('#gapp-fcu-save, #gapp-fcu-cancel').attr('disabled',false);
	//kendo.ui.progress($("#gapp-addfacility-form"), false);
	$("#GBL_loading").hide();
	if(ArrResponse.status == 'SUCCESS'){
				
		notificationMsg.show({
			message : 'updated successfully'
		}, 'success');
		
		//FnRedirect("/portal/equipments/fcu/list",2000);
		FnFormRedirect('gapp-fcu-list',GBLDelayTime);
		
	} else {
		notificationMsg.show({
			message : ArrResponse['errorMessage']
		}, 'error');
	}

}

function FnAttachParentChildEntity(ObjEquipmentEntity){
	var VarUrl = '/portal/ajax' + VarAttachParentUrl;
	var VarParam = {};
	VarParam['actor'] = ObjEquipmentEntity;
	VarParam['subjects'] = FnConstructSubjectsEntity();
	FnMakeAjaxRequest(VarUrl, 'POST', JSON.stringify(VarParam), 'application/json; charset=utf-8', 'json', FnResAttachParentChildEntity);
}

function FnResAttachParentChildEntity(response){
	var ObjResponse = response;
	if(ObjResponse.status == 'SUCCESS'){
		notificationMsg.show({
			message : 'created successfully'
		}, 'success');
		
		//FnRedirect("/portal/equipments/fcu/list",2000);
		FnFormRedirect('gapp-fcu-list',GBLDelayTime);
	} else {
		notificationMsg.show({
			message : ObjResponse['errorMessage']
		}, 'error');
	}
}

function FnConstructSubjectsEntity(){
	var ArrSubjects = [];
	
	if($('#facility').val() != ''){
		var ObjFacilityEntity = JSON.parse($('#facility').val());
		ArrSubjects.push(ObjFacilityEntity);
	}
	
	var ObjAirSide = FnGetAirSideEntity();
	ArrSubjects.push(ObjAirSide);
	
	return ArrSubjects;
}

function FnGetAirSideEntity(){
	var ObjAirSide = {};
	ObjAirSide["globalEntity"] = {"globalEntityType" : "MARKER"};
	ObjAirSide["domain"] = {"domainName" : VarAppRootDomain};
	ObjAirSide["entityTemplate"] = {"entityTemplateName": "System Type"};
	ObjAirSide["identifier"] = {"key": "identifier","value": "12b88f81-7394-4483-9d8b-0e98d2d8193b"};
	return ObjAirSide;
}

function FnCancelFCU(){
	/*var VarFrmObj = document.getElementById('gapp-fcu-form');
	VarFrmObj.reset();
	var validator = $("#gapp-fcu-form").data("kendoValidator");
	validator.hideMessages();*/
	
	if(GBLcancel > 0){
		$('#GBLModalcancel #hiddencancelFrm').val('gapp-fcu-list');
		$('#GBLModalcancel').modal('show');
	} else {
		$('#gapp-fcu-list').submit();
	}
}

function FnNavigateFCUList(){
	$('#gapp-fcu-list').submit();
}

function FnEditFCU(){
	$("#gapp-fcu-form :input").prop("disabled", false);
	$("#gapp-fcu-save").prop("disabled", false);
	$('#equipmentId, #facility, #timeZone').prop("disabled", true);
	$('#gapp-fcu-edit').hide();
}

function FnSetTimeZone(){
	
	if($('#facility').val() != ''){
		var VarFacilityName = FnTrim($('#facility').find('option:selected').text());
		$('#timeZone').val(GblFacilityTimeZones[VarFacilityName]);
	} else {
		$('#timeZone').val('');
	}
}

