jQuery.sap.require("util.Formatter");

//Controller für die Liste aller Drucker
sap.ui.controller("view.Home", {

	onInit: function () {
		this._router = sap.ui.core.UIComponent.getRouterFor(this);
		this._search();
	},

	// Actionlistener für Suchfeld
	handleSearch: function (oEvent) {
		this._search();
	},
	
	isFiltered: false,
	
	// Handle Filter fuer kritischen Status
	handleFilterButtonPress : function(oEvent){
		var oFilter, oBinding, oProductList, oView;
		
		oView = this.getView();
		oProductList = oView.byId("productList");
		oBinding = oProductList.getBinding("items");
		
		if (oBinding) {
			
			if (oEvent.getSource().getColor() === "#cc1919"){
				oEvent.getSource().setColor("#666666");
				this.isFiltered = false;
				oBinding.filter([]);
			} else {
				oEvent.getSource().setColor("#cc1919");
				this.isFiltered = true;
				oFilter = new sap.ui.model.Filter(
						"isCritical", 
						sap.ui.model.FilterOperator.EQ, 
						true
				);
				oBinding.filter([oFilter]);
			}
		}	
		
	},
 
	// sucht für den eingegeben String in allen Druckernamen
	_search: function () {
		var oView = this.getView(),
			oProductList = oView.byId("productList"),
			oSearchField = oView.byId("searchField"),
			oBinding, oFilter, oCritFilter,
			bShowSearch = oSearchField.getValue().length !== 0; // setzt Sichtbarkeit

		if (bShowSearch) {
			this._changeNoDataTextToIndicateLoading(oProductList);
		}

		// filtert produkt liste
		oBinding = oProductList.getBinding("items");
		if (oBinding) {
			if (bShowSearch) {
				oFilter = new sap.ui.model.Filter(
					"name", 
					sap.ui.model.FilterOperator.Contains, 
					oSearchField.getValue()
				);
				
				if (this.isFiltered){
					
					oCritFilter = new sap.ui.model.Filter(
						"isCritical", 
						sap.ui.model.FilterOperator.EQ, 
						true
					);
					
					oBinding.filter([oFilter, oCritFilter]);
				} else {
					oBinding.filter([oFilter]);
				}
				
			} else {
				if (this.isFiltered) {
					oFilter = new sap.ui.model.Filter(
						"isCritical", 
						sap.ui.model.FilterOperator.EQ, 
						true
					);
					
					oBinding.filter([oFilter]);
				} else {
					oBinding.filter([]);				
				}	
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