jQuery.sap.declare("util.Formatter");

var oModel;

util.Formatter = {
		
	// Formatiert anhand des Statuswertes (Backend) den Status-Icon und -Text
	
	// Vergleicht zuerwartende Werte mit tatsächlichen Backenddaten - Statustext
//	_statusTextMap : function(value) {
//		var object = {
//			"No ink" : oModel.getResourceBundle().getText("STATUS_D")};
//		return object[value];
//	},
	
	statusText : function (status, noStatus) {
		return status;
	},
	
	// Vergleicht zuerwartende Werte mit tatsächlichen Backenddaten - Statusfarbe
//	_statusStateMap : {
//		"No ink" : "Error"
//	},
	
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
		
		return sStatus; //(util.Formatter._statusStateMap[sStatus]) ? util.Formatter._statusStateMap[sStatus] : sStatus;
	},

	// Vergleicht zuerwartende Werte mit tatsächlichen Backenddaten - Statusicon
//	_statusIcon : {
//		"No ink" : "sap-icon://status-error"
//	},

	statusIcon : function(sId){
		var 
		oCurrData, sStatus, 
		aData = this.getModel("DruckerData").getData();

		aData.filter(function(oData){
			if (oData.id === sId){
				oCurrData =  oData;
			}
		});
		
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