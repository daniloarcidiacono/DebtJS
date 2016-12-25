function MainController($scope, $window, StorageService, ToastsService, TabsService, DocumentService, ConfigService) {
	this.$scope = $scope;
	this.$window = $window;
	this.storageService = StorageService;
	this.toastsService = ToastsService;
	this.tabsService = TabsService;
	this.documentService = DocumentService;
	this.configService = ConfigService;

	// TODO: refactor this (move logic to storageService)
	// Clear the local storage when we disable the relevant option
	var self = this;
	$scope.$watch(function() {
		return self.storageService.saveToStorage;
	}, function (newValue, oldValue) {
		if (newValue !== oldValue) {
			localStorage.setItem('saveToStorage', newValue);

			if (newValue === false) {
				localStorage.removeItem('doc');
				self.toastsService.showSimpleToast({
					"textContent": "Local storage cleaned",
					"hideDelay": 1000
				});
			} else {
				self.storageService.saveOnStorage(JSON.stringify(self.documentService.getDocumentObject()));
			}
		}
	});

	// Save the data in web storage before leaving the page
	$window.onbeforeunload = function() {
		self.storageService.saveOnStorage(JSON.stringify(self.documentService.getDocumentObject()));
	};

	// Load the document from local storage
	if (this.storageService.saveToStorage) {
		var stored = this.storageService.loadFromStorage();
		if (stored !== null) {
			try {
				this.documentService.setFromObject(JSON.parse(stored));
				self.toastsService.showSimpleToast({
					"textContent": "Document loaded.",
					"hideDelay": 1000
				});
			} catch (e) {
				self.toastsService.showSimpleToast({
					"textContent": "Could not load document: " + e,
					"hideDelay": 1000
				});
			}
		}
	}
}

app.controller('mainController', MainController, ['$scope', '$window', 'StorageService', 'ToastsService', 'TabsService', 'DocumentService', 'ConfigService']);