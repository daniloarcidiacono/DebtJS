function MainController($scope, $window, TabsService, DocumentService, ConfigService) {
	this.$scope = $scope;
	this.$window = $window;
	this.tabsService = TabsService;
	this.documentService = DocumentService;
	this.configService = ConfigService;
}

app.controller('mainController', MainController, ['$scope', '$window', 'TabsService', 'DocumentService', 'ConfigService']);