"use strict";

$(document).ready(function(){

	// Form Validation
	$("#gapp-genset-form").kendoValidator({
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
														url: GblAppContextPath+"/ajax" + url,
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
	
		
	if(VarEditEquipId != ''){
		//FnGetPointsTag();
		FnGetGensetEquipmentDetails(VarEditEquipId);
	}
	
	$('#assetName, #engineMake, #engineModel').bind('keyup', function() {
		if(allFilled()) {$('#gapp-genset-save').removeAttr('disabled');}
		else {$('#gapp-genset-save').prop('disabled', true);}
	});
		function allFilled() {
			var filled = true;
			$('#assetName, #engineMake, #engineModel').each(function() {
				if ($(this).val() == '') {
					if($(this).val() == '') filled = false;
				}
			});
			return filled;
		}

});

var ArrPointsTag = [];
function FnGetPointsTag(){
	var VarUrl = GblAppContextPath+'/ajax' + VarPointTagsUrl;
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


function FnGetGensetEquipmentDetails(VarEquipIdentifier){
	$("#gapp-genset-form :input").prop("disabled", true);
	$('#gapp-genset-save').attr('disabled',true);
	$("#gapp-genset-cancel").prop("disabled", false);
	
	var VarUrl = GblAppContextPath+'/ajax' + VarViewEquipUrl;
	var VarParam = {};
	VarParam['domain'] = {"domainName" : VarCurrentTenantInfo.tenantDomain};
	VarParam['globalEntity'] = {"globalEntityType" : "MARKER"};
	VarParam['entityTemplate'] = {"entityTemplateName" : "Genset"};
	VarParam['identifier'] = {"key": "identifier","value": VarEquipIdentifier};
	//console.log(VarParam);
	FnMakeAjaxRequest(VarUrl, 'POST', JSON.stringify(VarParam), 'application/json; charset=utf-8', 'json', FnResGensetEquipmentDetails);
}

function FnResGensetEquipmentDetails(response){
	//console.log(response);
	var ArrResponse = response;
	if(!$.isEmptyObject(ArrResponse)){
		$.each(ArrResponse['fieldValues'],function(key,obj){
			if($('#gapp-genset-form #'+obj['key'])){
				$('#gapp-genset-form #'+obj['key']).val(obj['value']);
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
		FnResGensetPointList(ArrPoints);
	}	
}

function FnResGensetPointList(ArrPoints){
		
	//var ArrColumns = [{field: "pointId",title: "Point Id",width: 110},{field: "pointName",title: "Point Name",width: 100},{field: "dataType",title: "Data Type",width: 80,},{field: "physicalQuantity",title: "Physical Quantity",width: 80},{field: "unit",title: "Unit of Measurement",width: 100},{field: "tags",title: "Tags",editor:tagsDropdownEditor,width: 100}];
	var ArrColumns = [{field: "pointId",title: "Point Id",width: 110},{field: "pointName",title: "Point Name",width: 100},{field: "dataType",title: "Data Type",width: 80,},{field: "physicalQuantity",title: "Physical Quantity",width: 80},{field: "unit",title: "Unit of Measurement",width: 100}];
	
	var ObjGridConfig = {
		"scrollable" : false,
		"filterable" : { mode : "row" },
		"sortable" : true,
		"pageable" : { pageSize: 10,numeric: true,pageSizes: true,refresh: true },
		"selectable" : false,
		"editable": false
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
	FnDrawGridView('#gapp-gensetpoint-list',ArrPoints,ArrColumns,ObjGridConfig);
			
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
	ObjTemplate['entityTemplate'] = {"entityTemplateName" : "Genset"};
	ObjTemplate['domain'] = {"domainName": VarCurrentTenantInfo.tenantDomain};
	if(VarEditEquipId != ''){
		ObjTemplate['identifier'] = {"key": "identifier","value": VarEditEquipId};
		ObjTemplate['globalEntity'] = {"globalEntityType": "MARKER"};
	}
	return ObjTemplate;
}

function FnConstructSkySparkTags(){

	var ObjSkySparkTags = {};
	ObjSkySparkTags['facilityName'] = "cummins";
	ObjSkySparkTags['client'] = VarCurrentTenantInfo.tenantName;
	ObjSkySparkTags['equipmentName'] = FnTrim($('#assetName').val());
	ObjSkySparkTags['equipmentId'] = FnTrim($('#assetName').val());
	ObjSkySparkTags['make'] = FnTrim($('#engineMake').val());
	ObjSkySparkTags['model'] = FnTrim($('#engineModel').val());
	ObjSkySparkTags['genset'] = true;
			
	return ObjSkySparkTags;
	
}

function FnGetSkySparkPointTags(){
	var ArrTags = [];
	var ArrData = $('#gapp-gensetpoint-list').data("kendoGrid").dataSource.data();
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

function FnSaveGenset(){
	$('#gapp-genset-save, #gapp-genset-cancel').attr('disabled',true);
	var validator = $("#gapp-genset-form").data("kendoValidator");
	validator.hideMessages();
	//kendo.ui.progress($("#gapp-genset-form"), true);
	$("#GBL_loading").show();
	if (validator.validate()) { //alert('success');
		if(VarEditEquipId == ''){ //Create Genset
		
			var VarUrl = GblAppContextPath+'/ajax' + VarCreateEquipUrl;
			//console.log(VarUrl);
			var VarParam = {};
			VarParam['equipment'] = FnGetEquipmentTemplate();
			VarParam['fieldValues'] = FnGetFormFieldValues("gapp-genset-form","input[type=text]");			
			//VarParam['skySparkEquipmentTags'] = FnConstructSkySparkTags();
			//console.log(VarParam);
			
			FnMakeAsyncAjaxRequest(VarUrl, 'POST', JSON.stringify(VarParam), 'application/json; charset=utf-8', 'json', FnResSaveGenset);
			
		} else {
		
			var VarUrl = GblAppContextPath+'/ajax' + VarUpdateEquipUrl;
			var VarParam = {};
			VarParam['equipment'] = FnGetEquipmentTemplate();
			VarParam['fieldValues'] = FnGetFormFieldValues("gapp-genset-form","input[type=text]");
			//VarParam['skySparkEquipmentTags'] = FnConstructSkySparkTags();
			//VarParam['skySparkPointTags'] = FnGetSkySparkPointTags();
			VarParam['skySparkEquipmentTags'] = {};
			//console.log(VarParam);
			//return false;
			FnMakeAsyncAjaxRequest(VarUrl, 'PUT', JSON.stringify(VarParam), 'application/json; charset=utf-8', 'json', FnResUpdateGenset);
			
		}
	} else {
		$('#gapp-genset-save, #gapp-genset-cancel').attr('disabled',false);
		//kendo.ui.progress($("#gapp-genset-form"), false);
		$("#GBL_loading").hide();
		var errors = validator.errors();
		console.log(errors);
		return false;
	}
}

function FnResSaveGenset(response){
	//console.log(response);
	var ObjResponse = response;
	$('#gapp-genset-save, #gapp-genset-cancel').attr('disabled',false);
	//kendo.ui.progress($("#gapp-genset-form"), false);
	$("#GBL_loading").hide();
	if(!$.isEmptyObject(ObjResponse)){
	
		if(ObjResponse.errorCode == undefined){
			//FnAttachParentChildEntity(ObjResponse);
			FnAttachChildrenEntity(ObjResponse);
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

function FnResUpdateGenset(response){

	var ArrResponse = response;
	$('#gapp-genset-save, #gapp-genset-cancel').attr('disabled',false);
	//kendo.ui.progress($("#gapp-addfacility-form"), false);
	$("#GBL_loading").hide();
	if(ArrResponse.status == 'SUCCESS'){
				
		notificationMsg.show({
			message : 'updated successfully'
		}, 'success');
		
	
		FnFormRedirect('gapp-genset-list',GBLDelayTime);
		
	} else {
		notificationMsg.show({
			message : ArrResponse['errorMessage']
		}, 'error');
	}

}

function FnCreateTenantEntity(){

	var ObjTenantEntity = {};
	ObjTenantEntity['domain'] = {"domainName" : VarCurrentTenantInfo.parentDomain};
	ObjTenantEntity['entityTemplate'] = {"entityTemplateName" : "DefaultTenant"};
	ObjTenantEntity['globalEntity'] = {"globalEntityType" : "TENANT"};
	ObjTenantEntity['identifier'] = {"key": "tenantName","value": VarCurrentTenantInfo.tenantName};
	
	return ObjTenantEntity;
}


function FnAttachChildrenEntity(ObjEquipmentEntity){
	var VarUrl = GblAppContextPath+'/ajax' + VarAttachChildrenUrl;
	var VarParam = {};
	VarParam['actor'] = FnCreateTenantEntity();
	VarParam['subjects'] = [ObjEquipmentEntity];
	
	FnMakeAjaxRequest(VarUrl, 'POST', JSON.stringify(VarParam), 'application/json; charset=utf-8', 'json', FnResAttachChildrenEntity);
}

function FnResAttachChildrenEntity(response){
	var ObjResponse = response;
	if(ObjResponse.status == 'SUCCESS'){
		notificationMsg.show({
			message : 'created successfully'
		}, 'success');
		
		FnFormRedirect('gapp-genset-list',GBLDelayTime);
	} else {
		notificationMsg.show({
			message : ObjResponse['errorMessage']
		}, 'error');
	}
}

function FnAttachParentChildEntity(ObjEquipmentEntity){
	var VarUrl = GblAppContextPath+'/ajax' + VarAttachParentUrl;
	var VarParam = {};
	VarParam['actor'] = ObjEquipmentEntity;
	VarParam['subjects'] = FnConstructSubjectsEntity();
	FnMakeAjaxRequest(VarUrl, 'POST', JSON.stringify(VarParam), 'application/json; charset=utf-8', 'json', FnResAttachParentChildEntity);
}

function FnResAttachParentChildEntity(response){
	var ObjResponse = response;
	if(ObjResponse.status == 'SUCCESS'){
		notificationMsg.show({
			message : 'Created successfully'
		}, 'success');
		
		FnFormRedirect('gapp-genset-list',GBLDelayTime);
	} else {
		notificationMsg.show({
			message : ObjResponse['errorMessage']
		}, 'error');
	}
}

function FnConstructSubjectsEntity(){
	var ArrSubjects = [];
	var ObjTenant = {};
	ObjTenant['globalEntity'] = {"globalEntityType" : "TENANT"};
	ObjTenant["domain"] = {"domainName" : VarCurrentTenantInfo.tenantDomain};
	ObjTenant["entityTemplate"] = {"entityTemplateName": "DefaultTenant"};
	ObjTenant["identifier"] = {"key": "tenantName","value": VarCurrentTenantInfo.tenantName};
	ArrSubjects.push(ObjTenant);
	
	return ArrSubjects;
}

function FnCancelGenset(){
	/*var VarFrmObj = document.getElementById('gapp-genset-form');
	VarFrmObj.reset();
	var validator = $("#gapp-genset-form").data("kendoValidator");
	validator.hideMessages();*/
	
	if(GBLcancel > 0){
		$('#GBLModalcancel #hiddencancelFrm').val('gapp-genset-list');
		$('#GBLModalcancel').modal('show');
	} else {
		$('#gapp-genset-list').submit();
	}
}

function FnNavigateGensetList(){
	$('#gapp-genset-list').submit();
}

function FnEditGenset(){
	$("#gapp-genset-form :input").prop("disabled", false);
	$("#gapp-genset-save").prop("disabled", false);
	$('#assetName').prop("disabled", true);
	$('#gapp-genset-edit').hide();
}

function FnSetTimeZone(){
	
	if($('#facility').val() != ''){
		var VarFacilityName = FnTrim($('#facility').find('option:selected').text());
		$('#timeZone').val(GblFacilityTimeZones[VarFacilityName]);
	} else {
		$('#timeZone').val('');
	}
}

