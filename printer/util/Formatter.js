jQuery.sap.declare("util.Formatter");

var oModel;

util.Formatter = {
		
	// Formatiert anhand des Statuswertes (Backend) den Status-Icon und -Text
	
	// Vergleicht zuerwartende Werte mit tatsächlichen Backenddaten - Statustext
	statusText : function (oError) {		
		var sStatus,
		oI18N = this.getModel("i18n").getResourceBundle();
		
		if (!oError){
			return "";
		}
		
		if (oError.isCritical && !oError.allCartridgesEmpty && !oError.noInkData){
			sStatus = oI18N.getText("CRIT_STATE");
		} else if (oError.allCartridgesEmpty || oError.noInkData) {
			sStatus = oError.inkErrorText;
		} else {
			sStatus = "";
		}
		
		return sStatus;
	},
	
	// Vergleicht zuerwartende Werte mit tatsächlichen Backenddaten - Status
	statusState : function (oError) {
		var sStatus;
		
		if (!oError){
			return "None";
		}

		if (oError.isCritical){
			sStatus = "Error";
		} else {
			sStatus = "None";
		}
		
		return sStatus;
	},

	// Vergleicht zuerwartende Werte mit tatsächlichen Backenddaten - StatusIcon
	statusIcon : function(oError){
		var sStatus;
		
		if (!oError){
			return "";
		}
		
		if (oError.isCritical){			
			sStatus = "sap-icon://message-error";
		} else {
			sStatus = "";
		}
		
		return sStatus;
	},

	formatSwAndCoToFulltext: function(sType){

		var oI18N = this.getModel("i18n").getResourceBundle();

		switch(sType){
		case "SW":
			return oI18N.getText("SW_PRINTER");
		case "CO":
			return oI18N.getText("CO_PRINTER");
		}
	},

	handlePrinterDataFields : function(sText){
		if(sText){
			return true;
		}
		return false;
	}

};