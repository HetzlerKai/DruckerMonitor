sap.ui.define([
	'sap/ui/core/UIComponent',
	'sap/m/routing/Router',
	'sap/ui/model/resource/ResourceModel',
	'sap/ui/model/odata/ODataModel',
	'sap/ui/model/json/JSONModel',
	'sap/m/Dialog',
	'sap/m/Label',
	'sap/m/Input',
	'sap/m/Button'
], function (UIComponent,
             Router,
             ResourceModel,
             ODataModel,
             JSONModel,
             Dialog,
             Label,
             Input,
             Button) {

	return UIComponent.extend("sap.ui.demo.cart.Component", {

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

			this._resourceBundle = sap.ui.getCore().getModel('i18n').getResourceBundle();
		},

		_resourceBundle: null,

		createDialog: function (oComponent, oView) {
			return new Dialog({
				title: "Login",
				contentWidth: "13%",
				contentHeight: "28%",
				content: oComponent.getDialogContent(oComponent),
				beginButton: new Button({
					id: "__login",
					text: "Log on",
					press: jQuery.proxy(oComponent.handleLoginPress, oComponent, oView)
				})
			});
			sap.ui.getCore().byId('__userInput').$().blur();
		},

		handleLoginPress: function (oView) {

			var that = this;
			
			jQuery.ajax({
				type: 'POST',
				dataType: "json",
				url: 'php/services/ajax.php',
				data: {
					post: 'login',
					name: this.__user,
					passwort: this.__pwd
				},
				success: function (response) {
					var oDruckerdaten;

					if (!response) {
						that.handleWrongCredentials("Error");
						return;
					}
					oDruckerdaten = response;

					// Check if an Array has values
					if (oDruckerdaten instanceof Array && oDruckerdaten.length > 0){

						oView.getModel("DruckerData").setData(oDruckerdaten);
						that.handleWrongCredentials("None");
						// Set up the routing
						that.routerIntialize();

						that.__dialog.close();

					} else {
						sap.m.MessageBox.alert("Datenbank liefert falshe Daten: " + oDruckerdaten);
					}

				},
				error: function(oEvent){
					debugger;
				}
			});

		},

		handleWrongCredentials: function (sState) {
			sap.ui.getCore().byId('__userInput').setValueState(sap.ui.core.ValueState[sState]);
			sap.ui.getCore().byId('__pwdInput').setValueState(sap.ui.core.ValueState[sState]);
		},

		__dialog: null,

		__user: null,

		__pwd: null,

		getDialogContent: function (oComponent) {
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

		routerIntialize: function () {
			//extend the router
			this._router = this.getRouter();

			//navigate to initial page for !phone
			if (!sap.ui.Device.system.phone) {
				this._router.getTargets().display("welcome");
			}

			// initialize the router
			this._router.initialize();
		},

		setDialogContentInvisible: function () {
			// Should avoid flickering while rendering
			document.getElementById('__pwdLabel').style.visibility = "hidden";
			document.getElementById('__userInput').style.visibility = "hidden";
			document.getElementById('__userLabel').style.visibility = "hidden";
			document.getElementById('__pwdInput').style.visibility = "hidden";
		},

		myNavBack: function () {
			var oHistory = sap.ui.core.routing.History.getInstance();
			var oPrevHash = oHistory.getPreviousHash();
			if (oPrevHash !== undefined) {
				window.history.go(-1);
			} else {
				this._router.navTo("home", {}, true);
			}
		},

		createContent: function () {
			var oJSONModel = new JSONModel(),
			// set i18n model
			 oI18nModel = new ResourceModel({
				bundleName: "sap.ui.demo.cart.i18n.appTexts"
			});

			sap.ui.getCore().setModel(oI18nModel, "i18n");

			// create root view
			var oView = sap.ui.view({
				viewName: "view.App",
				type: "XML"
			});

			oView.setModel(oJSONModel, "DruckerData");

			this.__dialog = this.createDialog(this, oView).open();

			this.setDialogContentInvisible();

			oView.setModel(oI18nModel, "i18n");

			//create and set cart model
			var oCartModel = new JSONModel({
				entries: [],
				totalPrice: "0",
				showEditAndProceedButton: false
			});
			oView.setModel(oCartModel, "cartProducts");


			// set device model
			var oDeviceModel = new JSONModel({
				isTouch: sap.ui.Device.support.touch,
				isNoTouch: !sap.ui.Device.support.touch,
				isPhone: sap.ui.Device.system.phone,
				isNoPhone: !sap.ui.Device.system.phone,
				listMode: (sap.ui.Device.system.phone) ? "None" : "SingleSelectMaster",
				listItemType: (sap.ui.Device.system.phone) ? "Active" : "Inactive"
			});
			oDeviceModel.setDefaultBindingMode("OneWay");
			oView.setModel(oDeviceModel, "device");


			// done
			return oView;
		}
	});

});
