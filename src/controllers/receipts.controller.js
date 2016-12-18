function ReceiptsController($scope, TabsService, DocumentService, ConfigService) {
    this.$scope = $scope;
    this.tabsService = TabsService;
    this.documentService = DocumentService;
    this.configService = ConfigService;
}

ReceiptsController.prototype.getTabTitle = function() {
    return "Receipts";
};

app.controller('receiptsController', ReceiptsController, ['$scope', 'TabsService', 'DocumentService', 'ConfigService']);