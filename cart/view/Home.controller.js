jQuery.sap.require("util.Formatter");

sap.ui.controller("view.Home", {

	onInit : function () {
		this._router = sap.ui.core.UIComponent.getRouterFor(this);
		// trigger first search to set visibilities right
		this._search();
	},

	handleSearch : function (oEvent) {
		this._search();
	},

	handleRefresh : function (oEvent) {
		var that = this;
		if (model.Config.isMock) {
			// just wait if we do not have oData services
			setTimeout(function () {
				that.getView().byId("pullToRefresh").hide();
			}, 2000);
		} else {
			// trigger search again and hide pullToRefresh when data ready
			var oProductList = this.getView().byId("productList"),
			oBinding = oProductList.getBinding("items"),
			fnHandler = function() {
				that.getView().byId("pullToRefresh").hide();
				oBinding.detachDataReceived(fnHandler);
			};
			oBinding.attachDataReceived(fnHandler);
			that._search();
		}
	},

	_search : function () {
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
		oList.attachEventOnce("updateFinished", function() {oList.setNoDataText(sOldNoDataText);});
	},

	
	handleProductListSelect: function (oEvent) {
		var oItem = oEvent.getParameter("listItem");
		this._showProduct(oItem);
	},
	handleProductListItemPress: function (oEvent) {
		var oItem = oEvent.getSource();
		this._showProduct(oItem);
	},
	
	_showProduct: function (oItem) {
		var oBindContext = oItem.getBindingContext("DruckerData")
		 oModel = oBindContext.getModel(),
		 sId = oModel.getProperty(oBindContext.getPath()).id;
		sId = (parseInt(sId) - 1).toString();
		this._router.navTo("printerDetails", {id: sId}, !sap.ui.Device.system.phone);
	}

});