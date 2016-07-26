var VarGensetIdentifier;
var GblPointName;
var VarCurrentSourceId;
	
//console.log(JSON.stringify(ObjPageAccess));
//console.log(VarLUDomainName);
//console.log(VarCurrentTenantInfo);
//console.log(VarDashbardId);

$('#header_notification_bar').hide();

$(document).ready(function () {
	// hide the genset active status
	$('#genset-inactive').hide();
	$('#genset-active').hide();
	
});

/***** left location map. right live grid and right down chart *****/

function FnInitialization() {	
	FnGetEquipmentInfo(VarDashbardId);  // get equipments info and   DataSourceName	
		FnInitiateMap();  // generate the left location map
		FnInitGensetGrid();  //grid for live point 	
	FnGetSourceId(VarDashbardId);
	FnGetLatestPointInfoOfDevice(VarDashbardId); // get latest for initial grid	
	var ArrChartData = [];
		FnInitGensetChartHIstory(ArrChartData);	
	FnMarkerChildren(VarDashbardId);	
	FnGetAssetList();  // generate the left location map :location
	
}

function FnMarkerChildren(GetDashbardId){
	var VarGetDashbardId =GetDashbardId;
	var VarUrl =GblAppContextPath+ '/ajax' + VarGetMarkerChildrenUrl;
	//console.log('---');
	//console.log(VarUrl);	
	var data = {
				  "parentIdentity": {
					"domain": {
					  "domainName": VarCurrentTenantInfo.tenantDomain
					},
					"identifier": {
					  "key": "identifier",
					  "value": VarGetDashbardId
					},
					"entityTemplate": {
					  "entityTemplateName": "Genset"
					}
				  },
				  "searchTemplateName": "Point"
				//  ,"statusName": "ACTIVE"
				};
	//console.log(JSON.stringify(data));
	FnMakeAjaxRequest(VarUrl, 'POST',JSON.stringify(data), 'application/json; charset=utf-8', 'json',FnResMarkerChildren);
	
}

var GblObjDSPoints = {};
function FnResMarkerChildren(response){	
//console.log('----- FnResMarkerChildren');
//console.log(JSON.stringify(response));
var ArrResponse =response;	

var ArrPoints=[];
	if($.isArray(ArrResponse)) {
		var ArrParams = [];
		$(ArrResponse).each(function(key,ObjEquipment){			
						
			if(ObjEquipment.dataprovider != undefined && (ObjEquipment.dataprovider).length>0){
				var element = {};
				$.each(ObjEquipment.dataprovider,function(key1,ObjPointDetails){
					if(ObjPointDetails.key == 'dataSourceName' || ObjPointDetails.key == 'pointId' || ObjPointDetails.key == 'pointName' || ObjPointDetails.key == 'unit' || ObjPointDetails.key == 'displayName' || ObjPointDetails.key == 'dataType'){
						
						if (ObjPointDetails.value == 'unitless') {							
							element['unit'] = "";
						}
						else{
							element['unit'] = ObjPointDetails.value;
												
						}
						
						if(ObjPointDetails.key == 'displayName'){
							element['name'] = ObjPointDetails.value;
						} else {
							element[ObjPointDetails.key] = ObjPointDetails.value;
						}
					}
				});
				ArrPoints.push(element['name']);				
				ArrParams.push(element);						
			}		
		});
		
		if(ArrParams.length > 0){
			var VarDSName = ArrParams[0]['dataSourceName'];
			if(GblObjDSPoints[VarDSName] == undefined){
				GblObjDSPoints[VarDSName] = [];
				GblObjDSPoints[VarDSName] = ArrPoints;
			}
			
			var message = {"body":[{"datasourceName":VarCurrentSourceId,"messageType":"MESSAGE","parameters":ArrParams}]};
			console.log(message);
			FnHandleMessage(message,0);
		}	
	}		
}



function FnGetAssetList(){
	//alert('FnGetAssetList');
	var VarUrl = GblAppContextPath+'/ajax' + VarListAssetsUrl;
	VarUrl = VarUrl + "?domain_name="+VarCurrentTenantInfo.tenantDomain;
	console.log('FnGetAssetList : '+VarUrl);
	FnMakeAjaxRequest(VarUrl, 'GET', '', 'application/json; charset=utf-8', 'json', FnResAssetList);
}

function FnResAssetList(response){
	console.log(response);
	var ArrResponse = response;	
	if (ArrResponse.errorCode =="500"){
		//console.info(ArrResponse.errorMessage);
		var errMsg ='Device Location : '+ArrResponse.errorMessage;
					notificationMsg.show({
					message : errMsg
				}, 	'error');
		
	}
	if($.isArray(ArrResponse)){
		var VarResLength = ArrResponse.length;
		if(VarResLength > 0){
			var ArrAssetLocations = [];
			$.each(ArrResponse,function(){
				if(this.equipIdentifier.value == VarDashbardId){
					ArrAssetLocations.push({'latitude':this.latitude,'longitude':this.longitude});
				}
			});
			
			FnApplyAssetMarkers(ArrAssetLocations);
		}
		
	}
}


function FnGetEquipmentInfo(GetDashbardId){
	//alert(+GetDashbardId);
	
	var VarGetDashbardId =GetDashbardId;
	var VarUrl = GblAppContextPath+'/ajax' + VarGetEquipmentDataUrl;
	//console.log(VarUrl);
	
		var data = {
		"domain" : {
			"domainName" : VarCurrentTenantInfo.tenantDomain
		},
		"globalEntity" : {
			"globalEntityType" : "MARKER"
		},
		"entityTemplate" : {
			"entityTemplateName" : "Genset"
		},
		"identifier" : {
			"key" : "identifier",
			"value" : VarGetDashbardId
		}
	};
	//console.log('------->>');
	//console.log(JSON.stringify(data));
	FnMakeAjaxRequest(VarUrl, 'POST',JSON.stringify(data), 'application/json; charset=utf-8', 'json', FnResGetEquipmentInfo);
}	


function FnResGetEquipmentInfo(response){	
	var ArrResponse = response;
	console.log('---*-');
	//console.log(JSON.stringify(ArrResponse));
	
			//if (ArrResponse != undefined ){
		$('#genset-name-label').text(ArrResponse.assetType);
		$('#genset-name').text(ArrResponse.assetName);	
		$('#genset-description').text(ArrResponse.description);
				
				if(!$.isEmptyObject(ArrResponse)){
								var VarEquipmentInfoText = '';
								
								VarSID = ArrResponse.points[0].dataprovider;
								$.each(VarSID, function(key, val){						
																
									if (val.key == 'dataSourceName'){
										VarCurrentSourceId =val.value;							
									}
								});
				
								$.each(ArrResponse.fieldValues, function(key, val){		
					
									if (val.key ==='assetName'){
									$('#genset-name').text(val.value);}									
						
								if (val.value !=undefined && val.key !='assetName' && val.key !='identifier'){					
										VarEquipmentInfoText += '<li><span class="genset-properties-name" ><span class="dashboardtextleft-length" title="'+val.key+'">'+val.key+' </span></span><span class="genset-properties-value" ><span class="dashboardtext-length" title="'+val.value+'">&nbsp '+val.value+' </span></span></li>';
								}						
															
								});
									
					$('#equipmentInfo').html(VarEquipmentInfoText);
							
				}
}

function FnGetSourceId(GetIdentifier){

	var VarUrl = GblAppContextPath+'/ajax' + VarGetPointsAllDetailsUrl;
	var dataallpoints = {
						  "identity": {
							"globalEntity": {
							  "globalEntityType": "MARKER"
							},
							"domain": {
							  "domainName": VarCurrentTenantInfo.tenantDomain
							},
							"entityTemplate": {
							  "entityTemplateName": "Genset"
							},
							"identifier": {
							  "key": "identifier",
							  "value": GetIdentifier
							}
						  },
						  "sourceId": VarCurrentSourceId
	};

	console.log('VarGetPointsAllDetailsUrl : '+VarUrl);
	//console.log(JSON.stringify(dataallpoints));	
	FnMakeAjaxRequest(VarUrl, 'POST',JSON.stringify(dataallpoints), 'application/json; charset=utf-8', 'json', FnResGetSourceId);
	
}

function FnResGetSourceId(response){	
	var ArrResponse = response;	
	var ArrParams=[];
	//var element={};
		
	if($.isArray(ArrResponse)){	
			$.each(ArrResponse,function(key,objpoints){
				var element = {};	
				$.each(objpoints.dataprovider,function(key1,val1){
					if(val1.key == 'pointId'){
						element['pointId'] = val1.value;
					}
					if(val1.key == 'pointName'){
						element['pointName'] = val1.value;
					}
					if(val1.key == 'unit'){
						element['unit'] = val1.value;
					}
					if(val1.key == 'dataType'){
						element['dataType'] = val1.value;
					}
					if(val1.key == 'displayName'){
						element['name'] = val1.value;
					}
					if(val1.key == 'dataSourceName'){
						element['dataSourceName'] = val1.value;
					}
					
					//element['value'] = '';
					element['time'] = '';
					//element['value'] = '';			
			
					
				});
				ArrParams.push(element);
			
			});
	
			var message = {"body":[{"datasourceName":VarCurrentSourceId,"messageType":"MESSAGE","parameters":ArrParams}]};
			//console.info('-------points');
			//console.log(JSON.stringify(message));		
		

		//calling websocket	
				var ds = new Array();
				ds[0] = VarCurrentSourceId;				
				FnGetSubscriptionInfo(ds);			
				FnHandleMessage(message,0)
	} 

}



var ArrDestinations = [];
function FnGetLatestPointInfoOfDevice(GetIdentifier) {
	var VarUrl = GblAppContextPath+'/ajax' + VarGetLatestDeviceDataUrl;
	
	
	var data = {
		"domain" : {
			"domainName" : VarCurrentTenantInfo.tenantDomain
		},
		"globalEntity" : {
			"globalEntityType" : "MARKER"
		},
		"entityTemplate" : {
			"entityTemplateName" : "Genset"
		},
		"identifier" : {
			"key" : "identifier",
			"value" : GetIdentifier
		}
	};
	//console.log('FnGetLatestPointInfoOfDevice +latest');
	//console.log(JSON.stringify(data));
	FnMakeAjaxRequest(VarUrl, 'POST',JSON.stringify(data), 'application/json; charset=utf-8', 'json', FnResPointsOfSelectedGenset);
}



			
	var VarInitialMapMarkerLong,VarInitialMapMarkerLat; 
	
	function FnResPointsOfSelectedGenset(response) {
		var ArrResponse = response;
		//VarCurrentSourceId =obj.sourceId;
		console.log('-----latest');
		console.log(JSON.stringify(ArrResponse));
		
	
		if($.isArray(ArrResponse)){			
			var ArrParams = [];
			var VarDSName = '';
			
		
			$.each(ArrResponse,function(key,obj){
				//console.log(obj.sourceId);
				VarCurrentSourceId =obj.sourceId;
				
				if(obj['sourceId'] != '' && (obj['data']).length > 0){				
					VarDSName = obj['sourceId'];
					
				//	VarCurrentSourceId =VarDSName;
					$.each(obj['data'],function(){
						var element = {};
						element['unit'] = this.unit;
						element['name'] = this.customTag;
						element['value'] = this.data;
						element['time'] = this.deviceTime;
						ArrParams.push(element);
					});
				}
			});
			//console.clear();
			//console.log('____> '+VarCurrentSourceId);
			//console.log(JSON.stringify(ArrParams));
			
			
			var message = {"body":[{"datasourceName":VarCurrentSourceId,"messageType":"MESSAGE","parameters":ArrParams}]};				
				
				//calling websocket	
				var ds = new Array();
				ds[0] = VarCurrentSourceId;								
				FnGetSubscriptionInfo(ds);	
				
				//console.log(message);
				FnHandleMessage(message,0);
			
	/*		if(ArrParams.length > 0){	
		
				
			}*/
			
		}
		
			
	}
	
	
function FnGetSubscriptionInfo(ArrDataSources){
	var VarUrl = GblAppContextPath+'/ajax' + VarLiveSubscribeUrl;
	//console.log('FnGetSubscriptionInfo* ' +VarUrl);		
	//console.log(ArrDataSources);
	FnMakeAsyncAjaxRequest(VarUrl, 'POST', JSON.stringify(ArrDataSources), 'application/json; charset=utf-8', 'json', FnResSubscriptionInfo);
}


function FnResSubscriptionInfo(response){
	var ObjResponse = response;
	if(!$.isEmptyObject(ObjResponse)){
		if(ObjResponse.webSocketUrl != undefined && ObjResponse.destination != undefined){
			var VarWebsocketUrl = ObjResponse.webSocketUrl;
			var VarDestination = ObjResponse.destination;
			FnSubscribe(VarWebsocketUrl,VarDestination);
		}
	}
}

var myConsumer;
function FnSubscribe(Websocketurl,destination){
	console.info(' subscribe -->  Websocketurl: '+ Websocketurl +' destination: ' +destination );	
	GblIsSubcribe = true;
	webORB.defaultMessagingURL = Websocketurl;
	myConsumer = new Consumer(destination, new Async(FnHandleMessage,
				FnHandleFault));
	myConsumer.subscribe();
	
}


function FnHandleMessage(message,VarFlag) {
	
	console.log('live message ->');
	console.log(JSON.stringify(message));
		
	var grid = $("#genset-gridview").data("kendoGrid");
	
	if (message.body != undefined) {
		
		var	content = message.body[0];
		if(VarFlag == undefined){
			var data = $.parseJSON(content);
		} else {
			var data = content;
		}
		
		var VarDSName = data.datasourceName;		
		var ArrParameters = data.parameters;		

		// live alarmalarm : data bind	 alarm-list		
		if (data.messageType =="ALARM") {	
			var ArrAlarmStatusMessage = data.statusMessage;	
			var ArrAlarmStatus = data.status;
			var ArrAlarmReceivedTime = data.receivedTime;
			var ArrAlarmRTime = toDateFormat(data.time);
					
			var AlarmInfo = "<li><span class='smsg'><span> Message: &nbsp<i class='fa fa-bullhorn'></i> </span>" +ArrAlarmStatusMessage + "</span> <span class='astatus'> <span>Status : </span> " + ArrAlarmStatus + "</span><span class='rtime'> <span>Received time:</span>" + ArrAlarmReceivedTime + "</span><span class='time'><span>Time: </span>" + ArrAlarmRTime + "</span></li> ";
			$('ul#alarm-list li').prepend(AlarmInfo);
			return;
		} 		
			
		// genset active or inactive 
		var VarEngineSpeed;			
			for (var i = 0; i < ArrParameters.length; i++) {
			
				if (ArrParameters[i].name == 'Engine Speed') {
					VarEngineSpeed = ArrParameters[i].value;
					console.log('VarEngineSpeed '+VarEngineSpeed);
					if (VarEngineSpeed>0)					
					{ 
						$('#genset-inactive').hide();
						$('#genset-active').show();
					}
					else
					{
						$('#genset-inactive').show();
						$('#genset-active').hide();
					}
				}
				
					
		// map - collecting the lat and long			
			/*	if (ArrParameters[i].name === 'Latitude') {
					element['lat'] = ArrParameters[i].value;
				} else if (ArrParameters[i].name === 'Longitude') {
					element['lon'] = ArrParameters[i].value;
				}
				*/
			}
	
		// live grid data update   
		for (var i = 0; i < ArrParameters.length; i++) {			
			var VarAlarmName = ArrParameters[i].name;
			var VarId = VarDSName.replace(/ /g, '_') +"_"+ VarAlarmName.replace(/ /g, '_');
			var isGExist = false;
			for (var k = 0; k < grid.dataSource.data().length; k++) {
				var VarChkId = grid.dataSource.data()[k].rowid;
				//alert(VarId);
				//alert(VarChkId);
				if (VarId == VarChkId) {
					isGExist = true;
					var item = grid.dataSource.data()[k];
					item.set('value', ArrParameters[i].value);
					item.set('time', ArrParameters[i].time);
				}
			}
			
			if (!isGExist) {				
				grid.dataSource.add({
								time : '',
								pointId : ArrParameters[i].pointId,
								pointName : ArrParameters[i].pointName,
								value : '',
								unit : ArrParameters[i].unit,
								rowid : VarId,
								datatype : ArrParameters[i].dataType
								
				});
				
			}
			
			grid.dataSource.sync();
			
		}
	
	}	

}
/****** end FnHandleMessage */

var Arrmarkers = [];
function FnApplyAssetMarkers(ArrRes) {

	if(ArrRes.length > 0){
		if (Arrmarkers.length > 0) {
			FnRemoveMarkers();
		}
		
		var LeafIcon = L.Icon.extend({
			options: {
				iconSize:     [46, 70],
				iconAnchor:   [22, 94],
				shadowAnchor: [4, 62],
				popupAnchor:  [0, -76]
			}
		});
		
		var VarIcon = new LeafIcon({iconUrl: GblAppContextPath+'/plugins/leaflet/marker/common.png'});
		
		$.each(ArrRes,function(){
			var marker = L.marker([this.latitude, this.longitude], {icon: VarIcon}).addTo(map);
			console.log(marker);
			Arrmarkers.push(marker);
		});
		var marker = Arrmarkers[0];
		var VarZoom = parseInt(map.getZoom());
		map.setView(marker.getLatLng(), VarZoom);
	
	}
	
}

function FnRemoveMarkers() {
	var VarMarkerLength = Arrmarkers.length;
	for (var i = 0; i < VarMarkerLength; i++) {
		map.removeLayer(Arrmarkers[i]);
	}
}

function FnHandleFault(fault) {
	console.log('fault');
}

function FnUnSubscribe() {
	GblIsSubcribe = false;
	myConsumer.unsubscribe();
	console.log("unsubscribed");
}
/*

function FnGetAssetList(){
var url = GblAppContextPath+'/ajaxcummins';
var data = {'action' : 'tenant-assets-list','tenantId':GblTenantInfo.tenantName };
FnMakeAjaxRequest(url, 'POST', JSON.stringify(data), 'application/json; charset=utf-8', 'json', FnResAssetList);
}



var ObjAssets = {};
function FnResAssetList(response){
var ObjResponse = response;
var VarResLength = ObjResponse.length;
var ArrData = [];
ArrData.push({'id':GblTenantInfo.tenantName,'text':GblTenantInfo.tenantName});
if(VarResLength > 0){
ArrData[0]['items'] = [];

$.each(ObjResponse,function() {
var element = {};
$(this.dataprovider).each(function() {
var key = this.key;
if(key == 'assetName'){
element['id'] = this.value;
element['text'] = this.value;
}
});
element['entity'] = {};
element['entity']['globalEntity'] = this.globalEntity;
element['entity']['domain'] = this.domain;
element['entity']['entityTemplate'] = {"entityTemplateName":this.entityTemplate.entityTemplateName};
element['entity']['identifier'] = this.identifier;
ArrData[0]['items'].push(element);
});

}
console.log('ArrData');
console.log(ArrData);


}

 */
  
   	function FnCheckForUnitless(VarUnit){		
		if (VarUnit =='unitless') {VarUnit=' - '};
		return VarUnit;
	}
  
function FnInitGensetGrid() {
	var deviceData = new kendo.data.DataSource({
			data : [],
			pageSize : 10,
			page : 1,
			serverPaging : false,
			serverFiltering : false,
			serverSorting : false,
			sort : {
				field : "time",
				dir : "desc"
			}
		});
		

	var ArrColumns = [					
				{
					field : "pointId",
					title : "Point Id",
					width: 130
					
				},
				{
					field : "pointName",
					title : "Point name",
					sortable: false,
					filterable:true,
					width: 140					
					//template : "<a  href='javascript:void(0);' class='grid-genset-points'  data-toggle='tooltip' data-placement='bottom'>  #=parameterName#</a>"					
				}, 
				{
					field : "value" ,
					title : "Value",
					filterable:false,
					width: 80
				},
				{
					field : "unit" ,
					title : "Unit",
					filterable:false,
					template :"#: FnCheckForUnitless(unit)#",
					width: 70
				
				},{
					field : "time",
					title : "Time stamp",
					template : "#: toDateFormat(time, 'F')#",
					sortable: false,
					filterable:false,
					width: 170
				}
				
			];

	var gridViewHeight=320;
			
	var ObjGridConfig = {
		"scrollable" : true,
		"filterable" : { mode : "row" },
		"sortable" : true,
		"height" :gridViewHeight,
		"pageable" : { pageSize: 16,numeric: true,pageSizes: true,refresh: false },
		"selectable" : true,
		"resizable": true
		
		
	};
	
	FnDrawGridView('#genset-gridview',deviceData,ArrColumns,ObjGridConfig);
	
	
	var grid = $("#genset-gridview").data("kendoGrid");	
	 grid.setOptions({
				refresh: false
	});
	
	grid.dataSource.read();
	grid.refresh();
	
	grid.bind("change", FnGridChangeEvent);	
		
	
	
	function FnGridChangeEvent(){			
			var row = grid.select();
			var data = grid.dataItem(row);			
		//	console.log(JSON.stringify(data)); 	
			FnInitHistroyData(data);
		}
	
	/*	
		$("#genset-gridview").data("kendoGrid").tbody.on("click", ".grid-genset-points", function(e) {
				var tr = $(this).closest("tr");
				var data = $("#genset-gridview").data('kendoGrid').dataItem(tr);
				//console.log(JSON.stringify(data));						
				//{"sourceId":"sayirdevice2002","parameterName":"Speed","value":"120","time":1456215690000}
				FnInitHistroyData(data);
			});
*/

}

var GblPointName;
	function FnInitHistroyData(ObjSelecetdPoint){	
		
		var sd= ObjSelecetdPoint.rowid;
		var ctags= ObjSelecetdPoint.rowid;
		//console.log(ObjSelecetdPoint.pointName);
		//console.log(JSON.stringify(ObjSelecetdPoint));	
		
		var ctagsOutput = ctags.substring(ctags.indexOf("_") + 1);
		var CurrentSourceId = sd.split('_')[0];
		//alert(ctagsOutput);
		
		/*var gridOption = $("#genset-gridview").data("kendoGrid");	
		 gridOption.setOptions({
				height: 320
		});
			*/
		
		var ObjEquipment = {};		
		var ToDay = new Date();	
		
		var VarStartDate = FnConvertLocalToUTC(FnDateProcess('current'));
		var VarEndDate = FnConvertLocalToUTC(FnDateProcess('next',1));
						
		var ArrCustomTags=[];
		
		var VarParam = {};
		VarParam['sourceId'] = VarCurrentSourceId;		
		VarParam['startDate'] = VarStartDate;
		VarParam['endDate'] = VarEndDate;
		
		
		GblPointName = ObjSelecetdPoint.parameterName;
		GblPointName =ctagsOutput;
		//ArrCustomTags.push(ObjSelecetdPoint.parameterName);
		ArrCustomTags.push(ObjSelecetdPoint.pointName);		
					//ArrCustomTags.push("Angle");
		VarParam['customTags'] = ArrCustomTags;	

		var VarUrl = GblAppContextPath+'/ajax' + VarGetDeviceDataUrl;
			
		FnMakeAjaxRequest(VarUrl,'POST', JSON.stringify(VarParam), 'application/json; charset=utf-8', 'json', FnResInitHistroyData);
	}

	function FnResInitHistroyData(response){
		var ArrResponse = response;
		if (!$.isEmptyObject(ArrResponse)) {
			if(ArrResponse.errorCode == undefined && ArrResponse.customTags != undefined && ArrResponse.sourceId != undefined){
				
				var ArrResponseData = [];
				$.each(ArrResponse.customTags, function (key, val) {
					$.each(val.values,function (key, val){
						var element = {};
						element["deviceTime"] = val.deviceTime;
						element["data"] = val.data;					
						ArrResponseData.push(element);
					});
				});
				
				if(ArrResponseData.length > 0){
					FnInitGensetChartHIstory(ArrResponseData);
				}
				
			} else {				
				notificationMsg.show({
					message : ArrResponse['errorMessage']
				}, 'error');
				var ArrResponseData = [];
				FnInitGensetChartHIstory(ArrResponseData);
			}
		}
	}
	
	function FnInitGensetChartHIstory(response) {
		var ArrResponse = response;	
		var TempTitle = '';		
		 if (GblPointName != undefined) {	 
			TempTitle = GblPointName + " - "; 
		 }
		 
		$("#genset-chart").kendoChart({
			title : {
				text: TempTitle +"Today",
				align: "center",
				background: "transparent",
				color: "#FFFFFF",
				margin: {
					top: -12
				}
			},
			chartArea: {
				background: "transparent"
			},
			dataSource: {
				data: ArrResponse
			},
			legend : {
				visible: false
				
			},
			seriesDefaults : {			
				style : "smooth",
				type : "line",
				labels: {
							visible: false,
							background: "transparent"
						}
			},
			valueAxis: {
						majorGridLines: {
							visible: true
						},
						visible: true
					},
			 series: [{
						field: "data",
						color: "#FF3E01"
					}],
			seriesColors:["#FF5733"],
			categoryAxis: {
						field: "deviceTime",
						majorGridLines: {
							visible: false
						},
						line: {
							visible: true
						},
						labels: {
						  visible: false
						},
						title: { text: 'Time' }
					}

		});

	}
	
	//Export chart to PDF
	$("#btnExport").attr("disabled", false);	//Export to CSV
	
	$("#btnExport").click(function() {
		console.log('pdf '+GblPointName);
		//GblPointName ="print-chart";
		var d = new Date();var month = d.getMonth()+1;
		var day = d.getDate();
		var output = d.getFullYear() + '/' +
			((''+month).length<2 ? '0' : '') + month + '/' +
			((''+day).length<2 ? '0' : '') + day;
			
		var PDFFileName= "equp-print-chart-"+output+".pdf";
            var chart = $("#genset-chart").getKendoChart();
            chart.exportPDF({ paperSize: "auto", margin: { left: "1cm", top: "1cm", right: "1cm", bottom: "1cm" } }).done(function(data) {
                kendo.saveAs({
                    dataURI: data,
                    fileName: PDFFileName
                   
                });
            });
        });




var map = null;
var streets;
var hybrid;

function FnInitiateMap() {

	streets = L.tileLayer('https://{s}.google.com/vt/lyrs=m&x={x}&y={y}&z={z}', {
			id : 'Street',
			maxZoom : 20,
			subdomains : ['mt0', 'mt1', 'mt2', 'mt3'],
			attribution : ""
		});

	hybrid = L.tileLayer('https://{s}.google.com/vt/lyrs=s,h&x={x}&y={y}&z={z}', {
			id : 'Satellite',
			maxZoom : 20,
			subdomains : ['mt0', 'mt1', 'mt2', 'mt3'],
			attribution : ""
		});

	map = L.map('gensetmapview', {
			zoom : 8,
			center : [25.138486, 55.230246],
			layers : [hybrid, streets],
			zoomControl : true,
			attributionControl : true
			
			
		});

	var baseMaps = {
		"Satellite" : hybrid,
		"Streets" : streets

	};

	L.control.layers(baseMaps).addTo(map);

	/*
	var greenIcon = L.icon({
	iconUrl: GblAppContextPath+'/plugins/leaflet/images/genset-icon.png'
	});

	var marker = L.marker([25.138486, 55.230246],{icon: greenIcon}).addTo(map);

	var popup = L.popup();
	map.on('click', onMapClick);

	function onMapClick(e) {
	popup
	.setLatLng(e.latlng)
	.setContent("You clicked the map at " + e.latlng.toString())
	.openOn(map);
	}
	 */
}




/*
$(window).resize(function(){
    resizeGrid();
});

*/





