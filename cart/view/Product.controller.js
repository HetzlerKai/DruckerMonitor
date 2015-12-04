jQuery.sap.require("util.Formatter");
jQuery.sap.require("sap.m.MessageToast");
jQuery.sap.require("sap.m.MessageBox");
jQuery.sap.require("sap.m.Dialog");
jQuery.sap.require("sap.ui.model.json.JSONModel");

// Controller fuer die Drucker Details Seite
sap.ui.controller("view.Product", {

	onInit: function () {
		this._router = sap.ui.core.UIComponent.getRouterFor(this);
		this._router.getRoute("product").attachPatternMatched(this._routePatternMatched, this);
		this._router.getRoute("printerDetails").attachPatternMatched(this._routePatternMatched, this);

		// Wenn ein neuer Drucker aus der Liste auf dem UI ausgewaehlt wurde, wird das Model automatisch aktualisiert
		this._router.getRoute("printerDetails").attachPatternMatched(this._setPaperConsumptionModel, this);
		this._router.getRoute("printerDetails").attachPatternMatched(this._refreshInkChart, this);
	},

	onAfterRendering: function () {
		// Das ist notwendig um einen Aufruf der Seite direkt ueber die URL zuermoeglichen
		this.sDataPath = this.getView().getBindingContext("DruckerData").getPath();
		this.getHistoryModel();
	},

	// Laedt die Seite neu als Logout
	_fnOnLogOutPress: function () {
		location.reload();
	},

	sDataPath: "",

	_routePatternMatched: function (oEvent) {
		var sId = oEvent.getParameter("arguments").id,
			oView = this.getView(),
			sPath = "/" + sId,
			that = this,
			oModel = oView.getModel("DruckerData"),
			oData = oModel.getProperty(sPath);

		this.sDataPath = sPath;
		this.getHistoryModel();

		oView.bindElement("DruckerData>" + sPath);

		if (!oData) {
			oView.getElementBinding().attachEventOnce("dataReceived", function () {
				that._checkIfPrinterAvailable(sPath, sId);
			});
		}
	},

	// Ueberprueft ob ein Drucker mit dieser id existiert
	_checkIfPrinterAvailable: function (sPath, sId) {
		var oModel = this.getView().getModel("DruckerData"),
			oData = oModel.getProperty(sPath);

		// show not found page
		if (!oData) {
			this._router.getTargets().display("notFound", sId);
		}
	},

	// Liefert die IP des aktuel ausgewählten Druckers
	getDruckerId: function () {
		var oModel, oCurrentDrucker,
			sId = null;

		oModel = sap.ui.getCore().getModel("DruckerData");
		oCurrentDrucker = oModel.getProperty(this.sDataPath);

		sId = oCurrentDrucker.id;

		return sId;
	},
	
	getDruckerIp: function () {
		var
		oModel, oCurrentDrucker,
		sIp = null;

		oModel = sap.ui.getCore().getModel("DruckerData");
		oCurrentDrucker = oModel.getProperty(this.sDataPath);

		sIp = oCurrentDrucker.ip;

		return sIp;
	},

	// Download Druckerdaten als PDF
	handleDownloadButtonPress: function (oEvent) {
		var that = this;

		sap.m.MessageToast.show("Download was started");

		jQuery.ajax({
			type: 'POST',
			dataType: "json",
			url: 'php/services/ajax.php',
			data: {
				post: 'DruckerAlsPdf',
				ip: that.getDruckerIp()
			},
			success: function (response) {
				window.open('/php/services/pdf/Monitoring.pdf');
			},
			error: function (error) {
				//jQuery.sap.log.error("Download as PDF failed");
				window.open('./php/services/pdf/Monitoring.pdf');
			}
		});

	},

	_$content: null,

	_removeChartIfLoaded: function () {
		if (this._$content) {
			this._$content.remove();
		}
	},

	_getIdOfTabToPlaceChartInto: function (sId) {
		return "#" + sId + "-content";
	},

	_mSelectedTab: {
		"History": false,
		"ChartStatistic": false,
		"ChartPaper": false,
		"GeneralTab": false
	},

	_updateKeyOfSelectedTab: function(sTabName){
		this._mSelectedTab["ChartStatistic"] = false;
		this._mSelectedTab["History"] = false;
		this._mSelectedTab["ChartPaper"] = false;
		this._mSelectedTab["GeneralTab"] = false;

		this._mSelectedTab[sTabName] = true;
	},

	// Wird aus der XML View getriggert
	// zeigt die Detailseiten (Tabs) fuer den Drucker an
	showPrinterData: function (oEvent) {
		var oSelectedItem = oEvent.getParameter("selectedItem"),
			sId = this._getIdOfTabToPlaceChartInto(oEvent.getParameter("id")),
			sPath = oEvent.getSource().getBindingContext("DruckerData").getPath(),
			oData = oEvent.getSource().getModel("DruckerData").getProperty(sPath);

		this._removeChartIfLoaded();

		// Auswahl der Charts das geladen soll
		if (oSelectedItem.getKey() === "ChartStatistic") {
			this._updateKeyOfSelectedTab("ChartStatistic");

			this.showStatisticChart(sId, oData);

		} else if (oSelectedItem.getKey() === "ChartPaper") {
			this._updateKeyOfSelectedTab("ChartPaper");

			this._setPaperConsumptionModel();

			// Datenaufbereitung für das Papierverbrauch Diagramm
			this._analyzePaperConsumptionData();

			// Diagramm wird initialisiert und auf das UI platziert
			this._showPaperConsumptionChart(sId, oData);

		} else if(oSelectedItem.getKey() === "GeneralTab"){
			this._updateKeyOfSelectedTab("GeneralTab");

		} else if(oSelectedItem.getKey() === "History"){
			this._updateKeyOfSelectedTab("History");

		}

	},

	_refreshInkChart: function(){
		if (this._mSelectedTab["ChartStatistic"]) {
			this._removeChartIfLoaded();
			var sTabId = $("div[id^='__bar'][id$='content']").control()[0].getId();
			this.showStatisticChart(this._getIdOfTabToPlaceChartInto(sTabId), this.getView().getModel("DruckerData").getProperty(this.sDataPath));
		}
	},


	_setPaperConsumptionModel: function () {

		if (this._mSelectedTab["ChartPaper"]) {

			var oJSONModel = new sap.ui.model.json.JSONModel(),
				that = this,
				oView = this.getView();

			// Daten für das Papierdiagramm werden angefordert
			jQuery.ajax({
				type: 'POST',
				dataType: "json",
				url: 'php/services/ajax.php',
				data: {
					post: 'getStatistik',
					id: this.getDruckerId()
				},
				success: function (aPaperConsumption) {

					// Daten fuer das Papierdiagramm werden an die View gehaengt
					oView.setModel(oJSONModel, "PapierVerbrauch");
					oView.getModel("PapierVerbrauch").setData(aPaperConsumption);

					// Datenaufbereitung für das Papierverbrauchdiagramm
					that._analyzePaperConsumptionData();
					that._removeChartIfLoaded();
					var sTabId = $("div[id^='__bar'][id$='content']").control()[0].getId();
					that._showPaperConsumptionChart(that._getIdOfTabToPlaceChartInto(sTabId), that.getView().getModel("DruckerData").getProperty(that.sDataPath));

				},
				error: function (oError) {
					jQuery.sap.log.error("Fehler beim Zugriff auf die Statistikdaten: " + oError);
				}
			});
		}

	},

	_aValuesOfMonthForPaperConsumptionChart: new Array(),

	_getRequiredModelAsArray: function(sName){
		return (this.getView().getModel(sName)) ? this.getView().getModel(sName).getData() : [];
	},

	_analyzePaperConsumptionData: function () {
		var aData = this._getRequiredModelAsArray("PapierVerbrauch");

		this._aValuesOfMonthForPaperConsumptionChart.length = 0;

		if (aData.length > 1) {
			for (var count = 0; aData.length > count; count++) {
				if (this._isReceivedYearSameAsCurrent(aData, count)) {
					this._analyzeMonthValues(aData, count);
				}
			}
		} else if (aData.length === 1) {
			this._analyzeMonthValues(aData, aData.length - 1);
		}

		// Initialisiere 0 in leere Arrays
		this._fillEmptyArrayWithZero();
	},

	_fillEmptyArrayWithZero: function () {
		for (var count = 0; 12 > count; count++) {
			if (!this._aValuesOfMonthForPaperConsumptionChart[count]) {
				this._aValuesOfMonthForPaperConsumptionChart[count] = 0;
			}
		}
	},

	_analyzeMonthValues: function (aData, count) {
		if (this._aValuesOfMonthForPaperConsumptionChart[parseInt(new Date(aData[count].datum).getMonth())]) {
			this._aValuesOfMonthForPaperConsumptionChart[parseInt(new Date(aData[count].datum).getMonth())] += parseInt(aData[count].gedruckte_seiten);
		}
		else {
			this._aValuesOfMonthForPaperConsumptionChart[parseInt(new Date(aData[count].datum).getMonth())] = parseInt(aData[count].gedruckte_seiten);
		}
	},

	_isReceivedYearSameAsCurrent: function (aData, iArrayPosition) {
		return new Date().getFullYear() === new Date(aData[iArrayPosition].datum).getFullYear();
	},

	// Zeigt auf dem UI die Tintenverbrauchsdiagramm an
	showStatisticChart: function (sId, oData) {
		this._$content = $('<div id="highcharts"></div>').highcharts({
			chart: {
				type: 'column',
				width: ($(sId).width() - 20).toString()
			},
			title: {
				text: 'Tintenstand'
			},
			xAxis: {
				type: 'category'
			},
			yAxis: {
				title: {
					text: 'ml'
				}
			},
			series: [{
				name: 'Black',
				data: [{
					name: 'Tintenart',
					y: parseInt(oData.toner_schwarz)
				}],
				color: 'black'
			},
				{
					name: 'Cyan',
					data: [{
						name: 'Tintenart',
						y: parseInt(oData.toner_cyan)
					}],
					color: "cyan"
				},
				{
					name: 'Magenta',
					data: [{
						name: 'Tintenart',
						y: parseInt(oData.toner_magenta)
					}],
					color: "magenta"
				},
				{
					name: 'Gelb',
					data: [{
						name: 'Tintenart',
						y: parseInt(oData.toner_gelb)
					}],
					color: "yellow"
				}]
		});
		$(sId).append(this._$content);
	},

	// Zeigt auf dem UI die Papierverbrauchdiagramm an
	_showPaperConsumptionChart: function (sId, oData) {
		this._$content = $('<div id="test"></div>').highcharts({
			chart: {
				type: 'line',
				width: ($(sId).width() - 20).toString()
			},
			title: {
				text: 'Paper Consumption'
			},
			xAxis: {
				categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
			},
			yAxis: {
				title: {
					text: 'Seiten'
				}
			},
			series: [{
				name: oData.name || "Kein Druckername vorhanden",
				data: this._aValuesOfMonthForPaperConsumptionChart
			}]
		});
		$(sId).append(this._$content);
	},

	_addEntryDialog: null,
	_orderBusyDialog: null,
	_dialogView: null,

	// Erzeugt Dialog zum erstellen eines neuen History eintrages
	handlePressAddTableEntry: function () {
		var that = this,
			fnClearInputFields;

		fnClearInputFields = function () {
			sap.ui.getCore().byId("AddEntryDialog--Ink_input").setValue("");
			sap.ui.getCore().byId("AddEntryDialog--inputMail").setValue("");
		};

		if (!this._addEntryDialog) {
			var bundle = this.getView().getModel("i18n").getResourceBundle();

			// create order dialog
			this._dialogView = sap.ui.view({
				id: "AddEntryDialog",
				viewName: "view.AddEntryDialog",
				type: "XML"
			});
			this._addEntryDialog = new sap.m.Dialog({
				title: "Eintrag erstellen",
				//stretch: Device.system.phone,
				content: [
					this._dialogView
				],
				leftButton: new sap.m.Button({
					text: bundle.getText('ADD_ENTRY_DIALOG_SAVE_BUTTON_TITLE'),
					type: "Accept",
					press: function (oEvent) {
						var sPatrone,
							sText;

						sPatrone = sap.ui.getCore().byId("AddEntryDialog--Ink_input").getValue();
						sText = sap.ui.getCore().byId("AddEntryDialog--inputMail").getValue();

						fnClearInputFields();

						that.handleNewEntry(sPatrone, sText);
						that._addEntryDialog.close();
					}
				}),
				rightButton: new sap.m.Button({
					text: bundle.getText('ADD_ENTRY_DIALOG_CANCEL_BUTTON_TITLE'),
					press: function () {
						fnClearInputFields();
						that._addEntryDialog.close();
					}
				})
			});

			this.getView().addDependent(this._addEntryDialog);
			this.setCurrentDateToDatePicker();
		}

		this._addEntryDialog.open();
	},

	setCurrentDateToDatePicker: function () {
		sap.ui.getCore().byId(this._dialogView.getId() + '--DP1').setDateValue(new Date());
	},

	handleNewEntry: function (sPatrone, sText) {

		var that = this;

		jQuery.ajax({
			type: 'POST',
			dataType: "json",
			url: 'php/services/ajax.php',
			data: {
				post: 'schreibeHistorie',
				patrone: sPatrone,
				kommentar: sText,
				id: this.getDruckerId()
			},
			success: function () {
				that.refreshHistoryData();
			},
			error: function () {
				that.refreshHistoryData();
			}
		});

	},

	getHistoryModel: function () {
		var aData, oHistoryModel;

		aData = this.getHistoryData();

		oHistoryModel = new sap.ui.model.json.JSONModel(aData);
		this.getView().setModel(oHistoryModel, "History");
	},

	getHistoryData: function () {
		var aData = [];

		jQuery.ajax({
			type: 'POST',
			dataType: "json",
			url: 'php/services/ajax.php',
			data: {
				post: 'getHistorie',
				id: this.getDruckerId()
			},
			async: false,
			success: function (response) {
				aData = response;
			},
			error: function (e) {
				jQuery.sap.log.error("Couldn't retrieve History Data");
			}
		});

		return aData;
	},

	refreshHistoryData: function () {
		var aData = this.getHistoryData();

		this.getView().getModel("History").setData(aData);
	}

});
