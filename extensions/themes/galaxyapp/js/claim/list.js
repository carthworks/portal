"use strict";

$(document).ready(function(){	
	
	FnGetDeviceList(VarListUnsubscribedUrl);
		
		$('#claim_device').attr('disabled','disabled');
});


//$("#claim_device").attr('disabled','disabled');
var VarMainParam = {};
var isMainGrid = true;



function FnGetDeviceList(VarDeviceUrl){
	
	$("#claim_device_grid").kendoGrid({
								height: 480,
								dataSource: {
									type: "json",
									transport: {
										read: {
											type : "GET",
											dataType : "json",
											contentType : "application/json",
											url : GblAppContextPath+"/ajax" + VarDeviceUrl																		
										}
									},
									schema: {
										data: function(response) {
											var ArrResponse = response;																
											var VarResLength = ArrResponse.length;
											//console.log(VarResLength);
											//console.log(ArrResponse.);				
											
											if (VarResLength > 0) {
												
												var responseData = [];
												$(ArrResponse).each(function(key,obj) {
													var element = {};
													element["sourceId"] = obj['sourceId'];
													element["deviceId"] = obj['deviceId'];
													element["tags"] = obj['tags'];
													element["unitId"] = obj['unitId'];
													element["deviceIp"] = obj['ip'];
													element["devicePort"] = obj['connectedPort'];
													element["wbPort"] = obj['writeBackPort'];
													element["latitude"] = obj['latitude'];
													element["longitude"] = obj['longitude'];
													element["deviceName"] = obj['deviceName'];
													
													if(obj['isPublishing'] == true){
														element["datasourceName"] = obj['datasourceName'];
													} else {
														element["datasourceName"] = "";
													}
													
													if(obj['networkProtocol']){														
														element["networkProtocol"] =  obj['networkProtocol'].name;
													} 
													$.each(["make","deviceType","model","protocol","version"],function(key1,val1){				
														element[val1] = obj['version'][val1];														
													});
													
													
													responseData.push(element);
												});
												console.clear();
												//console.log(JSON.stringify(responseData));
												return responseData;												
											} 
											
											else{
												notificationMsg.show({
																message : ArrResponse.errorMessage
															}, 	'error');
												
												
											}
										},				            
										total: function(response) {
											return response.length;
										},
										model: {
											fields: {
												sourceId: {
													type: "string"
												}
											}
										}
									},
									pageSize: 10,
									page: 1,
									serverPaging: false,
									serverFiltering: false,
									serverSorting: false,
									sort: { field: "sourceId", dir: "asc" }
								},
								selectable: "row",
								resizable: true,
								sortable: {
									mode: "single",
									allowUnsort: true
								},
								filterable : {
									mode : "row",
									extra: false
								},
								//detailInit: FnGetConfigurations,
								pageable: {
									refresh: true,
									pageSizes: true,
									previousNext: true
								},
								 noRecords: {
										template: "<div style='text-align: center !important; padding: 12px 0 0 0; color: black;'>No data available on current page.</div>"
									  },
								columnMenu: {
									filterable: false,
									sortable:false
								},
								change: onChange,
								columns: [
										  {
											  field: "sourceId",
											  title: "Source Id"
											//  template:" <a  href='Javascript:void(0)' class='grid-editdevice' style='text-transform:capitalize'  data-toggle='tooltip' data-placement='bottom' title='View' >#=sourceId#</a>"
										  },  {
											  field: "deviceName",
											  title: "Device Name"
										  },/*  {
											  field: "tags",
											  title: "Tags"
										  }
										  , */{
											  field: "make",
											  title: "Make"
										  },{
											  field: "deviceType",
											  title: "Type"
										  }
										  , {
											  field: "model",
											  title: "Model"
										  }, {
											  field: "protocol",
											  title: "Protocol"
										  }, {
											  field: "version",
											  title: "Version"
										  },  {
											  field: "networkProtocol",
											  title: "Network Protocol"
										  }
										
								]

	}).data("kendoGrid");

	$("#claim_device_grid").data("kendoGrid").tbody.on("click", ".grid-editdevice", function(e) {
		var tr = $(this).closest("tr");
		var data = $("#claim_device_grid").data('kendoGrid').dataItem(tr);
		data = data.sourceId		
		$('#claim_id').val(data);
		$('#gapp-claim-view01').submit();
	});

		

	$(window).resize(function(){
		$("#claim_device_grid").data("kendoGrid").resize();
		$('#deviceSection').css("width", "70%");
	});

}
	
	
	function onChange(arg) {
	var grid = $("#claim_device_grid").data("kendoGrid");	;
	if (grid.select().length == 1) {
		//$('#claim_device').prop("disabled", false);
		$('#claim_device').removeAttr('disabled');
	} else {
		//$('#claim_device').prop("disabled", true);
		$('#claim_device').attr('disabled','disabled');
	}
}



function claimDevice(){
	var grid = $("#claim_device_grid").data("kendoGrid");
	var selectedItem = grid.dataItem(grid.select());
	if (selectedItem == null || selectedItem === "undefined") {
		//alert("Please select a row");
		return;
	}	
		//console.log(JSON.stringify(selectedItem));		
		var data = selectedItem.sourceId;

		var StringSelectedItem =JSON.stringify(selectedItem);
		$('#claim_id').val(StringSelectedItem);
		//console.log(StringSelectedItem);
		$('#gapp-claim-view01').submit();
	
	
}
	

