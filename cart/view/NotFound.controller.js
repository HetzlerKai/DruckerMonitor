sap.ui.controller("view.NotFound", {

	onInit: function () {
		// Router wird zwischen gespeichert für die spätere Rückwärtsnavigation
		this._router = sap.ui.core.UIComponent.getRouterFor(this);

		// Setzt eine Funktion für das Eventhandling
		this._router.getTargets().getTarget("notFound").attachDisplay(this._handleDisplay, this);
	},

	// Nachricht bei Fehlerhaftensuche
	_msg: "<div class='titlesNotFound'>Drucker '{0}' ist unbekannt.</div>",

	// Eventhandling für das Setzen der notFound View/ Ansicht
	_handleDisplay: function (oEvent) {
		var oData = oEvent.getParameter("data");
		var html = this._msg.replace("{0}", oData.hash);
		this.getView().byId("msgHtml").setContent(html);
	},

	// Rückwärtsnavigation
	handleNavBack: function () {
		this._router._myNavBack();
	}
});