
var VarTenantName = VarAssignClientId.identifier.value;

//console.log(JSON.stringify(VarTenantName));
//console.log( VarAssignClientId.identifier.key);
//console.log( VarAssignClientId.identifier.value);


$(document).ready(function () {
	$('#gapp-device-save').prop('disabled', true);
	$('#event_input_label').html('<strong>Client Name :<strong> <span class="font-red-sunglo" style="text-transform: Uppercase;" >' + VarTenantName + '</span>');
	var VarTenantDomainName = VarAssignClientId.domain.domainName;
	FnUnAssignedDevices(VarTenantDomainName);
});

/********************* Obj formation for Actor**************/
/*
var ObjActorData={
"domain": {
"domainName": VarAssignClientId.domain.domainName
},
"entityTemplate": {
"entityTemplateName": VarAssignClientId.entityTemplate.entityTemplateName
},
"globalEntity": {
"globalEntityType": VarAssignClientId.globalEntity.globalEntityType
},
"identifier": {
"key": VarAssignClientId.identifier.key,
"value": VarAssignClientId.identifier.value
}
};
 */
var ObjActorData = {
	"domain" : {
		"domainName" : VarAssignClientId.domain.domainName
	},
	"identifier" : {
		"key" : VarAssignClientId.identifier.key,
		"value" : VarAssignClientId.identifier.value
	}
};

function FnUnAssignedDevices(TenantDomainName) {

	var VarDomainName = VarAppRootDomain;
	if (VarCurrentTenantInfo.tenantDomain == VarAppRootDomain) {

		var VarUrl = GblAppContextPath + '/ajax' + VarSearchDeviceUrl;
		var VarParam = {
			"searchFields" : [{
					"key" : "allocated",
					"value" : "false"
				}
			],
			"returnFields" : ["entityName", "identifier", "deviceName"],
			"domain" : {
				"domainName" : VarDomainName
			},
			"entityTemplate" : {
				"entityTemplateName" : "Device"
			}
		};
		FnMakeAjaxRequest(VarUrl, 'POST', JSON.stringify(VarParam), 'application/json; charset=utf-8', 'json', FnResAdminAssignedDevices);
	} else {

		var VarUrl = GblAppContextPath + '/ajax' + VarSearchDeviceNewUrl;

		var VarParam = {
			"actor" : {
				"domain" : {
					"domainName" : VarCurrentTenantInfo.parentDomain
				},
				"identifier" : {
					"key" : "tenantId",
					"value" : VarCurrentTenantInfo.tenantId
				},
				"globalEntity" : {
					"globalEntityType" : "TENANT"
				},
				"entityTemplate" : {
					"entityTemplateName" : "DefaultTenant"
				}
			},
			"searchTemplateName" : "Point",
			"markerTemplateName" : "Device"
		};

		FnMakeAjaxRequest(VarUrl, 'POST', JSON.stringify(VarParam), 'application/json; charset=utf-8', 'json', FnResAssignedDevices);

	}

}

function FnResAdminAssignedDevices(response) {

	var ArrResponse = response;
	var VarResLength = ArrResponse.length;
	var ArrResponseData = [];
	if (VarResLength > 0) {
		if (response != null) {

			$(ArrResponse).each(function () {
				var element = {};
				$(this.returnFields).each(function () {
					if (this.key == 'entityName') {
						value = this.value;
						element["sourceId"] = value;
					}
				});
				$(this.returnFields).each(function () {
					if (this.key == 'deviceName') {
						value = this.value;
						element["deviceName"] = value;
					}
				});

				$(this.identifier).each(function () {
					if (this.key == 'identifier') {
						value = this.value;
						element["identifier"] = value;
					}
				});

				ArrResponseData.push(element);

			});

		}

	}

	$("#device_inputlist").kendoGrid({
		dataSource : {
			data : ArrResponseData,
			schema : {
				model : {
					fields : [{
							headerTemplate : '<input type="checkbox" style="padding:0 0 0 12px !important;text-align: center !important;" name="checkAll" id="checkAll" onClick="checkAllBoxClick();">',
							template : "<input type='checkbox' id='#=sourceId#' onClick='checkBoxClick(this);'>",
							filterable : false,
							sortable : false,
							width : 60
						}, {
							field : "sourceId",
							title : "Source Id",
							template : "<div style='text-align: left;text-transform: capitalize; padding: 0 0 0 4px;'>#=sourceId#</div>",
							width : 300
						}, {
							field : "deviceName",
							title : "Device Name",
							attributes : {
								"class" : "table-cell",
								style : "text-align: left; font-size: 14px"
							}
							//, template:"<div style='text-align: left;text-transform: capitalize; padding: 0 0 0 4px;'>#=deviceName#</div>"

						}
					]
				}
			},
			pageSize : 20
		},
		height : 0,
		scrollable : false,
		filterable : {
			mode : "row"
		},
		sortable : true,
		height : 0,
		pageable : {
			pageSize : 10,
			numeric : true,
			pageSizes : true,
			refresh : true
		},
		selectable : true,
		dataBound : onDataBound,
		noRecords : true,
		messages : {
			noRecords : "<div class='Metronic-alerts alert alert-info fade in'> <i class='fa-lg fa fa-warning'></i> There is no data on current page </div>",

		},
		columns : [{
				headerTemplate : '<input type="checkbox" style="padding:0 0 0 12px !important;text-align: center !important;" name="checkAll" id="checkAll" onClick="checkAllBoxClick();">',
				template : "<input type='checkbox' id='#=sourceId#' onClick='checkBoxClick(this);'>",
				filterable : false,
				sortable : false,
				width : 60
			}, {
				field : "sourceId",
				title : "Source Id",
				template : "<div style='text-align: left;text-transform: capitalize; padding: 0 0 0 4px;'>#=sourceId#</div>",
				width : 300
			}, {
				field : "deviceName",
				title : "Device Name"

			}
		]
	});

}

function FnResAssignedDevices(response) {
	var ArrResponse = response;

	var VarResLength = ArrResponse.length;
	var ArrResponseData = [];

	if (VarResLength > 0) {

		//if( ArrResponse !== null){

		$(ArrResponse).each(function (key, val) {
			var element = {};

			$(val.identifier).each(function (keyy, vall) {

				if (vall.key == 'identifier') {
					value = vall.value;
					element["identifier"] = value;
				}
			});

			$(val.dataprovider).each(function (keyy, vall) {

				if (vall.key == 'identifier') {
					value = vall.value;
					element["identifier"] = value;
				}

				if (vall.key == 'entityName') {
					value = vall.value;
					element["sourceId"] = value;
				}
				if (vall.key == 'deviceName') {
					value = vall.value;
					element["deviceName"] = value;
				}

			});

			ArrResponseData.push(element);

		});

	} else {

		notificationMsg.show({
			message : 'Null Object'
		}, 'error');

	}

	$("#device_inputlist").kendoGrid({
		dataSource : {
			data : ArrResponseData,
			schema : {
				model : {
					fields : [{
							headerTemplate : '<input type="checkbox" style="padding:0 0 0 12px !important;text-align: center !important;" name="checkAll" id="checkAll" onClick="checkAllBoxClick();">',
							template : "<input type='checkbox' id='#=sourceId#' onClick='checkBoxClick(this);'>",
							filterable : false,
							sortable : false,
							width : 60
						}, {
							field : "sourceId",
							title : "Source Id",
							template : "<div style='text-align: left;text-transform: capitalize; padding: 0 0 0 4px;'>#=sourceId#</div>",
							width : 300
						}, {
							field : "deviceName",
							title : "Device Name",
							attributes : {
								"class" : "table-cell",
								style : "text-align: left; font-size: 14px"
							}

						}
					]
				}
			},
			pageSize : 20
		},
		height : 0,
		scrollable : false,
		filterable : {
			mode : "row"
		},
		sortable : true,
		height : 0,
		pageable : {
			pageSize : 10,
			numeric : true,
			pageSizes : true,
			refresh : true
		},
		selectable : true,
		dataBound : onDataBound,
		noRecords : true,
		messages : {
			noRecords : "<div class='Metronic-alerts alert alert-info fade in'> <i class='fa-lg fa fa-warning'></i> There is no data on current page </div>",

		},
		columns : [{
				headerTemplate : '<input type="checkbox" style="padding:0 0 0 12px !important;text-align: center !important;" name="checkAll" id="checkAll" onClick="checkAllBoxClick();">',
				template : "<input type='checkbox' id='#=sourceId#' onClick='checkBoxClick(this);'>",
				filterable : false,
				sortable : false,
				width : 60
			}, {
				field : "sourceId",
				title : "Source Id",
				template : "<div style='text-align: left;text-transform: capitalize; padding: 0 0 0 4px;'>#=sourceId#</div>",
				width : 300
			}, {
				field : "deviceName",
				title : "Device Name"
				//, template:"<div style='text-align: left;text-transform: capitalize; padding: 0 0 0 4px;'>#=deviceName#</div>"

			}
		]
	});

}

function onDataBound(e) {
	var view = this.dataSource.view();

	var VarChkCnt = 0;
	for (var i = 0; i < view.length; i++) {

		if ($.inArray(view[i].sourceId, ArrSelPoints) != -1) {
			this.tbody.find("input[id='" + view[i].sourceId + "']").prop("checked", true).closest("tr").addClass('k-state-selected');
			VarChkCnt++;
		}
	}

	var VarViewLength = view.length;

	if (VarViewLength > 0 && VarViewLength == VarChkCnt) {
		$("#checkAll").prop("checked", true);
	} else {
		$("#checkAll").prop("checked", false);
	}

}

var ArrSelPoints = [];
function checkAllBoxClick() {
	$('#gapp-device-save').prop('disabled', false);
	var grid = $('#device_inputlist').data("kendoGrid");
	if ($("#checkAll").is(":checked")) {
		//Select all rows on screen
		grid.tbody.children('tr').addClass('k-state-selected');
		$('#device_inputlist').find('input[type=checkbox]').prop("checked", true);
		//var ArrDisplayedData = grid.dataSource.view().toJSON();
		var ArrDisplayedData = grid.dataSource.view();

		$.each(ArrDisplayedData, function () {
			if ($.inArray(this.sourceId, ArrSelPoints) == -1) {
				ArrSelPoints.push(this.sourceId);
			}
		});

	} else {
		grid.tbody.children('tr').removeClass('k-state-selected');
		$('#device_inputlist').find('input[type=checkbox]').prop("checked", false);
		var ArrDisplayedData = grid.dataSource.view();

		$.each(ArrDisplayedData, function () {
			ArrSelPoints.splice($.inArray(this.sourceId, ArrSelPoints), 1);

		})
	}

	if (ArrSelPoints.length > 0) {
		$('#gapp-mappoint-save').prop('disabled', false);
	} else {
		$('#gapp-mappoint-save').prop('disabled', true);
	}

}
function checkBoxClick(VarThis) {
	$('#gapp-device-save').prop('disabled', false);
	$("#checkAll").prop("checked", false);
	var check = $('#device_inputlist').find('input[type="checkbox"]:checked').length;
	var checkAll = $('#device_inputlist').find('input[type="checkbox"]').length;

	var VarSelItem = $(VarThis).attr('id');
	if ($(VarThis).is(':checked') == true) {
		if ($.inArray(VarSelItem, ArrSelPoints) == -1) {
			$(VarThis).closest("tr").addClass('k-state-selected');
			ArrSelPoints.push(VarSelItem);
		}
	} else {
		$(VarThis).closest("tr").removeClass('k-state-selected');
		ArrSelPoints.splice($.inArray(VarSelItem, ArrSelPoints), 1);
	}

	//Check the header checkbox if all row checkboxes on screen are selected
	if (check == (checkAll - 1))
		$("#checkAll").prop("checked", true);

	if (ArrSelPoints.length > 0) {
		$('#gapp-mappoint-save').prop('disabled', false);
	} else {
		$('#gapp-mappoint-save').prop('disabled', true);
	}

}

function FnAssignDevice() {
	var ArrEquipments = FnGetSelectedDevices();
	var subjects = [];
	subjects.push(ArrEquipments);

	if (ArrEquipments.length > 0) {
		$("#GBL_loading").show();
		var payload = {};
		var subjects = [];

		//subjects.push(JSON.parse());
		payload.actor = ObjActorData;
		payload.subjects = ArrEquipments;
		var VarUrl = GblAppContextPath + '/ajax' + VarAssignDeviceUrl;

		//	console.log(JSON.stringify(payload));
		FnMakeAsyncAjaxRequest(VarUrl, 'POST', JSON.stringify(payload), 'application/json; charset=utf-8', 'json', FnResAssignDevice);

	}
}

function FnResAssignDevice(response) {
	var ArrResponse = response;
	var VarResLength = ArrResponse.length;
	$("#GBL_loading").hide();
	if (!$.isEmptyObject(ArrResponse)) {
		if (ArrResponse.errorCode == "505") {
			notificationMsg.show({
				message : ArrResponse.errorMessage
			}, 'error');
		} else {

			$.each(ArrResponse.responses, function (key, val) {
				if (val.reference == "Hierarchy Update") {
					if (val.status == "SUCCESS") {
						ArrResponse.status = val.status;
						notificationMsg.show({
							message : 'Devices assigned successfully'
						}, 'success');
						FnFormRedirect('gapp-device-list', GBLDelayTime);

					}
				}
			});

		}
	} else {
		notificationMsg.show({
			message : "No available data "
		}, 'error');
	}

}

function FnGetSelectedDevices() {
	var ArrEquipments = [];
	var subjectsContent = {};
	var grid = $("#device_inputlist").data("kendoGrid");
	var ds = grid.dataSource.data();

	for (var i = 0; i < ds.length; i++) {
		//var row = grid.table.find("tr[data-uid='" + ds[i].uid + "']");
		if ($.inArray(ds[i].sourceId, ArrSelPoints) !== -1) {
			var identifierValue = ds[i].identifier;

			/*		subjectsContent =   {
			"globalEntity": {
			"globalEntityType": "MARKER"
			},
			"domain": {
			"domainName": VarAppRootDomain
			},
			"entityTemplate": {
			"domain": {
			"domainName": VarAppRootDomain
			},
			"entityTemplateName": "Device",
			"globalEntityType": "MARKER"
			},
			"identifier": {
			"key": "identifier",
			"value": identifierValue
			}
			};	*/

			subjectsContent = {

				"domain" : {
					"domainName" : VarAppRootDomain
				},
				"identifier" : {
					"key" : "identifier",
					"value" : identifierValue
				}
			};

			ArrEquipments.push(subjectsContent);
		}
	}
	//console.log(JSON.stringify(ArrEquipments));
	return ArrEquipments;
}

function createIdentifier(row) {
	var identifierJson = {};
	identifierJson["globalEntity"] = row.globalEntity;
	identifierJson["domain"] = row.domain;
	identifierJson["entityTemplate"] = row.entityTemplate;
	identifierJson["identifier"] = row.identifier;
	return identifierJson;
}

/***** BEGIN: Assign button operations *******/
$('#btnRight').click(function (e) {
	$("#outputlistval").hide();
	var selectedOpts = $('#event_inputlist option:selected');
	if (selectedOpts.length == 0) {
		//alert("Nothing to move.");
		notificationMsg.show({
			message : 'Nothing to move'
		}, 'error');
		e.preventDefault();
	}
	$('#gapp-device-save').prop('disabled', false);
	$('#event_outputlist').append($(selectedOpts).clone());
	$(selectedOpts).remove();
	e.preventDefault();
});

$('#btnLeft').click(function (e) {
	var selectedOpts = $('#event_outputlist option:selected');
	if (selectedOpts.length == 0) {
		//alert("Nothing to move.");
		notificationMsg.show({
			message : 'Please select a device'
		}, 'error');
		e.preventDefault();
	}
	$('#gapp-device-save').prop('disabled', false);
	$('#event_inputlist').append($(selectedOpts).clone());
	$(selectedOpts).remove();
	e.preventDefault();
});

$('#btnLeftall').click(function (e) {
	var selectedOpts = $('#event_outputlist option');
	if (selectedOpts.length == 0) {
		e.preventDefault();
	}
	$('#gapp-device-save').prop('disabled', false);
	$('#event_inputlist').append($(selectedOpts).clone());
	$(selectedOpts).remove();
	e.preventDefault();
});

$('#btnRightall').click(function (e) {
	var selectedOpts = $('#event_inputlist option');
	if (selectedOpts.length == 0) {
		notificationMsg.show({
			message : 'Please select a device'
		}, 'error');
		e.preventDefault();
	}
	$('#gapp-device-save').prop('disabled', false);
	$('#event_outputlist').append($(selectedOpts).clone());
	$(selectedOpts).remove();
	e.preventDefault();
});

/***** END: Assign button operations *******/

function FnCancelDevice() {

	if (GBLcancel > 0) {
		$('#GBLModalcancel #hiddencancelFrm').val('gapp-device-list');
		$('#GBLModalcancel').modal('show');
	} else {
		//	$('#gapp-device-list').submit();
		FnFormRedirect('gapp-device-list', GBLDelayTime);
	}

}

function FnNavigateDeviceList() {
	$('#gapp-device-list').submit();
}
