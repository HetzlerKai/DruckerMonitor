jQuery.sap.declare("util.Formatter");

util.Formatter = {
		
	// Formatiert anhand des Statuswertes (Backend) den Status-Icon und -Text
	
	// Vergleicht zuerwartende Werte mit tatsächlichen Backenddaten - Statustext
	_statusTextMap : {
		"No ink" : sap.ui.getCore().getModel("i18n").getResourceBundle().getText("STATUS_D")
	},
	
	statusText : function (status) {
		status = status || sap.ui.getCore().getModel("i18n").getResourceBundle().getText("NO_STATE");
		return (util.Formatter._statusTextMap[status]) ? util.Formatter._statusTextMap[status] : status;
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