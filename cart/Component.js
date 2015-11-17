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
						pattern: "category/product",
						name: "product",
						target: "productView"
					},
					{
						pattern: "product/{productId}",
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
			var oJSONModel = new JSONModel();
			sap.ui.getCore().setModel(oJSONModel, "DruckerData");
			
			// call overwritten init (calls createContent)
			UIComponent.prototype.init.apply(this, arguments);
			
			this.__dialog = this.createDialog(this).open();
			this.setDialogContentInvisible();

		},

		_resourceBundle: null,
		
		createDialog: function(oComponent){
			this._resourceBundle = sap.ui.getCore().getModel('i18n').getResourceBundle();

			return new Dialog({
				title: "Login",
				contentWidth: "13%",
				contentHeight: "28%",
				content: oComponent.getDialogContent(oComponent),
				beginButton: new Button({
					id: "__login",
					text: "Log on",
					press: jQuery.proxy(oComponent.handleLoginPress, oComponent)
				})
			});
			sap.ui.getCore().byId('__userInput').$().blur();
		},
		
		handleLoginPress: function(){
			
			jQuery.ajax({
		        type : 'POST',
		        dataType: "json",
		        url : 'php/services/ajax.php',
		        data: {
		            post: 'login',
		            name: this.__user,
		            passwort: this.__pwd
		        },
		        success: function(response){
		        	var oDruckerdaten;
		        	
		        	if(!response){
		        		this.handleWrongCredentials("Error");
						return;
		        	}
		            oDruckerdaten = response;           
		            
		            // Check if an Array has values
		            if(oDruckerdaten instanceof Array && oDruckerdaten.length > 0)){
		            	
		            	sap.ui.getCore().getModel("DruckerData").setData(oDruckerdaten);
		            	
						this.handleWrongCredentials("None");
						// Set up the routing
						this.routerIntialize();

						this.__dialog.close();
						
		            } else {
		            	sap.m.MessageBox.alert("Datenbank liefert falshe Daten: " + oDruckerdaten);
		            }
		            
		        }
		    });
			
		},

		handleWrongCredentials: function(sState){
			sap.ui.getCore().byId('__userInput').setValueState(sap.ui.core.ValueState[sState]);
			sap.ui.getCore().byId('__pwdInput').setValueState(sap.ui.core.ValueState[sState]);
		},

		__dialog: null,
		
		__user: null,
		
		__pwd: null,
		
		getDialogContent: function(oComponent){
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
		
		setDialogContentInvisible: function(){
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

			// set i18n model
			var oI18nModel = new ResourceModel({
				bundleName: "sap.ui.demo.cart.i18n.appTexts"
			});
			sap.ui.getCore().setModel(oI18nModel, "i18n");

			// create root view
			var oView = sap.ui.view({
				viewName: "view.App",
				type: "XML"
			});

			oView.setModel(oI18nModel, "i18n");

			jQuery.sap.require("model.Config");
			// set data model
			var sUrl = model.Config.getServiceUrl();

			// start mock server
			jQuery.sap.require("sap.ui.core.util.MockServer");
			var oMockServer = new sap.ui.core.util.MockServer({
				rootUri: sUrl
			});
			oMockServer.simulate(jQuery.sap.getModulePath("model/metadata", ".xml"), jQuery.sap.getModulePath("model", ""));
			oMockServer.start();
			//var sMsg = "Running in demo mode with mock data.";
			//sap.m.MessageToast.show(sMsg, {
			//	duration: 4000
			//});

			var oModel = new ODataModel(sUrl, true, model.Config.getUser(), model.Config.getPwd());
			//if we do not set this property to false, this would lead to a synchronized request which blocks the ui
			oModel.setCountSupported(false);

			oView.setModel(oModel);

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
