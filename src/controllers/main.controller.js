function MainController($scope, $mdSidenav, $window, DocumentService, ConfigService) {
	this.$scope = $scope;
	this.$mdSidenav = $mdSidenav;
	this.$window = $window;
	this.documentService = DocumentService;
	this.configService = ConfigService;
}

MainController.prototype.toggleSidenav = function() {
	this.$mdSidenav("left").toggle();
};

MainController.prototype.navigateToGithub = function() {
	this.$window.location.href = this.configService.getGithubLink();
};

MainController.prototype.getAuthor = function() {
	return this.configService.getAuthor();
};

MainController.prototype.getAppVersion = function() {
	return this.configService.getAppVersion();
};

MainController.prototype.getDocument = function() {
	return this.documentService;
};

app.controller('mainController', MainController, ['$scope', '$mdSidenav', '$window', 'DocumentService', 'ConfigService']);