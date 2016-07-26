var current;
var login;
var logout;
var authorized;
var roles;
var searchRoles;
var maxRolesLimit;

(function () {
    var log = new Log();

    current = function () {
        var user = session.get('user');
        if (!user) {
            return null;
        }
        user.domain = String(user.domain);
        return user;
    };

    login = function (username, password) {
        var carbon = require('carbon');
        var server = new carbon.server.Server();
        try {
            if (!server.authenticate(username, password)) {
                return false;
            }
        }catch (e){
            var message = "Invalid Domain Name";
            if (e.message.toLowerCase().indexOf(message.toLowerCase()) >= 0) {
                log.error("Invalid Domain Name: " + e.message);
                return false;
            }
        }

        var user = carbon.server.tenantUser(username);
        var utils = require('/modules/utils.js');
        var um = new carbon.user.UserManager(server, user.tenantId);
        user.roles = um.getRoleListOfUser(user.username);
        try {
            utils.handlers('login', user);
        } catch (e) {
            log.error(e);
            return false;
        }
        session.put('user', user);
        return true;
    };

    logout = function () {
        var utils = require('/modules/utils.js');
        var user = current();
        try {
            utils.handlers('logout', user);
        } catch (e) {
            log.error(e);
            return;
        }
        session.remove('user');
		session.remove('authToken');
		session.remove('PARENT_CLIENT');
		session.remove('CHILD_CLIENT');
		session.invalidate();
    };

    authorized = function (perm, action) {
        return true;
    };

    roles = function () {
        var carbon = require('carbon');
        var server = new carbon.server.Server();
        var user = session.get('user');
        var um = new carbon.user.UserManager(server, user.tenantId);
        return um.allRoles();
    };

    searchRoles = function (filter, maxItems) {
        var carbon = require('carbon');
        var server = new carbon.server.Server();
        var user = session.get('user');
        var um = new carbon.user.UserManager(server, user.tenantId);
        return um.searchRoles(filter, maxItems, true, true, true);
    };

    maxRolesLimit = function (){
        var carbon = require('carbon');
        var server = new carbon.server.Server();
        var user = session.get('user');
        var um = new carbon.user.UserManager(server, user.tenantId);
        var map = um.getMaxLimit('MaxRoleNameListLength');
        return map.get("PRIMARY");
    };
	
	tenantName = function () {
        var user = session.get('user');
        if (!user) {
            return null;
        }
        return String(user.tenantName);
    };
	
	tenantId = function () {
        var user = session.get('user');
        if (!user) {
            return null;
        }
        return String(user.tenantId);
    };
	
	domainName = function () {
        var user = session.get('user');
        if (!user) {
            return null;
        }
        //return String(user.domain);
		return String(user.tenantDomain);
    };
	
	accessToken = function () {
        var user = session.get('user');
        if (!user) {
            return null;
        }
        return String(user.accessToken);
    };
	
	userName = function () {
        var user = session.get('user');
        if (!user) {
            return null;
        }
        return String(user.username);
    };
	
	userRoles = function () {
        var user = session.get('user');
        if (!user) {
            return null;
        }
        return String(user.roles);
    };
	
	expireIn = function () {
		var user = session.get('user');
		if (!user) {
            return null;
        }
		return String(user.expiresin);
	};
	
	timeoutDuration = function(){
		var VarCurrentTime = new Date().getTime();
		return VarCurrentTime;
	};
	
	FnGetCurrentClientInfo = function(VarTenantKey){
		
		var ObjTenantInfo = session.get('PARENT_CLIENT');
		var ObjChildTenantInfo = session.get('CHILD_CLIENT');
		
		if(ObjTenantInfo != null){
		
			if(ObjTenantInfo['tenantId'] == VarTenantKey){
				var VarCurrentTenantInfo = ObjTenantInfo;
			} else if(ObjChildTenantInfo != null && ObjChildTenantInfo['tenantId'] == VarTenantKey){
				var VarCurrentTenantInfo = ObjChildTenantInfo;
			} else {				
				logout();
			}
			
			return VarCurrentTenantInfo;
		
		} else {
			logout();
		}
	};
	
	FnGetPageAccessAuthorization = function(ObjPageAccess,ObjPageConf,pageId,VarPageRef){
		var APPCONF = require('/configs/appconfig.jag');
		var ObjUser = current();
		if(!utils.allowed(ObjUser['roles'],[APPCONF.GAPP_CONF.SUPER_ADMIN_ROLE,APPCONF.GAPP_CONF.CLIENT_ADMIN_ROLE])){
					
			if(VarPageRef[pageId] != undefined && (!utils.allowed(ObjUser['permissions'],[VarPageRef[pageId]]))){
			
				var VarClientKey = (request.getParameter("gapp-tenant-key") != null) ? utils.base64encode(request.getParameter("gapp-tenant-key")) : '';
				response.sendRedirect(APPCONF.GAPP_CONF.CONTEXT_PATH+"/error/403/"+VarClientKey);
				exit();
				
				
			} else {
			
				for (VarPage in ObjPageAccess){
					if(VarPage === pageId){
						ObjPageAccess[VarPage] = "1";
						if(ObjPageConf[pageId] != null){
							for(var i=0; i<(ObjPageConf[pageId]).length; i++){
								ObjPageAccess[ObjPageConf[pageId][i]] = (utils.allowed(ObjUser['permissions'],[VarPageRef[ObjPageConf[pageId][i]]]) ? "1" : "0");
							}
						}
					}
				}
				
			}
			
		} else {
		
			for (VarPage in ObjPageAccess){
				if(VarPage === pageId){
					ObjPageAccess[VarPage] = "1";
					if(ObjPageConf[pageId] != null){
						for(var i=0; i<(ObjPageConf[pageId]).length; i++){
							ObjPageAccess[ObjPageConf[pageId][i]] = "1";
						}
					}
				}
			}

		}
		return ObjPageAccess;
	};
	
	FngetClientImage = function(VarTenantId){
		var APPCONF = require('/configs/appconfig.jag');
		var ObjTenantInfo = FnGetCurrentClientInfo(VarTenantId);
		var ObjClientLogo = new File(APPCONF.GAPP_CONF.DOMAIN_IMG_PATH+"/"+ObjTenantInfo['tenantDomain']+APPCONF.GAPP_CONF.DOMAIN_IMG_LOGO+"/"+ObjTenantInfo['tenantId']+".png");
		var VarImagePath = '';
		if(ObjClientLogo.isExists()){
			VarImagePath = APPCONF.GAPP_CONF.CONTEXT_PATH+APPCONF.GAPP_CONF.DOMAIN_IMG_PATH+"/"+ObjTenantInfo['tenantDomain']+APPCONF.GAPP_CONF.DOMAIN_IMG_LOGO+"/"+ObjTenantInfo['tenantId']+".png";
		}
		
		return VarImagePath;
	};
	
	FnGetLoggedUserImage = function(VarFlag){
		var VarLoggedUserName = userName();
		var ObjTenantInfo = session.get('PARENT_CLIENT');
		var ObjUserImage = new File(APPCONF.GAPP_CONF.DOMAIN_IMG_PATH+"/"+ObjTenantInfo['tenantDomain']+APPCONF.GAPP_CONF.DOMAIN_IMG_USERS+"/"+VarLoggedUserName+".png");
		if(ObjUserImage.isExists()){
			var VarImagePath = APPCONF.GAPP_CONF.CONTEXT_PATH+APPCONF.GAPP_CONF.DOMAIN_IMG_PATH+"/"+ObjTenantInfo['tenantDomain']+APPCONF.GAPP_CONF.DOMAIN_IMG_USERS+"/"+VarLoggedUserName+".png";
		} else {
			if(VarFlag == 0){
				var VarImagePath = "/portal/extensions/themes/avocadoapp/images/header/white/user-icon.svg"
			} else {
				var VarImagePath = APPCONF.GAPP_CONF.CONTEXT_PATH+APPCONF.GAPP_CONF.DOMAIN_IMG_PATH+APPCONF.GAPP_CONF.DOMAIN_IMG_DEFAULT+APPCONF.GAPP_CONF.DOMAIN_IMG_USERS+"/"+"user.png";
			}
			
		}
		
		return VarImagePath;
	};
	
}());