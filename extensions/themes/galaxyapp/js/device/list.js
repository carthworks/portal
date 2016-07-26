"use strict";
$(document).ready(function () {
	
	//console.log(JSON.stringify(VarCurrentTenantInfo));
	//Splitter initiation from kendo
	var splitterElement = $("#splitter").kendoSplitter({
			panes : [{
					collapsible : true,
					size : '20%'
				}
			]
		});

	FnGetClientList();
	FnSetTenantDeviceParams();
	FnGetDeviceList(VarListDeviceUrl, VarMainParam);

});

function FnSetTenantDeviceParams() {

	//console.log(JSON.stringify(VarCurrentTenantInfo));
	
	//{"tenantName":"pcs","tenantDomain":"pcs.galaxy","parentDomain":"alpine.galaxy","time":"1460349465153"}

	if (VarCurrentTenantInfo.tenantDomain != VarAppRootDomain) {
		VarMainParam["domain"] = {
			"domainName" : VarCurrentTenantInfo.parentDomain
		};
		VarMainParam["entityTemplate"] = {
			"entityTemplateName" : "DefaultTenant"
		};
		VarMainParam["globalEntity"] = {
			"globalEntityType" : "TENANT"
		};
		
		VarMainParam["identifier"] = {
			"key" : "tenantId",
			"value" : VarCurrentTenantInfo.tenantId
		};

	}

}


var VarMainParam = {};
var isMainGrid = true;
function FnGetClientList() {
	var VarClientListUrl = GblAppContextPath + '/ajax' + VarListClientsUrl;
	VarClientListUrl = VarClientListUrl.replace("{domain}", VarCurrentTenantInfo.tenantDomain);

	var grid = $("#gapp-clients-list").data("kendoGrid");
	if (grid != null) {
		grid.destroy();
	}

	$("#gapp-clients-list").kendoGrid({
		toolbar : kendo.template($("#clientSearchtemplate").html()),
		dataSource : {
			type : "json",
			transport : {
				read : VarClientListUrl
			},
			schema : {
				data : function (response) {
					var ArrResponse = JSON.parse(response);
					var VarResLength = ArrResponse.length;
					var ArrResponseData = [];
					if (VarResLength > 0) {

						ArrResponse.unshift({
							"globalEntity" : {
								"globalEntityType" : "TENANT"
							},
							"domain" : {
								"domainName" : VarCurrentTenantInfo.parentDomain
							},

							"entityTemplate" : {
								"domain" : {
									"domainName" : VarCurrentTenantInfo.parentDomain
								},
								"entityTemplateName" : "DefaultTenant",
								"globalEntityType" : "TENANT"
							},
							"identifier" : {
								"key" : "tenantId",
								"value" : "All Devices"
							}
						});

						$(ArrResponse).each(function (index) {
							var element = {};
							$(this.dataprovider).each(function () {
								var key = this.key;

								if (key === 'entityName') {
									element['sourceId'] = this.value;
								} else {
									element[key] = this.value;
								}

							});
							element["parentDomain"] = this.domain.domainName;
							element["identifier"] = this.identifier.value;
							ArrResponseData.push(element);
						});

						return ArrResponseData;

					} else {
						/*if(ArrResponse['errorMessage'] != undefined){
						notificationMsg.show({
						message : ArrResponse['errorMessage']
						}, 'error');
						}*/
						return ArrResponseData;
					}

				},
				total : function (response) {
					return response.length;

				}
			},
			change : function (e) {
				$("#gapp-device-assign").attr("disabled", true);

				if (!isMainGrid) {
					FnGetDeviceList(VarListDeviceUrl, VarMainParam);
				}
				isMainGrid = true;
			}
		},
		sortable : false,
		scrollable : true,
		mobile : true,
		noRecords : {
			template : '<div class="Metronic-alerts alert alert-info fade in"><button type="button" class="close" aria-hidden="true"> </button> <i class="fa-lg fa fa-warning"></i> No client available ! </div>'
		},
		columns : [{
				field : "identifier",
				title : "Clients",
				width : 50,
				editable : false
			},

		],
		selectable : true,
		change : function (e) {

			var entityGrid = $("#gapp-clients-list").data("kendoGrid");
			var rows = entityGrid.select();
			if (rows.length == 1) {
				$("#gapp-device-assign").attr("disabled", false);
			} else {
				$("#gapp-device-assign").attr("disabled", true);
			}
			var selectedItem = entityGrid.dataItem(rows);

			if (selectedItem == null) {
				isMainGrid = true;
				FnGetDeviceList(VarListDeviceUrl, VarMainParam);
			} else {
				if (selectedItem.identifier == 'All Devices') {
					$("#gapp-device-assign").attr("disabled", true);
					isMainGrid = true;
					FnGetDeviceList(VarListDeviceUrl, VarMainParam);
				} else {
					isMainGrid = false;
					$("#gapp-clients-list table tr:first-child").removeClass('k-state-selected');
					
				//	console.log(JSON.stringify(selectedItem));

					var VarParam = {};

					VarParam["domain"] = {
						"domainName" : selectedItem.parentDomain
					};
				/*	VarParam["entityTemplate"] = {
						"entityTemplateName" : "DefaultTenant"
					};
					VarParam["globalEntity"] = {
						"globalEntityType" : "TENANT"
					};
				*/	
					VarParam["identifier"] = {
						"key" : "tenantId",
						"value" : selectedItem.tenantId
					};
					//	VarParam["identifier"] = { "key": "tenantId", "value": selectedItem.tenantId};
					
				//	console.log(JSON.stringify(VarParam));
					$('#tenant_name').val(JSON.stringify(VarParam));
					FnGetDeviceList(VarListDeviceUrl, VarParam);
				}
			}
		}

	});

}

function FnGetDeviceList(VarDeviceUrl, ObjParam) {

	var grid = $("#gapp-device-list").data("kendoGrid");
	if (grid != null) {
		grid.destroy();
	}

	$("#gapp-device-list").kendoGrid({
		height : 480,
		dataSource : {
			type : "json",
			transport : {
				read : {
					type : "POST",
					dataType : "json",
					contentType : "application/json",
					url : GblAppContextPath + "/ajax" + VarDeviceUrl,
					data : ObjParam
				},
				parameterMap : function (options, operation) {
					if (!$.isEmptyObject(ObjParam)) {
						var data = JSON.stringify(options);

					} else {
						var data = options;
					}
					return data;
				}
			},
			schema : {
				data : function (response) {
					var ArrResponse = response;
					var VarResLength = ArrResponse.length;

					if (VarResLength > 0) {
						var responseData = [];
						$(ArrResponse).each(function (index) {
							var element = {};
							$(this.dataprovider).each(function () {
								var key = this.key;
								if (key === 'entityName') {
									element['sourceId'] = this.value;
								} else {
									element[key] = this.value;
								}
							});
							element["identifier"] = this.identifier.value;
							responseData.push(element);
						});

						return responseData;
					}

				},
				total : function (response) {
					return response.length;
				},
				model : {
					fields : {
						sourceId : {
							type : "string"
						}
					}
				}
			},
			pageSize : 10,
			page : 1,
			heigjt : 440,
			serverPaging : false,
			serverFiltering : false,
			serverSorting : false,
			sort : {
				field : "sourceId",
				dir : "asc"
			}
		},
		selectable : "row",
		resizable : true,
		sortable : {
			mode : "single",
			allowUnsort : true
		},
		filterable : {
			mode : "row",
			extra : false
		},
		detailInit : FnGetConfigurations,
		pageable : {
			refresh : true,
			pageSizes : true,
			previousNext : true
		},
		columnMenu : {
			filterable : false,
			sortable : false
		},
		noRecords : {
			template : "<div class='Metronic-alerts alert alert-danger fade in'><button type='button' class='close' aria-hidden='true'> </button> <i class='fa-lg fa fa-warning'></i> No data available on current client </div>"
		},
		columns : [{
				field : "sourceId",
				title : "Source Id",
				width : 160
			}, {
				field : "deviceName",
				title : "Device Name",
				width : 160
			},
			/*  ,{
			field: "datasourceName",
			title: "Datasource Name",
			width:160
			}, */
			{
				field : "tags",
				title : "Tags"
			}, {
				field : "make",
				title : "Make"
			}, {
				field : "deviceType",
				title : "Type"
			}, {
				field : "model",
				title : "Model"
			}, {
				field : "protocol",
				title : "Protocol"
			}, {
				field : "version",
				title : "Version",
				width : 60
			}, {
				field : "networkProtocol",
				title : "Network Protocol"
			}, {
				title : "Action",
				template : "#= FnGenerateAction(publish) #",
				filterable : false,
				sortable : false,
				width : 160
			}
		]

	}).data("kendoGrid");

	$("#gapp-device-list").data("kendoGrid").tbody.on("click", ".grid-editdevice", function (e) {
		var tr = $(this).closest("tr");
		var data = $("#gapp-device-list").data('kendoGrid').dataItem(tr);
		$('#device_id').val(data.identifier);
		$('#gapp-device-view').submit();
	});

	$("#gapp-device-list").data("kendoGrid").tbody.on("click", ".grid-writeback", function (e) {
		var tr = $(this).closest("tr");
		var data = $("#gapp-device-list").data('kendoGrid').dataItem(tr);
		var VarDSName = '';
		if (data.publish == 'true') {
			VarDSName = data.datasourceName;
		}
		$('#gapp-device-writeback #ds_name').val(VarDSName);
		$('#gapp-device-writeback #source_id').val(data.sourceId);
		$("#gapp-device-writeback").submit();
	});

	$(window).resize(function () {
		$("#gapp-device-list").data("kendoGrid").resize();
		$('#deviceSection').css("width", "70%");
	});

	$("#searchClientId").keyup(function () {
		var val = $("#searchClientId").val();
		$("#gapp-clients-list").data("kendoGrid").dataSource.filter({
			logic : "or",
			filters : [{
					field : "identifier",
					operator : "contains",
					value : val
				}
			]
		});
	});
}

function FnGenerateAction(publish) {
	var VarActions = "<div class='diviceactions'>";
	if (ObjPageAccess['view'] == '1' && ObjPageAccess['edit'] == '1') {
		VarActions += "<a href='Javascript:void(0)' class='grid-editdevice'  data-toggle='tooltip' data-placement='bottom' title='View and Edit'><span class='glyphicon glyphicon-edit'></span></a>";
	}

	VarActions += "&nbsp&nbsp<a href='Javascript:void(0)' class='grid-writeback'><span class='glyphicon  glyphicon-pencil' data-toggle='tooltip' data-placement='bottom' title='Controls'></span></a>";

	VarActions += "</div>";
	return VarActions;
}

function FnGetConfigurations(e) {
	var url = VarListDeviceConfUrl.replace("{source_id}", e.data.sourceId);
	$("<div/>").appendTo(e.detailCell).kendoGrid({
		resizable : true,
		dataSource : {
			type : "json",
			transport : {
				read : GblAppContextPath + "/ajax" + url
			},
			schema : {
				data : function (response) {
					var ObjResponse = JSON.parse(response);
					if (!$.isEmptyObject(ObjResponse)) {
						var responseData = ObjResponse.configPoints;
						return responseData;
					}

				},
				total : function (response) {
					var ObjResponse = JSON.parse(response);
					if (!$.isEmptyObject(ObjResponse)) {
						if (ObjResponse.configPoints != undefined) {
							var ArrConfPoints = ObjResponse.configPoints;
							return ArrConfPoints.length;
						} else {
							return 0;
						}
					} else {
						return 0;
					}

				},
				model : {
					fields : {
						pointId : {
							type : "string"
						},
						pointName : {
							type : "string"
						},
						type : {
							type : "json"
						},
						physicalQuantity : {
							type : "json"
						},
						unit : {
							type : "json"
						}
					}
				}
			},
			pageSize : 10,
			page : 1,
			serverPaging : false,
			serverFiltering : false,
			serverSorting : false,
			sort : {
				field : "pointName",
				dir : "asc"
			}
		},
		selectable : "row",
		sortable : {
			mode : "single",
			allowUnsort : true
		},
		pageable : {
			refresh : true,
			pageSizes : true,
			previousNext : true
		},
		columnMenu : false,
		columns : [{
				field : "pointId",
				title : "Point Id",
				filterable : false,
			}, {
				field : "pointName",
				title : "Point Name",
				filterable : false,
			}, {
				field : "type",
				title : "Data Type",
				filterable : false,
			}, {
				field : "physicalQuantity",
				title : "Physical Quantity",
				filterable : false,
			}, {
				field : "unit",
				title : "Unit Of Measurement",
				filterable : false,
			}
		]

	});
}

/*
var ObjActorData={
"domain": {
// "domainName": VarAssignClientId.domain.domainName
"domainName": VarAppRootDomain
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
function FnAssignDevice() {
	var grid = $("#gapp-clients-list").data("kendoGrid");
	var selectedItem = grid.dataItem(grid.select());
	//$('#tenant_name').val(JSON.stringify(selectedItem));
	//$('#tenant_name').val(ObjActorData);
	$('#gapp-assign_device').submit();
}

function FnCreateDevice() {
	$('#gapp-device-create').submit();
}

function FnGotoChart() {
	//alert('FnGotoChart');
	$('#gapp-goto-chart').submit();
}
