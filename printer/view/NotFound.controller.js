sap.ui.controller("view.NotFound", {

	onInit: function () {
		// Router wird zwischen gespeichert f�r die sp�tere R�ckw�rtsnavigation
		this._router = sap.ui.core.UIComponent.getRouterFor(this);

		// Setzt eine Funktion f�r das Eventhandling
		this._router.getTargets().getTarget("notFound").attachDisplay(this._handleDisplay, this);
	},

	// Nachricht bei Fehlerhaftensuche
	_msg: "<div class='titlesNotFound'>Drucker '{0}' ist unbekannt.</div>",

	// Eventhandling f�r das Setzen der notFound View/ Ansicht
	_handleDisplay: function (oEvent) {
		var oData = oEvent.getParameter("data");
		var html = this._msg.replace("{0}", oData.hash);
		this.getView().byId("msgHtml").setContent(html);
	},

	// R�ckw�rtsnavigation
	handleNavBack: function () {
		this._router._myNavBack();
	}
});