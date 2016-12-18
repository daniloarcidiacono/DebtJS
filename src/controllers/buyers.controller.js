function BuyersController($scope, TabsService, DocumentService, ConfigService) {
    this.$scope = $scope;
    this.tabsService = TabsService;
    this.documentService = DocumentService;
    this.configService = ConfigService;
    this.toolbarButtons = [
        {
            "ariaLabel": "Add",
            "icon": "static/icons/add_circle_outline.svg",
            "tooltip": "Add item",
            "onClick": this.onAddClicked
        },
        {
            "ariaLabel": "Delete",
            "icon": "static/icons/delete.svg",
            "tooltip": "Delete item(s)",
            "onClick": this.onDeleteClicked
        }
    ];
}

BuyersController.prototype.getTabTitle = function() {
    return "Buyers";
};

BuyersController.prototype.getToolbarButtons = function() {
    return this.toolbarButtons;
};

BuyersController.prototype.onAddClicked = function() {
    console.debug("onAddClicked");
};

BuyersController.prototype.onDeleteClicked = function() {
    console.debug("onDeleteClicked");
};

app.controller('buyersController', BuyersController, ['$scope', 'TabsService', 'DocumentService', 'ConfigService']);