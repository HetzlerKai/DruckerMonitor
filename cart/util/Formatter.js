jQuery.sap.declare("util.Formatter");

var oModel;

util.Formatter = {
		
	// Formatiert anhand des Statuswertes (Backend) den Status-Icon und -Text
	
	// Vergleicht zuerwartende Werte mit tatsächlichen Backenddaten - Statustext
	statusText : function (sId) {
		
		var 
		oCurrData, sStatus, 
		oI18N = this.getModel("i18n").getResourceBundle(),
		aData = this.getModel("DruckerData").getData();

		aData.filter(function(oData){
			if (oData.id === sId){
				oCurrData =  oData;
			}
		});
		
		if (!oCurrData){
			return oI18N.getText("NO_STATE");
		}
		
		if (oCurrData.toner_cyan < 10 ||
			oCurrData.toner_gelb < 10 ||
			oCurrData.toner_magenta < 10 ||
			oCurrData.toner_schwarz < 10){
			
			sStatus = oI18N.getText("CRIT_STATE");
		} else {
			sStatus = "";
		}
		
		return sStatus;
	},
	
	// Vergleicht zuerwartende Werte mit tatsächlichen Backenddaten - Status
	statusState : function (sId) {
		var 
		oCurrData, sStatus, 
		aData = this.getModel("DruckerData").getData();

		aData.filter(function(oData){
			if (oData.id === sId){
				oCurrData =  oData;
			}
		});
		
		if (!oCurrData){
			return "Error";
		}
		
		if (oCurrData.toner_cyan < 10 ||
			oCurrData.toner_gelb < 10 ||
			oCurrData.toner_magenta < 10 ||
			oCurrData.toner_schwarz < 10){
			
			sStatus = "Error";
		} else {
			sStatus = "None";
		}
		
		return sStatus;
	},

	// Vergleicht zuerwartende Werte mit tatsächlichen Backenddaten - StatusIcon
	statusIcon : function(sId){
		var 
		oCurrData, sStatus, 
		aData = this.getModel("DruckerData").getData();

		aData.filter(function(oData){
			if (oData.id === sId){
				oCurrData =  oData;
			}
		});
		
		if (!oCurrData){
			return "sap-icon://question-mark";
		}
		
		if (oCurrData.toner_cyan < 10 ||
			oCurrData.toner_gelb < 10 ||
			oCurrData.toner_magenta < 10 ||
			oCurrData.toner_schwarz < 10){
			
			sStatus = "sap-icon://status-error";
		} else {
			sStatus = "";
		}
		
		return sStatus;
	}

};