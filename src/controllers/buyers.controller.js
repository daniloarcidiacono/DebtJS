function BuyersController($scope, TabsService, DocumentService, ConfigService) {
    this.$scope = $scope;
    this.tabsService = TabsService;
    this.documentService = DocumentService;
    this.configService = ConfigService;
}

BuyersController.prototype.getTabTitle = function() {
    return "Buyers";
};

app.controller('buyersController', BuyersController, ['$scope', 'TabsService', 'DocumentService', 'ConfigService']);