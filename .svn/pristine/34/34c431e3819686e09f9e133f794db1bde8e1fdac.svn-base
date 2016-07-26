"use strict";

var GblIsSubcribe = false;

$(document).ready(function(){
	FnInitiateMap();	
});

$(window).load(function() {
	FnGetAssetList();
});

$(window).bind("beforeunload", function() { 
	if(GblIsSubcribe == true){
		GblIsSubcribe = false;
		FnUnSubscribe();
	}
});

var map = null;
var streets;
var hybrid;
function FnInitiateMap(){
	streets = L.tileLayer('https://{s}.google.com/vt/lyrs=m&x={x}&y={y}&z={z}', {
        id: 'Street',
		minZoom: 1,
        maxZoom: 18,
        subdomains:['mt0','mt1','mt2','mt3'],
        attribution: ""});

    hybrid = L.tileLayer('https://{s}.google.com/vt/lyrs=s,h&x={x}&y={y}&z={z}', {
        id: 'Satellite',
		minZoom: 1,
        maxZoom: 18,
        subdomains:['mt0','mt1','mt2','mt3'],
        attribution: ""});
    
    map = L.map('assetsmonitoringmap', {
        zoom: 5,
        center: [40.9743827,-97.6000859], // Dubai LatLng 25.20, 55.27
        layers: [hybrid,streets],
        zoomControl: true,
        attributionControl: true
    });
	map.zoomControl.setPosition('bottomright');

    var baseMaps = {
        "Satellite": hybrid,
        "Streets": streets
    };

    L.control.layers(baseMaps).addTo(map);
}

function FnGetAssetList(){
	var VarUrl = GblAppContextPath+'/ajax' + VarListAssetsUrl;
	VarUrl = VarUrl + "?domain_name="+ VarCurrentTenantInfo.tenantDomain + "&mode=Asset";
	$("#GBL_loading").show();
	FnMakeAsyncAjaxRequest(VarUrl, 'GET', '', 'application/json; charset=utf-8', 'json', FnResAssetList);
	
}

var GblAssetsList = {};
var GblAssetsInfo = {};
var GblImageList = {};
function FnResAssetList(response){	
	var ArrResponse = response;
	$("#GBL_loading").hide();
	if($.isArray(ArrResponse)){
		
		var VarResLength = ArrResponse.length;
		var ArrData = [];
		ArrData.push({'id':VarCurrentTenantInfo.tenantId,'text':(VarCurrentTenantInfo.tenantName).toUpperCase()});
		var ArrAssetLocations = [];
		var ArrDestinations = [];
		if(VarResLength > 0){
			ArrData[0]['items'] = [];
			$.each(ArrResponse,function(){
				var VarDSName = (this.datasourceName != undefined) ? this.datasourceName : '';
				ArrData[0]['items'].push({'id':this.assetIdentifier.value,'text':(this.assetName).toUpperCase(),'datasourceName':VarDSName,'assetName':this.assetName,'template':this.templateName,'templateType':this.assetTemplate});
				if(this.latitude != undefined && this.longitude != undefined){
					ArrAssetLocations.push({'latitude':parseFloat(this.latitude),'longitude':parseFloat(this.longitude),'datasourceName':VarDSName,'assetName':this.assetName,'template':this.templateName,'templateType':this.assetTemplate});
				}
				
				if(GblAssetsList[this.assetTemplate] == undefined){
					GblAssetsList[this.assetTemplate] = [];
					GblAssetsList[this.assetTemplate].push(this.assetName);
				} else {
					GblAssetsList[this.assetTemplate].push(this.assetName);
				}
								
				if(VarDSName != ''){
					if($.inArray(VarDSName,ArrDestinations) == -1){
						ArrDestinations.push(VarDSName);
					}
					GblAssetsInfo[VarDSName] = {"name":this.assetName,"id":this.assetIdentifier.value,'template':this.templateName,'templateType':this.assetTemplate};
				}				
				
			});
			
			GblImageList = FnGetImageList();
			
		}
		
		$("#treeview").kendoTreeView({
			select: function(e){
				var tree = $("#treeview").getKendoTreeView();
				var dataItem = tree.dataItem(e.node);		
				
				if(dataItem.template != undefined){
					var ObjAssetParam = {};
					ObjAssetParam['datasourceName'] = dataItem.datasourceName;
					ObjAssetParam['template'] = dataItem.template;
					ObjAssetParam['assetName'] = dataItem.assetName;
					FnHighlightMarker(ObjAssetParam);
				}
				
			},
			dataSource: ArrData,
		});
		
		$('#treeview #'+VarCurrentTenantInfo.tenantId).attr('disabled',true);
		var treeview = $("#treeview").data("kendoTreeView");
		treeview.expand(treeview.findByText((VarCurrentTenantInfo.tenantName).toUpperCase()));
		
		FnApplyAssetMarkers(ArrAssetLocations);
		FnAddSearchAssetTypes();
		
		if(ArrDestinations.length > 0){
			FnGetSubscriptionInfo(ArrDestinations);
		}
		
	} else {
		if(ArrResponse.errorCode != undefined){
			FnShowNotificationMessage(ArrResponse);
		}
	}
		
}

function FnGetImageList(){
	var ObjImages = {};
	$.ajax({
		type: 'GET',
		cache: true,
		async: false,
		contentType: 'application/json; charset=utf-8',
		url: GblAppContextPath+'/getimage/all/'+VarCurrentTenantInfo.tenantId,
		dataType: 'json',
		success:function(response){
			var ObjResponse = response;
			ObjImages = ObjResponse;		
		},
		error:function(xhr, status, error){
			console.log(xhr);
		}
	});
	
	return ObjImages;
}

function FnGetSubscriptionInfo(ArrDataSources){
	var VarUrl = GblAppContextPath+'/ajax' + VarLiveSubscribeUrl;
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
	console.log(Websocketurl);
	console.log(destination);
	console.log('subscribe');
	GblIsSubcribe = true;
	webORB.defaultMessagingURL = Websocketurl;
	myConsumer = new Consumer(destination, new Async(FnHandleMessage,
				FnHandleFault));
	myConsumer.subscribe();
	
}

function FnHandleMessage(message){
	console.log('live data----------------');
	console.log(JSON.stringify(message));
	
	if(message.body != undefined){
		var VarContent = message.body[0];
		var ObjData = $.parseJSON(VarContent);
		if(ObjData.messageType!='MESSAGE'){ return; }
		if(!$.isEmptyObject(ObjData)){
			
			var VarDataSourceName = ObjData.datasourceName;
			var ArrParameters = ObjData.parameters;
			var VarTimestamp = ObjData.receivedTime;
			var element = {};
			for(var i=0; i<ArrParameters.length; i++){
				if(ArrParameters[i].name == 'Latitude'){
					element['latitude'] = ArrParameters[i].value;
				} else if(ArrParameters[i].name == 'Longitude'){
					element['longitude'] = ArrParameters[i].value;
				}
			}
			
			if(!$.isEmptyObject(element)){
				var ArrAssetLocations = [];
				element['datasourceName'] = VarDataSourceName;
				element['assetName'] = GblAssetsInfo[VarDataSourceName]['name'];
				element['template'] = GblAssetsInfo[VarDataSourceName]['template'];
				element['templateType'] = GblAssetsInfo[VarDataSourceName]['templateType'];
				element['time'] = VarTimestamp;
				ArrAssetLocations.push(element);
				FnApplyAssetMarkers(ArrAssetLocations);
			}
						
		}
	}
}

function FnHandleFault(fault) {
	console.log('fault');
}

function FnUnSubscribe(){
	GblIsSubcribe = false;
	myConsumer.unsubscribe();
	console.log("unsubscribed");
}


function FnHighlightMarker(ObjAssetParam){	
	var marker = Arrmarkers[ObjAssetParam['assetName']];	
	if(marker != undefined){	
		marker.openPopup();
		marker.bounce({duration: 1000, height: 100});
		var VarZoom = parseInt(map.getZoom());
		map.setView(marker.getLatLng(), VarZoom);
		
	} else {
	
		if(ObjAssetParam.datasourceName != undefined && ObjAssetParam.datasourceName != ''){
			var VarParam = [];
			VarParam.push(ObjAssetParam.datasourceName);
			
			$.ajax({
					type:'POST',
					cache: true,
					async: false,
					contentType: 'application/json; charset=utf-8',
					url: GblAppContextPath+"/ajax" + VarSearchDeviceUrl,
					data: JSON.stringify(VarParam),
					dataType: 'json',
					success: function(result) {
						var ArrRes = result;
						if($.isArray(ArrRes) && ArrRes.length > 0){
							var ArrAssetLocations = [];
							$.each(ArrRes,function(){
								var element = {};
								$.each(this.dataprovider,function(key,obj){
									if(obj['key'] == 'latitude' || obj['key'] == 'longitude'){
										element[obj['key']] = parseFloat(obj['value']);
									}
								});
								
								if(!$.isEmptyObject(element)){
									element['datasourceName'] = ObjAssetParam.datasourceName;
									element['assetName'] = GblAssetsInfo[ObjAssetParam.datasourceName]['name'];
									element['template'] = GblAssetsInfo[ObjAssetParam.datasourceName]['template'];
									element['templateType'] = GblAssetsInfo[ObjAssetParam.datasourceName]['templateType'];
									ArrAssetLocations.push(element);
								}
							});
							
							if(ArrAssetLocations.length > 0){
								FnApplyAssetMarkers(ArrAssetLocations);
							}
							
						}
					},
					error : function(xhr, status, error) {
						console.log('Error');
					}
				});
			
		} else {		
			var ObjError = {"errorCode" : "500", "errorMessage" : "No location mapped to the asset."};
			FnShowNotificationMessage(ObjError);
		}
	}
}

var Arrmarkers = {};
var GblAssetsMarkers = {};
function FnApplyAssetMarkers(ArrRes){
	if(ArrRes.length > 0){	
		if(!$.isEmptyObject(Arrmarkers) && GblIsSubcribe==true){
			FnRemoveMarkers(ArrRes);
		}
								
		$.each(ArrRes,function(){
			//var VarIcon = FnGetMarkerImageIcon(this.latitude, this.longitude);
			var VarIcon = FnGetMarkerHtmlIcon(this.templateType);
			var marker = L.marker([this.latitude, this.longitude], {icon: VarIcon}).bindPopup(FnConstructMapContent(this)).addTo(map);
			Arrmarkers[this.assetName] = marker;	
			
			var VarGrpMarkerName = FnGetGrpMarkerName(this.assetName);
			if(GblAssetsMarkers[VarGrpMarkerName] == undefined){
				GblAssetsMarkers[VarGrpMarkerName] = [];
				GblAssetsMarkers[VarGrpMarkerName].push(marker);
			} else {
				GblAssetsMarkers[VarGrpMarkerName].push(marker);
			}
						
		});
		
		FnCreateLayerGroup();
		FnConstructCountDetails();
	}
	
}

function FnGetMarkerHtmlIcon(VarAssetTemplate){

	var VarAssetTypeImageSrc = '';
	if($.inArray(VarAssetTemplate+".png",GblImageList['assetType']) != -1){
		var VarAssetTypeImage = GblAppContextPath + VarAppImagePath + "/" + VarCurrentTenantInfo.tenantDomain + VarAppAssetTypeImagePath + VarAppMarkerImagePath + "/" + VarAssetTemplate+".png";
		VarAssetTypeImageSrc = '<img src='+VarAssetTypeImage+' style="height:23px" />';
	} else {
		var VarAssetTypeImage = GblAppContextPath + VarAppImagePath + VarAppDefaultImagePath + VarAppAssetTypeImagePath + VarAppMarkerImagePath + "/" + "noimage.png";
		VarAssetTypeImageSrc = '<img src='+VarAssetTypeImage+' style="height:23px" />';
	}

	var icon = L.divIcon({
		className: '',
		iconSize: [45, 45],
		iconAnchor:   [22, 45],
		popupAnchor:  [0, -37],
		html:'<div class="pin '+VarAssetTemplate+'">'+VarAssetTypeImageSrc+'</div>'
   });
   
   return icon;
   
}

function FnGetMarkerImageIcon(Latitude, Longitude){

	var LeafIcon = L.Icon.extend({
		options: {
			iconSize:     [46, 70],
			iconAnchor:   [23, 70], // Latitude, Longitude
			shadowAnchor: [4, 62],
			popupAnchor:  [0, -62]
		}
	});
	
	var VarIcon = new LeafIcon({iconUrl: GblAppContextPath+'/plugins/leaflet/marker/common.png'});

	return VarIcon;
}

var GblArrAssetLayers = {};
function FnCreateLayerGroup(){
	$.each(GblAssetsMarkers,function(name,Arr){
		var VarLayerName = L.layerGroup(Arr);
		GblArrAssetLayers[name] = VarLayerName;
	});
	
}

function FnConstructCountDetails(){
	var VarMarkerCount = (Object.keys(Arrmarkers)).length;
	$('#asset-toggle').text(VarMarkerCount);
	var VarCountDetailsTxt = '';
	$('#assettype_details_count').html('');
	$.each(GblAssetsMarkers,function(templatename,ArrMarkers){
		var VarAssetTypeImageSrc = '';
		if($.inArray(templatename+".png",GblImageList['assetType']) != -1){
			var VarAssetTypeImage = GblAppContextPath + VarAppImagePath + "/" + VarCurrentTenantInfo.tenantDomain + VarAppAssetTypeImagePath + VarAppMarkerImagePath + "/" + templatename+".png";
			VarAssetTypeImageSrc = '<img src='+VarAssetTypeImage+' style="height:21px" />';
		} else {
			var VarAssetTypeImage = GblAppContextPath + VarAppImagePath + VarAppDefaultImagePath + VarAppAssetTypeImagePath + VarAppMarkerImagePath + "/" + "noimage.png";
			VarAssetTypeImageSrc = '<img src='+VarAssetTypeImage+' style="height:23px" />';
		}
		
		var VarAssetCount = ArrMarkers.length;
	
		VarCountDetailsTxt += '<a href="#"><div class="pincount">'+VarAssetTypeImageSrc+'</div><section style="float:right;text-align: left;margin: 6px 0px 10px 10px;"><div style="font-size: 15px;">'+templatename+'</div><div style="color: #37DCBF;font-size: 15px;">'+VarAssetCount+'</div></section></a>';
	});
	
	$('#assettype_details_count').html(VarCountDetailsTxt);
}

function FnAddSearchAssetTypes(){
	var ArrAssetTypes = Object.keys(GblAssetsList);
	var multiselect = $("#assetTypeSearch").data("kendoMultiSelect");
	if(multiselect != undefined){
		multiselect.destroy();
	}
	
	$("#assetTypeSearch").kendoMultiSelect({
										  dataSource: {
											data: ArrAssetTypes
										  }
	});
	
	$("#assetTypeSearch").data("kendoMultiSelect").bind("change", FnSearchAssetTypeMarkers);

}

function FnSearchAssetTypeMarkers(){
	var multiselect = $("#assetTypeSearch").data("kendoMultiSelect");
	var ArrSelValue = multiselect.value();
	$('.pin').removeClass('highlight');
	$.each(ArrSelValue,function(key,val){
		$('.pin.'+val).addClass('highlight');
	});
	
}

function FnGetGrpMarkerName(VarAssetName){
	var VarGrpMarkerName = '';
	$.each(GblAssetsList,function(templatename,ArrAssets){
		if($.inArray(VarAssetName,ArrAssets) != -1){
			VarGrpMarkerName = templatename;
		}
	});
	
	return VarGrpMarkerName;
}

function FnConstructMapContent(ObjResponse){
	var VarAssetIdentifier = GblAssetsInfo[ObjResponse.datasourceName]['id'];
	
	if(GblAssetsInfo[ObjResponse.datasourceName]['template'] == 'Asset'){
		var Action = GblAppContextPath+'/equipments/asset/dashboard';
	} else {
		var Action = GblAppContextPath+'/equipments/genset/dashboard';
	}
	
	var VarAssetImageSrc = '';
	if($.inArray(ObjResponse.assetName+".png",GblImageList['asset']) != -1){
		var VarAssetImage = GblAppContextPath + VarAppImagePath + "/" + VarCurrentTenantInfo.tenantDomain + VarAppAssetImagePath + "/" + ObjResponse.assetName+".png";
		VarAssetImageSrc = '<img src='+VarAssetImage+' width="89" height="100" />';
	} else {
		VarAssetImageSrc = '';
	}
	
	var VarTxt = "";
	VarTxt += "<div class='monitoring-popup'>";
	VarTxt += "<figure>"+VarAssetImageSrc+"</figure>";
	VarTxt += "<section>";
	VarTxt += "<strong class='popup-header' title="+ObjResponse.assetName+">"+ObjResponse.assetName+"</strong>";
	VarTxt += "<aside class='brand-success'>Active</aside>";
	VarTxt += "<aside class='brand-default'><strong>Latitude: </strong> "+ObjResponse.latitude+"</aside>";
	VarTxt += "<aside class='brand-default' style='margin-bottom:10px;'><strong>Longitude: </strong> "+ObjResponse.longitude+"</aside>";
	if(ObjResponse.time != undefined && ObjResponse.time != ''){
		VarTxt += "<aside class='brand-default' style='margin-bottom:10px;'><strong>Timestamp: </strong> "+ObjResponse.time+"</aside>";
	}
	VarTxt += "<button class='btn green' onclick='FnAssetDetailsPage(\""+VarAssetIdentifier+"\",\""+Action+"\")'> Asset details</button>";
	VarTxt += "</section>";
	VarTxt += "</div>";		
	return VarTxt;
}


function FnRemoveMarkers(ArrRes){
	for(var i=0; i<ArrRes.length; i++){
		var marker = Arrmarkers[ArrRes[i]['assetName']];
		if(marker != undefined){
			map.removeLayer(marker);
			var VarGrpMarkerName = FnGetGrpMarkerName(ArrRes[i]['assetName']);
			var ArrTmp = GblAssetsMarkers[VarGrpMarkerName];
			ArrTmp.splice($.inArray(marker,ArrTmp),1);
			GblAssetsMarkers[VarGrpMarkerName] = ArrTmp;
		}
	} 
}

function FnAssetDetailsPage(VarIdentifier,VarAction){
	$('#dashboard_equip_id').val(VarIdentifier);
	$('#gapp-genset-dashboard').attr('action',VarAction);
	$('#gapp-genset-dashboard').submit();
}