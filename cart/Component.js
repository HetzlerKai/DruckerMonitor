sap.ui.define([
	'sap/ui/core/UIComponent',
	'sap/m/routing/Router',
	'sap/ui/model/resource/ResourceModel',
	'sap/ui/model/odata/ODataModel',
	'sap/ui/model/json/JSONModel',
	'sap/m/Dialog',
	'sap/m/Label',
	'sap/m/Input',
	'sap/m/Button',
	'sap/m/MessageBox'
], function (UIComponent,
             Router,
             ResourceModel,
             ODataModel,
             JSONModel,
             Dialog,
             Label,
             Input,
             Button,
             MessageBox) {

	return UIComponent.extend("sap.ui.demo.cart.Component", {
 
		// Einstellungen fuer die Navigation
		metadata: {
			includes: ["css/style.css"],
			routing: {
				config: {
					routerClass: Router,
					viewType: "XML",
					viewPath: "view",
					controlId: "splitApp",
					transition: "slide",
					bypassed: {
						target: ["home", "notFound"]
					}
				},
				routes: [
					{
						pattern: "",
						name: "home",
						target: "home"
					},
					{
						pattern: "product",
						name: "product",
						target: "productView"
					},
					{
						pattern: "product/{id}",
						name: "printerDetails",
						target: ["home", "productView"]
					}
				],
				targets: {
					productView: {
						viewName: "Product",
						viewLevel: 3,
						controlAggregation: "detailPages"
					},
					notFound: {
						viewName: "NotFound",
						viewLevel: 3,
						controlAggregation: "detailPages"
					},
					welcome: {
						viewName: "Welcome",
						viewLevel: 0,
						controlAggregation: "detailPages"
					},
					home: {
						viewName: "Home",
						viewLevel: 1,
						controlAggregation: "masterPages"
					}
				}
			}
		},

		init: function () {
			// call overwritten init (calls createContent)
			UIComponent.prototype.init.apply(this, arguments);

			// i18n-Model wird in einem privaten Objekt fuer spaeteren Gebrauch gespreichert
			this._resourceBundle = this.getModel('i18n').getResourceBundle();
		},

		_resourceBundle: null,

		// Liefert eine neue Dialoginstanz
		createDialog: function (oComponent, oView) {
			return new Dialog({
				title: "Login",
				contentWidth: "13%",
				contentHeight: "28%",
				content: oComponent.getDialogContent(oComponent),
				beginButton: new Button({
					id: "__login",
					text: "Log on",

					// Mit der Verwendung der Proxy Funktion wird der aktuelle "this" Zeiger Aufbergeben an die handleLoginPress Funktion
					press: jQuery.proxy(oComponent.handleLoginPress, oComponent, oView)
				})
			});

		},

		handleLoginPress: function (oView) {
			var that = this;

			// Holen der Daten aus der Datenbank
			jQuery.ajax({
				type: 'POST',
				dataType: "json",
				url: 'php/services/ajax.php',
				data: {
					post: 'login',
					name: this.__user,
					passwort: this.__pwd
				},
				// Beim Erfolg wird success ausgefuehrt
				success: function (response) {

					if (!response) {
						that.handleWrongCredentials("Error");
						return;
					}

					response = that._setCriticalFlagToResponseData(response);

					// Ueberpruefung des Arrays auf die Inhaltlaenge
					if (response instanceof Array && response.length > 0) {

						// Empfangene Daten werden an das Viewmodel gesetzt
						oView.getModel("DruckerData").setData(response);
						sap.ui.getCore().getModel("DruckerData").setData(response);

						// Setzt die Statusfarbe der Anmeldefelder zurück
						that.handleWrongCredentials("None");

						// Initialisiert das Routing/ die Navigation
						that.routerInitialize();

						// Dialog wird geschlossen
						that.__dialog.close();

					} else {
						// Falls das Array leer ist, sprich keine Daten geliefrt worden sind, wird eine Fehlermeldung ausgegeben
						MessageBox.alert("Datenbank liefert falshe Daten: " + response);
					}

				},
				// Beim Fehler wird eine Nachricht ausgegeben
				error: function (oEvent) {
					alert("Beim Lesen der Daten ist ein Fehler aufgetreten: " + oEvent);
				}
			});

		},
		
		_aCriticalEntryMap: [],
		
		_setCriticalEntriesIntoArray: function(i){
			this._aCriticalEntryMap.push(i);
		},

		_setCriticalFlagToResponseData: function(aData){
			var count;
			
			for(count = 0; aData.length > count; count++){
				aData[count].isCritical = false;
				
				switch(aData[count].typ){
					case "SW":
						if (aData[count].toner_schwarz < 10) {
							
							aData[count].isCritical = true;
							this._setCriticalEntriesIntoArray(count);
						}
					break;
					
					case "CO":
						if (aData[count].toner_cyan < 10 ||
							aData[count].toner_gelb < 10 ||
							aData[count].toner_magenta < 10 ||
							aData[count].toner_schwarz < 10) {
								
							aData[count].isCritical = true;
							this._setCriticalEntriesIntoArray(count);
						}
					break;
				}
				

			}
			return aData;
		},

		handleWrongCredentials: function (sState) {
			// Setzt die Statusfarbe der Anmeldefelder auf einen gewuenschten Wert
			sap.ui.getCore().byId('__userInput').setValueState(sap.ui.core.ValueState[sState]);
			sap.ui.getCore().byId('__pwdInput').setValueState(sap.ui.core.ValueState[sState]);
		},

		__dialog: null,

		__user: null,

		__pwd: null,

		getDialogContent: function (oComponent) {

			// Aufbereitung des UI-Inhaltes fuer das Anmeldedialog
			return [
				new Label({
					text: "Username:",
					id: "__userLabel"
				}).addStyleClass("loginDialogLabel"),
				new Input({
					liveChange: function (oEvent) {
						oComponent.__user = oEvent.getParameter('newValue');
					},
					id: "__userInput",
					width: "80%"
				}).addStyleClass("loginDialogInputUserPosition"),
				new Label({
					id: "__pwdLabel",
					text: "Password:",
				}).addStyleClass("loginDialogLabel"),
				new Input({
					liveChange: function (oEvent) {
						oComponent.__pwd = oEvent.getParameter('newValue');
					},
					id: "__pwdInput",
					width: "80%",
					type: sap.m.InputType.Password
				}).addStyleClass("loginDialogInputPwdPosition")
			];
		},

		// Routervorbereitungen
		routerInitialize: function () {

			// Router Instanz wird auf einer privaten Variable gespeichert
			this._router = this.getRouter();

			// Darstellung der Startseite
			this._router.getTargets().display("welcome");

			// Routerinitialisierung
			this._router.initialize();
		},

		setDialogContentInvisible: function () {
			// Zur Vermeidung des Flackerns beim Starten des Anmeldedialoges
			document.getElementById('__pwdLabel').style.visibility = "hidden";
			document.getElementById('__userInput').style.visibility = "hidden";
			document.getElementById('__userLabel').style.visibility = "hidden";
			document.getElementById('__pwdInput').style.visibility = "hidden";
		},

		// Erstellung des UIComponent Inhaltes, welches dann auf dem Bildschirm erscheint
		createContent: function () {
			var oJSONModel = new JSONModel(),

			// Initialisieren und Setzen des i18n Models an die Core Komponente
				oI18nModel = new ResourceModel({
					bundleName: "sap.ui.demo.cart.i18n.appTexts"
				});
			this.setModel(oI18nModel, "i18n");

			// Initialisieren und Setzen der stamm=root View
			var oView = sap.ui.view({
				viewName: "view.App",
				type: "XML"
			});
			oView.setModel(oJSONModel, "DruckerData");
			sap.ui.getCore().setModel(oJSONModel, "DruckerData");

			this.__dialog = this.createDialog(this, oView).open();
			this.setDialogContentInvisible();

			// Setzen des i18n Models an die View/ Ansicht
			oView.setModel(oI18nModel, "i18n");

			return oView;
		}
	});

});
