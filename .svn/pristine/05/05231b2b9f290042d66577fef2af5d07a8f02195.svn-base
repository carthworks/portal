"use strict";

$(document).ready(function(){
	$(".k-grid-content").css("overflow", "scroll").css("overflow-x", "auto").scroll(function() {
		var left = $(this).scrollLeft();
		var wrap = $(".k-grid-header-wrap");
		if (wrap.scrollLeft() != left) wrap.scrollLeft(left);
	});
	
	FnGetSUList();	
});

function FnGetSUList(){
	var VarUrl = '/portal/ajax' + VarListEquipUrl;
	var VarParam = {};
	VarParam['domain'] = {"domainName" : VarCurrentTenantInfo.tenantDomain};
	VarParam['entityTemplate'] = {"entityTemplateName" : "AvocadoSplitUnitTemplate"};
	FnMakeAjaxRequest(VarUrl, 'POST', JSON.stringify(VarParam), 'application/json; charset=utf-8', 'json', FnResSUList);	
}

function FnResSUList(response){
	var ArrResponse = response;
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
				element[key] = this.value;
			});
			element["identifier"] = this.identifier.value;
			element["status"] = this.entityStatus.statusName;
			ArrResponseData.push(element);
		});
	}
	//console.log(ArrResponseData);
	
	var ViewLink = (ObjPageAccess['view']=='1') ? "<a class='grid-su-view'>#=name#</a>" : "<a href='Javascript:void(0)'>#=name#</a>";
	var PointMapLink = (ObjPageAccess['mappoint']=='1') ? "<a class='grid-su-mappoints btn btn-raised default'>Map Points</a>" : "";
	
	var ArrColumns = [
						{
							field: "name",
							title: "Name",
							template: ViewLink,
							width: 110
						},
						{
							field: "equipmentId",
							title: "Equipment Id",
							width: 110
						},
						{
							field: "facilityName",
							title: "Facility",
							width: 100
						},
						{
							field: "make",
							title: "Make",
							width: 100
						},
						{
							field: "model",
							title: "Model",
							width: 100
						},
						{
							field: "supplyFanRating",
							title: "Supply Fan Rating",
							width: 100
						},
						{
							field: "extractFanRating",
							title: "Extract Fan Rating",
							width: 100
						},
						{
							field: "coolingValueType",
							title: "Cooling Value Type",
							width: 100
						},
						{
							field: "noOfCompressors",
							title: "No of Compressors",
							width: 100
						},
						{
							field: "refrigentType",
							title: "Refrigerant Type",
							width: 100
						},
						{
							field: "feedingArea",
							title: "Feeding Area",
							width: 120
						},
						{
							field: "floor",
							title: "Floor",
							width: 100
						},
						{
							field: "timeZone",
							title: "Time Zone",
							width: 100
						},
						{
							template: PointMapLink,
							filterable: false,
							sortable: false,
							width:120
						}
					];
		
	var ObjGridConfig = {
		"scrollable" : true,
		"filterable" : { mode : "row" },
		"sortable" : true,
		//"height" : 450,
		"pageable" : { pageSize: 10,numeric: true,pageSizes: true,refresh: true },
		"selectable" : true
	};
	
	$(".k-grid-content").mCustomScrollbar('destroy');
	FnDrawGridView('#gapp-su-list',ArrResponseData,ArrColumns,ObjGridConfig);
	
	$("#gapp-su-list").data("kendoGrid").tbody.on("click", ".grid-su-view", function(e) {
		var tr = $(this).closest("tr");
		var data = $("#gapp-su-list").data('kendoGrid').dataItem(tr);
		data = data.identifier;
		//alert(data);
		$( "#equip_id").val(data);
		$("#gapp-su-view").submit();
	});
	
	$("#gapp-su-list").data("kendoGrid").tbody.on("click", ".grid-su-mappoints", function(e) {
		var tr = $(this).closest("tr");
		var data = $("#gapp-su-list").data('kendoGrid').dataItem(tr);
		FnSubmitEquipmentMapPoints(data);
	});
}

function FnSubmitEquipmentMapPoints(ObjEquipment){
	
	var ObjEquipmentEntity = {};
	ObjEquipmentEntity['equipment'] = {};
	ObjEquipmentEntity['equipment']['identifier'] = {"key": "identifier","value": ObjEquipment.identifier};
	ObjEquipmentEntity['equipment']['domain'] = {"domainName": ObjEquipment.domainName};
	ObjEquipmentEntity['equipment']['entityTemplate'] = {"entityTemplateName": ObjEquipment.entityTemplateName};
	//ObjEquipmentEntity['equipment']['globalEntity'] = {"globalEntityType": ObjEquipment.globalEntityType};
	ObjEquipmentEntity['equipmentId'] = ObjEquipment.equipmentId;
	ObjEquipmentEntity['facilityName'] = ObjEquipment.facilityName;
	$( "#equip_entity").val(JSON.stringify(ObjEquipmentEntity));
	$("#gapp-su-pointmapping").submit();
}

function FnCreateSU(){
	$('#gapp-su-create').submit();
}

