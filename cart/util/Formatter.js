jQuery.sap.declare("util.Formatter");

var oModel;

util.Formatter = {
		
	// Formatiert anhand des Statuswertes (Backend) den Status-Icon und -Text
	
	// Vergleicht zuerwartende Werte mit tatsächlichen Backenddaten - Statustext
	_statusTextMap : function(value) {
		var object = {
			"No ink" : oModel.getResourceBundle().getText("STATUS_D")};
		return object[value];
	},
	
	statusText : function (status, noStatus) {
		oModel = this.getModel("i18n");
		status = status || noStatus;
		return util.Formatter._statusTextMap(status) ? util.Formatter._statusTextMap(status) : status;
	},
	
	// Vergleicht zuerwartende Werte mit tatsächlichen Backenddaten - Statusfarbe
	_statusStateMap : {
		"No ink" : "Error"
	},
	
	statusState : function (status) {
		status = status || "Warning";
		return (util.Formatter._statusStateMap[status]) ? util.Formatter._statusStateMap[status] : status;
	},

	// Vergleicht zuerwartende Werte mit tatsächlichen Backenddaten - Statusicon
	_statusIcon : {
		"No ink" : "sap-icon://status-error"
	},

	statusIcon : function(status){
		status = status || "sap-icon://question-mark";
		return (util.Formatter._statusIcon[status]) ? util.Formatter._statusIcon[status] : status;
	}

};