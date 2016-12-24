function ToolbarController($scope, $mdSidenav, TabsService, DocumentService, ConfigService) {
    this.$scope = $scope;
    this.$mdSidenav = $mdSidenav;
    this.tabsService = TabsService;
    this.documentService = DocumentService;
    this.configService = ConfigService;
}

ToolbarController.prototype.toggleSidenav = function() {
    this.$mdSidenav("left").toggle();
};

ToolbarController.prototype.getTitle = function() {
    var ctrl = angular.element("#currentPage").controller();
    return ctrl !== undefined ? ctrl.getTabTitle() : "";
};

ToolbarController.prototype.getButtons = function() {
    var ctrl = angular.element("#currentPage").controller();
    return ctrl !== undefined ? ctrl.getToolbarButtons() : [];
};

ToolbarController.prototype.isAnyOverflowableButton = function() {
    var buttons = this.getButtons();
    for (var i = 0; i < buttons.length; i++) {
        if (buttons[i].overflow) {
            return true;
        }
    }

    return false;
};

app.controller('toolbarController', ToolbarController, ['$scope', '$mdSidenav', 'TabsService', 'DocumentService', 'ConfigService']);