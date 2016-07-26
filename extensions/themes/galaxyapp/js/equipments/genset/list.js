"use strict";

$(document).ready(function(){
	$(".k-grid-content").css("overflow", "scroll").css("overflow-x", "auto").scroll(function() {
		var left = $(this).scrollLeft();
		var wrap = $(".k-grid-header-wrap");
		if (wrap.scrollLeft() != left) wrap.scrollLeft(left);
	});
	
	FnGetGensetList();	
});

function FnGetGensetList(){
	var VarUrl = GblAppContextPath+'/ajax' + VarListEquipUrl;
	var VarParam = {};
	VarParam['domain'] = {"domainName" : VarCurrentTenantInfo.tenantDomain};
	VarParam['entityTemplate'] = {"entityTemplateName" : "Genset"};
	FnMakeAjaxRequest(VarUrl, 'POST', JSON.stringify(VarParam), 'application/json; charset=utf-8', 'json', FnResGensetList);	
}

function FnResGensetList(response){	
	var ArrResponse = response;
	//console.log(ArrResponse);
	var VarResLength = ArrResponse.length;
	var ArrResponseData = [];
	if(VarResLength > 0){
		$(ArrResponse).each(function(){
			var element = {};
			element["domainName"] = this.domain.domainName;
			element["globalEntityType"] = this.globalEntity.globalEntityType;
			element["entityTemplateName"] = this.entityTemplate.entityTemplateName;
			$(this.dataprovider).each(function() {
				var key = this.key;
				var value = ((this.value != undefined)? this.value : "");
				element[key] = value;
			});
			element["identifier"] = this.identifier.value;
			element["status"] = this.entityStatus.statusName;
			ArrResponseData.push(element);
		});
	}
		
	var ViewLink = (ObjPageAccess['view']=='1') ? "<a class='grid-genset-view capitalize'>#=assetName#</a>" : "<a href='Javascript:void(0)' class='capitalize'>#=assetName#</a>";
	
	
	var PointMapLink = (ObjPageAccess['mappoint']=='1') ? " &nbsp  &nbsp  <a class='grid-genset-mappoints btn btn-sm btn-raised default' data-toggle='tooltip' data-placement='left' title='Map points'><i class='fa fa-link' style='color:darkcyan'></i></a>" : "";
	
	
	

	var VarActionsLink = '<div class="genset-actions">';
	VarActionsLink += '<a  href="javascript:void(0);" class="grid-genset btn btn-sm btn-raised default "  data-toggle="tooltip" data-placement="bottom" title="Dashboard:  #=assetName#"><i class="fa fa-tachometer " style="color:darkcyan"></i></a>'+PointMapLink;
	VarActionsLink += '</div>';
	

	
	var ArrColumns = [
						{
							field: "assetName",
							title: "Asset Name",
							template: ViewLink,
							width: 80
						},
						{
							field: "engineMake",
							title: "Engine make",
							width: 80
						},
						{
							field: "engineModel",
							title: "Engine model",
							width: 80
						},
						{
							field: "engineBuild",
							title: "Engine build",
							width: 80
						},
						{
							  title: "Action",
							  template: VarActionsLink,								  
							  filterable: false,
							  sortable: false,
							  width:120
						 }
						/* 		
						 ,{
							field: "setOutput",
							title: "Set output",
							width: 100
						},
						{
							field: "primeRating",
							title: "Prime rating",
							width: 100
						},
						{
							field: "cylinders",
							title: "Cylinders",
							width: 100
						},
				
						{
							field: "standardGovernor",
							title: "Standard Governor/Class",
							width: 100
						},
						{
							field: "boreAndStroke",
							title: "Bore and stroke",
							width: 100
						},
						{
							field: "compressionRatio",
							title: "Compression ratio",
							width: 120
						},
						{
							field: "cubicCapacity",
							title: "Cubic capacity",
							width: 100
						},
						{
							field: "batteryCapacity",
							title: "Battery capacity",
							width: 100
						},
						{
							template: PointMapLink,
							filterable: false,
							sortable: false,
							width:120
						}*/
					
					];
		
	var ObjGridConfig = {
		"scrollable" : true,
		"filterable" : { mode : "row" },
		"sortable" : true,
		"height" : 490,
		"pageable" : { pageSize: 10,numeric: true,pageSizes: true,refresh: false },
		"selectable" : true
		
	};
	
	$(".k-grid-content").mCustomScrollbar('destroy');
	FnDrawGridView('#gapp-genset-list',ArrResponseData,ArrColumns,ObjGridConfig);
	
	$("#gapp-genset-list").data("kendoGrid").tbody.on("click", ".grid-genset-view", function(e) {
		var tr = $(this).closest("tr");
		var data = $("#gapp-genset-list").data('kendoGrid').dataItem(tr);
		data = data.identifier;
		$( "#equip_id").val(data);
		$("#gapp-genset-view").submit();
	});
	
	$("#gapp-genset-list").data("kendoGrid").tbody.on("click", ".grid-genset-mappoints", function(e) {
		var tr = $(this).closest("tr");
		var data = $("#gapp-genset-list").data('kendoGrid').dataItem(tr);
		
		FnSubmitEquipmentMapPoints(data);
	});
	
	
	$("#gapp-genset-list").data("kendoGrid").tbody.on("click", ".grid-genset", function(e) {
		var tr = $(this).closest("tr");
		var data = $("#gapp-genset-list").data('kendoGrid').dataItem(tr);
		console.log(data.identifier);
		
		var equipmentId = data.identifier;
		//data = JSON.stringify(data);
		
		$('#dashboard_equip_id').val(equipmentId);		
		// submit hidden form
		$('#gapp-genset-dashboard').submit();
	});
	
}

function FnSubmitEquipmentMapPoints(ObjEquipment){
	
	var ObjEquipmentEntity = {};
	ObjEquipmentEntity['equipment'] = {};
	ObjEquipmentEntity['equipment']['identifier'] = {"key": "identifier","value": ObjEquipment.identifier};
	ObjEquipmentEntity['equipment']['domain'] = {"domainName": ObjEquipment.domainName};
	ObjEquipmentEntity['equipment']['entityTemplate'] = {"entityTemplateName": ObjEquipment.entityTemplateName};
	//ObjEquipmentEntity['equipment']['globalEntity'] = {"globalEntityType": ObjEquipment.globalEntityType};
	ObjEquipmentEntity['equipmentId'] = ObjEquipment.assetName;
	ObjEquipmentEntity['facilityName'] = "cummins";
	
	$( "#equip_entity").val(JSON.stringify(ObjEquipmentEntity));
	$("#gapp-genset-pointmapping").submit();
}

function FnCreateGenset(){
	$('#gapp-genset-create').submit();
}
	
	
