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
		debugger;
	}

};