function SidenavController($scope, $mdSidenav, $window, StorageService, DocumentService, ConfigService) {
    this.$scope = $scope;
    this.$mdSidenav = $mdSidenav;
    this.$window = $window;
    this.storageService = StorageService;
    this.documentService = DocumentService;
    this.configService = ConfigService;
}

SidenavController.prototype.toggleSidenav = function() {
    this.$mdSidenav("left").toggle();
};

SidenavController.prototype.closeSidenav = function() {
    this.$mdSidenav("left").close();
};

SidenavController.prototype.navigateToGithub = function() {
    this.$window.location.href = this.configService.getGithubLink();
};

SidenavController.prototype.getAuthor = function() {
    return this.configService.getAuthor();
};

SidenavController.prototype.getAppVersion = function() {
    return this.configService.getAppVersion();
};

app.controller('sidenavController', SidenavController, ['$scope', '$mdSidenav', '$window', 'StorageService', 'DocumentService', 'ConfigService']);