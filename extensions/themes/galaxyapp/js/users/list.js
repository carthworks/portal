"use strict";

$(document).ready(function(){
	FnGetUsersList();
});

function FnGetUsersList(){
	var VarUrl = GblAppContextPath+'/ajax' + VarListUsersUrl;
	VarUrl = VarUrl.replace("{domain}",VarCurrentTenantInfo.tenantDomain);
	FnMakeAjaxRequest(VarUrl, 'GET', '', 'application/json; charset=utf-8', 'json', FnResUsersList);
}

function FnResUsersList(response){
	
	var ArrResponse = response;
	var VarResLength = ArrResponse.length;
	var ArrResponseData = [];
	if(VarResLength > 0){
		$(ArrResponse).each(function(index){
			var element = {};
			$(this.dataprovider).each(function() {
				var key = this.key;
				if(key == 'roleName'){
					element[key] = this.value.replace(/[&\/\\\[\]#+()$~%'":*?<>{}]/g, '');
				}else{
					element[key] = this.value;
				}
				//console.log(this.value);
			});
			element["identifier"] = this.identifier.value;
			element["status"] = this.entityStatus.statusName;
			ArrResponseData.push(element);
		});
	}
	
	var ViewLink = (ObjPageAccess['view']=='1') ? "<a class='grid-viewuser'>#=userName#</a>" : "<a href='Javascript:void(0)'>#=userName#</a>";
	
	var ArrColumns = [{field: "userName",title: "User Name",width: 130,template: ViewLink },{field: "firstName",title: "First Name",width: 130},{field: "lastName",title: "Last Name",width: 130},{field: "emailId",title: "Email Id",width: 130},{field: "roleName",title: "Role name",width: 130},{field: "contactNumber",title: "Mobile number",width: 130}];

	var ObjGridConfig = {
		"scrollable" : false,
		"filterable" : { mode : "row" },
		"sortable" : true,
		"height" : 0,
		"pageable" : { pageSize: 10,numeric: true,pageSizes: true,refresh: false },
		"selectable" : true
	};
	
	var objDatasource = {};
	objDatasource['data']=ArrResponseData;
	objDatasource['sort']={field: "userName", dir: "asc"}
	
	$(".k-grid-content").mCustomScrollbar('destroy');
	FnDrawGridView('#gapp-users-list',objDatasource,ArrColumns,ObjGridConfig);
	
	var userlist = $("#gapp-users-list").data("kendoGrid");
	userlist.bind("change", FnGridChangeEvent);
	
	$("#gapp-users-list").data("kendoGrid").tbody.on("click", ".grid-viewuser", function(e) {
		var tr = $(this).closest("tr");
		var data = $("#gapp-users-list").data('kendoGrid').dataItem(tr);
		data = data.identifier;
		//alert(data);
		$( "#user_id").val(data);
		$("#gapp-user-view").submit();
	});
}

function FnGridChangeEvent(){
	var userlist = $("#gapp-users-list").data("kendoGrid");
	
	if(userlist.select().length > 0){
		$('#gapp-user-delete').attr('disabled',false);
	} else {
		$('#gapp-user-delete').attr('disabled',true);
	}
}

function FnCreateUser(){
	$('#gapp-user-create').submit();
}

function FnDeleteUser(){
	
	var kendoWindow = $("<div />").kendoWindow({
				            title: "Confirm",
				            height:100,
				            width: 190,
				            resizable: false,
				            modal: true
				        });
						
	kendoWindow.data("kendoWindow").content($("#delete-confirmation").html()).center().open();
	kendoWindow.find(".delete-confirm,.delete-cancel").click(function() {
			                if ($(this).hasClass("delete-confirm")) {
								$("#GBL_loading").show();
			                	var userlist = $("#gapp-users-list").data("kendoGrid");
								var VarSelectedItem = userlist.dataItem(userlist.select());
								console.log(VarSelectedItem);
								var VarDeleteUserId = VarSelectedItem.userName;
								var VarUrl =GblAppContextPath + '/ajax' + VarDeleteUsersUrl;
								VarUrl = VarUrl.replace("{user_name}",VarDeleteUserId);
								VarUrl = VarUrl.replace("{domain}",VarCurrentTenantInfo.tenantDomain);
								FnMakeAjaxRequest(VarUrl, 'DELETE', '', 'application/json; charset=utf-8', 'json', FnResDeleteUser);
								
			                } else {
								kendoWindow.data("kendoWindow").close();
							}
			            }).end();
						
}

function FnResDeleteUser(response){
	var ObjResponse = response;
	$("#GBL_loading").hide();
	if(!$.isEmptyObject(ObjResponse)){
		if(ObjResponse.errorCode == undefined){
			notificationMsg.show({
				message : 'User deleted successfully'
			}, 'success');
			
			setTimeout(function(){ location.reload(); }, GBLDelayTime);
			
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