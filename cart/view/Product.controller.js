jQuery.sap.require("util.Formatter");
jQuery.sap.require("sap.m.MessageToast");
jQuery.sap.require("sap.m.MessageBox");
jQuery.sap.require("sap.m.Dialog");

sap.ui.controller("view.Product", {

	onInit : function () {
		this._router = sap.ui.core.UIComponent.getRouterFor(this);
		this._router.getRoute("product").attachPatternMatched(this._routePatternMatched, this);
		this._router.getRoute("printerDetails").attachPatternMatched(this._routePatternMatched, this);

		//// register for events
		//var oBus = sap.ui.getCore().getEventBus();
		//oBus.subscribe("shoppingCart", "updateProduct", this.fnUpdateProduct, this);
	},

	fnOnLogOutPress: function(){
		location.reload();
	},

	_routePatternMatched: function(oEvent) {
		var sId = oEvent.getParameter("arguments").id,
			oView = this.getView(),
			sPath = "/"+ sId;

		var that = this;
		var oModel = oView.getModel("DruckerData");
		var oData = oModel.getProperty(sPath);

		oView.bindElement("DruckerData>" + sPath);
		//if there is no data the model has to request new data
		if (!oData) {
			oView.getElementBinding().attachEventOnce("dataReceived", function() {
				that._checkIfProductAvailable(sPath, sId);
			});
		}
	},

	//fnUpdateProduct: function(sChannel, sEvent, oData) {
	//	var sPath = "/Products('" + oData.productId + "')";
	//	this.getView().bindElement(sPath);
	//	this._checkIfProductAvailable(sPath, oData.productId);
	//},

	_checkIfProductAvailable: function(sPath, sId) {
		var oModel = this.getView().getModel("DruckerData");
		var oData = oModel.getProperty(sPath);

		// show not found page
		if (!oData) {
			this._router.getTargets().display("notFound", sId);
		}
	},

	handleDownloadButtonPress : function(oEvent){
		sap.m.MessageToast.show("Download was started");
	},

	handleNavButtonPress : function (oEvent) {
		this.getOwnerComponent().myNavBack();
	},

	_SecondTabContentIsLoaded : false,

	_$content: null,

	showPrinterData : function(oEvent){
		var oSelectedItem = oEvent.getParameter("selectedItem");
		var sId = "#" + oEvent.getParameter("id") + "-content";

		if(this._SecondTabContentIsLoaded){
			this._$content.remove();
			this._SecondTabContentIsLoaded = false;
		}

		if(oSelectedItem.getKey() === "ChartStatistic" && !this._SecondTabContentIsLoaded){
			this._$content = $('<div id="test"></div>').highcharts({
				chart: {
					type: 'column'
				},
				title: {
					text: 'Ink State'
				},
				xAxis: {
					categories: ['Color', 'Black']
				},
				yAxis: {
					title: {
						text: 'Level'
					}
				},
				series: [{
					name: 'Color',
					data: [1 ]
				}, {
					name: 'Black',
					data: [0, 7]
				}]
			});
			this._SecondTabContentIsLoaded = true;
			$(sId).append(this._$content);

		} else if(oSelectedItem.getKey() === "ChartPaper"){
			this._$content = $('<div id="test"></div>').highcharts({
				chart: {
					type: 'line'
				},
				title: {
					text: 'Paper Consumption'
				},
				xAxis: {
					categories: ['Paper']
				},
				yAxis: {
					title: {
						text: 'Paper used'
					}
				},
				series: [{
					name: 'Druker X',
					data: [0, 2, 3, 5, 7, 9, 9, 10, 10, 13]
				}]
			});
			this._SecondTabContentIsLoaded = true;
			$(sId).append(this._$content);
		}

	},
	_addEntryDialog: null,

	_orderBusyDialog: null,

	_dialogView: null,

	handlePressAddTableEntry: function(){
		var that = this;
		if (!this._addEntryDialog) {
			var bundle = sap.ui.getCore().getModel('i18n').getResourceBundle();
			
			// create order dialog
			this._dialogView= sap.ui.view({
				id: "AddEntryDialog",
				viewName: "view.AddEntryDialog",
				type: "XML"
			});
			this._addEntryDialog = new sap.m.Dialog({
				title: "dialog title",
				//stretch: Device.system.phone,
				content: [
					this._dialogView
				],
				leftButton: new sap.m.Button({
					text: bundle.getText('ADD_ENTRY_DIALOG_SAVE_BUTTON_TITLE'),
					type: "Accept",
					press: function () {
                        that.handleNewEntry();
                        that._addEntryDialog.close();
                    }
				}),
				rightButton: new sap.m.Button({
					text:  bundle.getText('ADD_ENTRY_DIALOG_CANCEL_BUTTON_TITLE'),
					press: function () {
						that._addEntryDialog.close();
					}
				})
			});

			this.getView().addDependent(this._addEntryDialog);
			this.setCurrentDateToDatePicker();
		}

		this._addEntryDialog.open();
	},

	setCurrentDateToDatePicker: function(){
		sap.ui.getCore().byId(this._dialogView.getId() + '--DP1').setDateValue(new Date());
	},

	createAddEntryDialog: function(){
		var oDialog;

		oDialog = null; // build sap.m.Dialog here

		return oDialog;
	},

	handleNewEntry: function(){}

});
