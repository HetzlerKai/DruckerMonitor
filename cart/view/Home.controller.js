jQuery.sap.require("util.Formatter");

//Controller für die Liste aller Drucker
sap.ui.controller("view.Home", {

	onInit: function () {
		this._router = sap.ui.core.UIComponent.getRouterFor(this);
		// trigger first search to set visibilities right
		this._search();
	},

	// Actionlistener für Suchfeld
	handleSearch: function (oEvent) {
		this._search();
	},


	// sucht für den eingegeben String in allen Druckernamen
	_search: function () {
		var oView = this.getView(),
			oProductList = oView.byId("productList"),
			oSearchField = oView.byId("searchField"),
		// setzt Sichtbarkeit
		bShowSearch = oSearchField.getValue().length !== 0;

		if (bShowSearch) {
			this._changeNoDataTextToIndicateLoading(oProductList);
		}

		// filtert produkt liste
		var oBinding = oProductList.getBinding("items");
		if (oBinding) {
			if (bShowSearch) {
				var oFilter = new sap.ui.model.Filter("name", sap.ui.model.FilterOperator.Contains, oSearchField.getValue());
				oBinding.filter([oFilter]);
			} else {
				oBinding.filter([]);
			}
		}

	},

	_changeNoDataTextToIndicateLoading: function (oList) {
		var sOldNoDataText = oList.getNoDataText();
		oList.setNoDataText("Loading...");
		oList.attachEventOnce("updateFinished", function () {
			oList.setNoDataText(sOldNoDataText);
		});
	},

	// Actionlistener für Printer Item select (gleich zu Item press)
	handleProductListSelect: function (oEvent) {
		var oItem = oEvent.getParameter("listItem");
		this._showProduct(oItem);
	},

	// Actionlistener für Printer Item Press (gleich zu Item select)
	handleProductListItemPress: function (oEvent) {
		var oItem = oEvent.getSource();
		this._showProduct(oItem);
	},

	// navigiert zur Drucker Detail seite
	_showProduct: function (oItem) {
		var oBindContext = oItem.getBindingContext("DruckerData")
		oModel = oBindContext.getModel(),
			sId = oModel.getProperty(oBindContext.getPath()).id;
		sId = (parseInt(sId) - 1).toString();
		this._router.navTo("printerDetails", {id: sId}, !sap.ui.Device.system.phone);
	}

});