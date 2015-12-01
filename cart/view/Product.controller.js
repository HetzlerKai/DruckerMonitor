jQuery.sap.require("util.Formatter");
jQuery.sap.require("sap.m.MessageToast");
jQuery.sap.require("sap.m.MessageBox");
jQuery.sap.require("sap.m.Dialog");
jQuery.sap.require("sap.ui.model.json.JSONModel");

// Controller für die Drucker Details Seite
sap.ui.controller("view.Product", {

	onInit: function () {
		this._router = sap.ui.core.UIComponent.getRouterFor(this);
		this._router.getRoute("product").attachPatternMatched(this._routePatternMatched, this);
		this._router.getRoute("printerDetails").attachPatternMatched(this._routePatternMatched, this);
		this.getHistoryModel();
	},

	// Lädt die Seite neu als Logout
	fnOnLogOutPress: function () {
		location.reload();
	},

	dataPath: "",

	_routePatternMatched: function (oEvent) {
		var sId = oEvent.getParameter("arguments").id,
			oView = this.getView(),
			sPath = "/" + sId,
			that = this,
			oModel = oView.getModel("DruckerData"),
			oData = oModel.getProperty(sPath);

		this.dataPath = sPath;

		oView.bindElement("DruckerData>" + sPath);
		//if there is no data the model has to request new data
		if (!oData) {
			oView.getElementBinding().attachEventOnce("dataReceived", function () {
				that._checkIfPrinterAvailable(sPath, sId);
			});
		}
	},

	// ueberprueft ob ein Drucker mit dieser id existiert
	_checkIfPrinterAvailable: function (sPath, sId) {
		var oModel = this.getView().getModel("DruckerData"),
			oData = oModel.getProperty(sPath);

		// show not found page
		if (!oData) {
			this._router.getTargets().display("notFound", sId);
		}
	},

	getDruckerIp: function () {
		var
			oView, oCurrentDrucker,
			sIp = null;

		oView = this.getView().getModel("DruckerData");
		oCurrentDrucker = oView.getProperty(this.dataPath);

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
			success: function (werte) {
				window.location.href = werte;
//	            window.open(
//	                'data:application/pdf,' + encodeURIComponent(werte),
//	                'Batch Print',
//	                'width=600,height=600,location=_newtab'
//	            );
			},
			error: function (error) {
				jQuery.sap.log.error("Download as PDF failed");
			}
		});

	},

	_SecondTabContentIsLoaded: false,
	_$content: null,

	// zeigt die Detailseiten (Tabs) f�r den Drucker an
	showPrinterData: function (oEvent) {
		var oSelectedItem = oEvent.getParameter("selectedItem"),
			sId = "#" + oEvent.getParameter("id") + "-content",
			sPath = oEvent.getSource().getBindingContext("DruckerData").getPath(),
			oData = oEvent.getSource().getModel("DruckerData").getProperty(sPath);

		if (this._SecondTabContentIsLoaded) {
			this._$content.remove();
			this._SecondTabContentIsLoaded = false;
		}

		if (oSelectedItem.getKey() === "ChartStatistic" && !this._SecondTabContentIsLoaded) {
			this.showStatisticChart(sId, oData);
		} else if (oSelectedItem.getKey() === "ChartPaper") {
			this.showPaperConsumptionChart(sId, oData);
		}

	},

	// Zeigt auf dem UI die Tintenverrauchs Grafik an
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
					//TODO:Please remove random function, is only for testing
					y: parseInt(oData.toner_schwarz) + Math.floor((Math.random() * 20) + 0)
				}],
				color: 'black'
			},
				{
					name: 'Cyan',
					data: [{
						name: 'Tintenart',
						//TODO:Please remove random function, is only for testing
						y: parseInt(oData.toner_cyan) + Math.floor((Math.random() * 20) + 0)
					}],
					color: "cyan"
				},
				{
					name: 'Magenta',
					data: [{
						name: 'Tintenart',
						//TODO:Please remove random function, is only for testing
						y: parseInt(oData.toner_magenta) + Math.floor((Math.random() * 20) + 0)
					}],
					color: "magenta"
				},
				{
					name: 'Gelb',
					data: [{
						name: 'Tintenart',
						//TODO:Please remove random function, is only for testing
						y: parseInt(oData.toner_gelb) + Math.floor((Math.random() * 20) + 0)
					}],
					color: "yellow"
				}]
		});
		this._SecondTabContentIsLoaded = true;
		$(sId).append(this._$content);
	},

	// Zeigt auf dem UI die Papierverbrauch Grafik an
	showPaperConsumptionChart: function (sId, oData) {
		this._$content = $('<div id="test"></div>').highcharts({
			chart: {
				type: 'line',
				width: ($(sId).width() - 20).toString()
			},
			title: {
				text: 'Paper Consumption'
			},
			xAxis: {
				categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
					'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
			},
			yAxis: {
				title: {
					text: 'Seiten'
				}
			},
			series: [{
				name: oData.name,
				//TODO:Please remove random function, is only for testing
				data: [
					parseInt(oData.gedruckteSeiten) + Math.floor((Math.random() * 100) + 1),
					parseInt(oData.gedruckteSeiten) + Math.floor((Math.random() * 100) + 1),
					parseInt(oData.gedruckteSeiten) + Math.floor((Math.random() * 100) + 1),
					parseInt(oData.gedruckteSeiten) + Math.floor((Math.random() * 100) + 1),
					parseInt(oData.gedruckteSeiten) + Math.floor((Math.random() * 100) + 1),
					parseInt(oData.gedruckteSeiten) + Math.floor((Math.random() * 100) + 1),
					parseInt(oData.gedruckteSeiten) + Math.floor((Math.random() * 100) + 1),
					parseInt(oData.gedruckteSeiten) + Math.floor((Math.random() * 100) + 1),
					parseInt(oData.gedruckteSeiten) + Math.floor((Math.random() * 100) + 1),
					parseInt(oData.gedruckteSeiten) + Math.floor((Math.random() * 100) + 1),
					parseInt(oData.gedruckteSeiten) + Math.floor((Math.random() * 100) + 1),
					parseInt(oData.gedruckteSeiten) + Math.floor((Math.random() * 100) + 1)
				]
			}]
		});
		this._SecondTabContentIsLoaded = true;
		$(sId).append(this._$content);
	},

	_addEntryDialog: null,
	_orderBusyDialog: null,
	_dialogView: null,

	// erzeugt Dialog zum erstellen eines neuen History eintrages 
	handlePressAddTableEntry: function () {
		var
			that = this,
			fnClearInputFields;

		fnClearInputFields = function () {
			sap.ui.getCore().byId("AddEntryDialog--Ink_input").setValue("");
			sap.ui.getCore().byId("AddEntryDialog--inputMail").setValue("");
		};

		if (!this._addEntryDialog) {
			var bundle = sap.ui.getCore().getModel('i18n').getResourceBundle();

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

						var
							sPatrone,
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

//		jQuery.ajax({
//	        type : 'POST',
//	        dataType: "json",
//	        url : 'php/services/ajax.php',
//	        data: {
//	            get: 'schreibeHistorie',
//	            patrone: sPatrone,
//	            beschreibung: sText,
//				ip: this.getDruckerIp()
//	        }
//	    });

		this.refreshHistoryData();
	},

	getHistoryModel: function () {
		var oData, oHistoryModel;

		oData = this.getHistoryData();

		oHistoryModel = new sap.ui.model.json.JSONModel(oData);
		this.getView().setModel(oHistoryModel, "History");
	},

	getHistoryData: function () {
		var oData = [
			{
				Datum: "20.11.15",
				Patrone: "Cyan",
				Beschreibung: "Text"
			}, {
				Datum: "25.11.15",
				Patrone: "Cyan2",
				Beschreibung: "Text2"
			}
		];

//		jQuery.ajax({
//	        type : 'POST',
//	        dataType: "json",
//	        url : 'php/services/ajax.php',
//	        data: {
//	            get: 'getHistorie',
//				ip: this.getDruckerIp()
//	        },
//	        success: function(response){
//	        	oData = response;
//	        }
//	    });


		return oData;
	},

	refreshHistoryData: function () {
		var oData = this.getHistoryData();

		this.getView().getModel("History").setData(oData);
	}

});
