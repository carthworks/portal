var log = new Log();

var relativePrefix = function (path) {
    var parts = path.split('/');
    var prefix = '';
    var i;
    var count = parts.length - 3;
    for (i = 0; i < count; i++) {
        prefix += '../';
    }
    return prefix;
};

var tenantedPrefix = function (prefix, domain) {
    if (!domain) {
        return prefix;
    }
    var configs = require('/configs/designer.json');
    return prefix + configs.tenantPrefix.replace(/^\//, '') + '/' + domain + '/';
};

var sandbox = function (context, fn) {
    var carbon = require('carbon');
    var options = {};

    if (context.urlDomain) {
        options.domain = context.urlDomain;
    } else {
        options.domain = String(carbon.server.superTenant.domain);
    }

    if (options.domain === context.userDomain) {
        options.username = context.username;
    }

    options.tenantId = carbon.server.tenantId({
        domain: options.domain
    });
    carbon.server.sandbox(options, fn);
};

var allowed = function (roles, allowed) {
    var carbon = require('carbon');
    var server = new carbon.server.Server();
    var tenantId = carbon.server.tenantId();
    var userManager = new carbon.user.UserManager(server, tenantId);
    var adminRole = userManager.getAdminRoleName();
    var hasRole = function (role, roles) {
        var i;
        var length = roles.length;
        for (i = 0; i < length; i++) {
            if (roles[i] == role) {
                return true;
            }
        }
        return false;
    };
    if (hasRole(adminRole, roles)) {
        return true;
    }
    var i;
    var length = allowed.length;
    for (i = 0; i < length; i++) {
        if (hasRole(allowed[i], roles)) {
            return true;
        }
    }
    return false;
};

var context = function (user, domain) {
    var ctx = {
        urlDomain: domain
    };
    if (user) {
        ctx.username = user.username;
        ctx.userDomain = user.domain;
    }
    return ctx;
};

var tenantExists = function (domain) {
    var carbon = require('carbon');
    var tenantId = carbon.server.tenantId({
        domain: domain
    });
    return tenantId !== -1;
};

var currentContext = function () {
    var PrivilegedCarbonContext = Packages.org.wso2.carbon.context.PrivilegedCarbonContext;
    var context = PrivilegedCarbonContext.getThreadLocalCarbonContext();
    var username = context.getUsername();
    return {
        username: username,
        domain: context.getTenantDomain(),
        tenantId: context.getTenantId()
    };
};

var findJag = function (path) {
    var file = new File(path);
    if (file.isExists()) {
        return path;
    }
    path = path.replace(/\/[^\/]*$/ig, '');
    if (!path) {
        return null;
    }
    return findJag(path + '.jag');
};

var handlers = function (name) {
    var handlersDir = '/extensions/handlers/';
    var handlerScript = function (handler, script) {
        return handlersDir + handler + '/' + script;
    };
    var file = new File(handlersDir + name);
    if (!file.isExists() && !file.isDirectory()) {
        return true;
    }
    var args = Array.prototype.slice.call(arguments);
    args.shift();
    var handlers = file.listFiles();
    handlers.forEach(function (file) {
        var script = require(handlerScript(name, file.getName()));
        var handle = script.handle;
        if (!handle) {
            return;
        }
        handle.apply(script, args);
    });
};

var store = function () {
    var config = require('/configs/designer.json');
    var storeType = config.store.type;
    var storePath = '/extensions/stores/' + storeType + '/index.js';
    return require(storePath);
};

var dashboardStyles = function (theme) {
    var config = require('/configs/designer.json');
    if (!theme) {
        theme = config.theme;
    }

    var path = 'extensions/themes/' + theme + '/css/dashboard.css';
    var file = new File('/' + path);
    return file.isExists() ? path : null;
};

var dashboardLayouts = function () {
    var path = 'extensions/themes/';
    var folder = new File('/' + path);
    var list = folder.listFiles();
    list.forEach(function(file){

    });
};

var dashboardScripts = function () {
    var config = require('/configs/designer.json');
    var theme = config.theme;
    var path = 'extensions/themes/' + theme + '/js/dashboard-extensions.js';
    var file = new File('/' + path);
    return file.isExists() ? path : null;
};

var portalStyles = function () {
    var config = require('/configs/designer.json');
    var theme = config.theme;
    var path = 'extensions/themes/' + theme + '/css/portal.css';
    var file = new File('/' + path);
    return file.isExists() ? path : null;
};

var portalScripts = function () {
    var config = require('/configs/designer.json');
    var theme = config.theme;
    var path = 'extensions/themes/' + theme + '/js/portal.js';
    var file = new File('/' + path);
    return file.isExists() ? path : null;
};

var resolvePath = function (path) {
    var config = require('/configs/designer.json');
    var theme = config.theme;
    var extendedPath = '/extensions/themes/' + theme + '/' + path;
    var file = new File(extendedPath);
    return file.isExists() ? extendedPath : '/theme/' + path;
};

var resolveUrl = function (path) {
    var config = require('/configs/designer.json');
    var theme = config.theme;
    var extendedPath = 'extensions/themes/' + theme + '/' + path;
    var file = new File('/' + extendedPath);
    return file.isExists() ? extendedPath : 'theme/' + path;
};

var getCarbonServerAddress = function (trans) {
    var carbon = require('carbon');
    var url;
    var carbonServerAddress = carbon.server.address(trans);
    var carbonUrlArrayed = carbonServerAddress.split(":");
    var authUrlProtocol = carbonUrlArrayed[0];
    var authUrlPort = carbonUrlArrayed[2];
    var serverConfigService = carbon.server.osgiService('org.wso2.carbon.base.api.ServerConfigurationService');
    hostName = serverConfigService.getFirstProperty("HostName");
    if (hostName == null || hostName === '' || hostName === 'null' || hostName.length <= 0) {
        url = carbonServerAddress;
    } else {
        url = authUrlProtocol + "://" + hostName + ":" + authUrlPort;
    }

    return url;
};


var getLocaleResourcePath = function () {
    return '/extensions/locales/';
};

var base64encode = function(str){

	// Create Base64 Object
	var Base64={_keyStr:"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=",encode:function(e){var t="";var n,r,i,s,o,u,a;var f=0;e=Base64._utf8_encode(e);while(f<e.length){n=e.charCodeAt(f++);r=e.charCodeAt(f++);i=e.charCodeAt(f++);s=n>>2;o=(n&3)<<4|r>>4;u=(r&15)<<2|i>>6;a=i&63;if(isNaN(r)){u=a=64}else if(isNaN(i)){a=64}t=t+this._keyStr.charAt(s)+this._keyStr.charAt(o)+this._keyStr.charAt(u)+this._keyStr.charAt(a)}return t},decode:function(e){var t="";var n,r,i;var s,o,u,a;var f=0;e=e.replace(/[^A-Za-z0-9\+\/\=]/g,"");while(f<e.length){s=this._keyStr.indexOf(e.charAt(f++));o=this._keyStr.indexOf(e.charAt(f++));u=this._keyStr.indexOf(e.charAt(f++));a=this._keyStr.indexOf(e.charAt(f++));n=s<<2|o>>4;r=(o&15)<<4|u>>2;i=(u&3)<<6|a;t=t+String.fromCharCode(n);if(u!=64){t=t+String.fromCharCode(r)}if(a!=64){t=t+String.fromCharCode(i)}}t=Base64._utf8_decode(t);return t},_utf8_encode:function(e){e=e.replace(/\r\n/g,"\n");var t="";for(var n=0;n<e.length;n++){var r=e.charCodeAt(n);if(r<128){t+=String.fromCharCode(r)}else if(r>127&&r<2048){t+=String.fromCharCode(r>>6|192);t+=String.fromCharCode(r&63|128)}else{t+=String.fromCharCode(r>>12|224);t+=String.fromCharCode(r>>6&63|128);t+=String.fromCharCode(r&63|128)}}return t},_utf8_decode:function(e){var t="";var n=0;var r=c1=c2=0;while(n<e.length){r=e.charCodeAt(n);if(r<128){t+=String.fromCharCode(r);n++}else if(r>191&&r<224){c2=e.charCodeAt(n+1);t+=String.fromCharCode((r&31)<<6|c2&63);n+=2}else{c2=e.charCodeAt(n+1);c3=e.charCodeAt(n+2);t+=String.fromCharCode((r&15)<<12|(c2&63)<<6|c3&63);n+=3}}return t}}
	
	var string = str;
	var encodedString = Base64.encode(string);
	return encodedString;
};

var base64decode = function(str){

	// Create Base64 Object
	var Base64={_keyStr:"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=",encode:function(e){var t="";var n,r,i,s,o,u,a;var f=0;e=Base64._utf8_encode(e);while(f<e.length){n=e.charCodeAt(f++);r=e.charCodeAt(f++);i=e.charCodeAt(f++);s=n>>2;o=(n&3)<<4|r>>4;u=(r&15)<<2|i>>6;a=i&63;if(isNaN(r)){u=a=64}else if(isNaN(i)){a=64}t=t+this._keyStr.charAt(s)+this._keyStr.charAt(o)+this._keyStr.charAt(u)+this._keyStr.charAt(a)}return t},decode:function(e){var t="";var n,r,i;var s,o,u,a;var f=0;e=e.replace(/[^A-Za-z0-9\+\/\=]/g,"");while(f<e.length){s=this._keyStr.indexOf(e.charAt(f++));o=this._keyStr.indexOf(e.charAt(f++));u=this._keyStr.indexOf(e.charAt(f++));a=this._keyStr.indexOf(e.charAt(f++));n=s<<2|o>>4;r=(o&15)<<4|u>>2;i=(u&3)<<6|a;t=t+String.fromCharCode(n);if(u!=64){t=t+String.fromCharCode(r)}if(a!=64){t=t+String.fromCharCode(i)}}t=Base64._utf8_decode(t);return t},_utf8_encode:function(e){e=e.replace(/\r\n/g,"\n");var t="";for(var n=0;n<e.length;n++){var r=e.charCodeAt(n);if(r<128){t+=String.fromCharCode(r)}else if(r>127&&r<2048){t+=String.fromCharCode(r>>6|192);t+=String.fromCharCode(r&63|128)}else{t+=String.fromCharCode(r>>12|224);t+=String.fromCharCode(r>>6&63|128);t+=String.fromCharCode(r&63|128)}}return t},_utf8_decode:function(e){var t="";var n=0;var r=c1=c2=0;while(n<e.length){r=e.charCodeAt(n);if(r<128){t+=String.fromCharCode(r);n++}else if(r>191&&r<224){c2=e.charCodeAt(n+1);t+=String.fromCharCode((r&31)<<6|c2&63);n+=2}else{c2=e.charCodeAt(n+1);c3=e.charCodeAt(n+2);t+=String.fromCharCode((r&15)<<12|(c2&63)<<6|c3&63);n+=3}}return t}}

	var string = str;
	var decodedString = Base64.decode(string);
	
	return decodedString;
};
