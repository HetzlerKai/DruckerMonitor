jQuery.sap.require("util.Formatter");

// Controller for the List of all Printers
sap.ui.controller("view.Home", {

	onInit: function () {
		this._router = sap.ui.core.UIComponent.getRouterFor(this);
		// trigger first search to set visibilities right
		this._search();
	},

	// Actionlistener for Serach Field change
	handleSearch: function (oEvent) {
		this._search();
	},


	// Searchs for the entered String in all Printer Names
	_search: function () {
		var oView = this.getView(),
			oProductList = oView.byId("productList"),
			oSearchField = oView.byId("searchField")
		// switch visibility of lists
		bShowSearch = oSearchField.getValue().length !== 0;

		if (bShowSearch) {
			this._changeNoDataTextToIndicateLoading(oProductList);
		}

		// filter product list
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

	// Actionlistener for Printer Item select (does same as Item press)
	handleProductListSelect: function (oEvent) {
		var oItem = oEvent.getParameter("listItem");
		this._showProduct(oItem);
	},

	// Actionlistener for Printer Item Press (does same as Item select)
	handleProductListItemPress: function (oEvent) {
		var oItem = oEvent.getSource();
		this._showProduct(oItem);
	},

	// navigates to Detail Page for the Printer
	_showProduct: function (oItem) {
		var oBindContext = oItem.getBindingContext("DruckerData")
		oModel = oBindContext.getModel(),
			sId = oModel.getProperty(oBindContext.getPath()).id;
		sId = (parseInt(sId) - 1).toString();
		this._router.navTo("printerDetails", {id: sId}, !sap.ui.Device.system.phone);
	}

});