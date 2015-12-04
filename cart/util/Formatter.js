jQuery.sap.declare("util.Formatter");

var oModel;

util.Formatter = {
		
	// Formatiert anhand des Statuswertes (Backend) den Status-Icon und -Text
	
	// Vergleicht zuerwartende Werte mit tatsächlichen Backenddaten - Statustext
	statusText : function (bIsCrit) {		
		var sStatus,
		oI18N = this.getModel("i18n").getResourceBundle();
		
		if (bIsCrit){
			sStatus = oI18N.getText("CRIT_STATE");
		} else {
			sStatus = "";
		}
		
		return sStatus;
	},
	
	// Vergleicht zuerwartende Werte mit tatsächlichen Backenddaten - Status
	statusState : function (bIsCrit) {
		var sStatus;
		
		if (bIsCrit){
			sStatus = "Error";
		} else {
			sStatus = "None";
		}
		
		return sStatus;
	},

	// Vergleicht zuerwartende Werte mit tatsächlichen Backenddaten - StatusIcon
	statusIcon : function(bIsCrit){
		var sStatus;
		
		if (bIsCrit){			
			sStatus = "sap-icon://message-error";
		} else {
			sStatus = "";
		}
		
		return sStatus;
	}

};