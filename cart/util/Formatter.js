jQuery.sap.declare("util.Formatter");

util.Formatter = {
		
	price :  function (value) {
		jQuery.sap.require("sap.ui.core.format.NumberFormat");
		var numberFormat = sap.ui.core.format.NumberFormat.getFloatInstance({
			maxFractionDigits: 2,
			minFractionDigits: 2,
			groupingEnabled: true,
			groupingSeparator: ".",
			decimalSeparator: ","
		});
		return numberFormat.format(value);
	},
	
	totalPrice : function (value) {
		var bundle = sap.ui.getCore().getModel("i18n").getResourceBundle();
		return bundle.getText("CART_TOTAL_PRICE") + ": " + util.Formatter.price(value);
	},
	
	_statusTextMap : {
		"No ink" : sap.ui.getCore().getModel("i18n").getResourceBundle().getText("STATUS_D")
	},
	
	statusText : function (status) {
		status = status || "Kein Status";
		return (util.Formatter._statusTextMap[status]) ? util.Formatter._statusTextMap[status] : status;
	},
	
	_statusStateMap : {
		"No ink" : "Error"
	},
	
	statusState : function (status) {
		status = status || "Warning";
		return (util.Formatter._statusStateMap[status]) ? util.Formatter._statusStateMap[status] : status;
	},

	_statusIcon : {
		"No ink" : "sap-icon://status-error"
	},

	statusIcon : function(status){
		status = status || "sap-icon://question-mark";
		return (util.Formatter._statusIcon[status]) ? util.Formatter._statusIcon[status] : status;
	}

};