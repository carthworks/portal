function formatDate(d) {
    var date = new Date(d);
    var year = date.getFullYear();
    var month = ('0' + (date.getMonth() + 1)).slice(-2);
    var day = ('0' + date.getDate()).slice(-2);
    var hour = ('0' + date.getHours()).slice(-2);
    var minute = ('0' + date.getMinutes()).slice(-2);
    return year + '-' + month + '-' + day + ' ' + hour + ':' + minute;
}

function FnOrganizeUserParameters(ObjParam){
	var ObjInputs = {};
	for (var key in ObjParam) {
		if(ObjParam[key]!=''){
			ObjInputs[key] = ObjParam[key];
		}
	}
	
	return ObjInputs;
}
