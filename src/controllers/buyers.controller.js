function BuyersController($scope, DialogsService, DocumentService, ConfigService) {
    this.$scope = $scope;
    this.dialogsService = DialogsService;
    this.documentService = DocumentService;
    this.configService = ConfigService;
    this.toolbarButtons = [
        {
            "ariaLabel": "Add",
            "icon": "static/icons/add_circle_outline.svg",
            "tooltip": "Add item",
            "onClick": this.onAddClicked.bind(this)
        },
        {
            "ariaLabel": "Delete",
            "icon": "static/icons/delete.svg",
            "tooltip": "Delete item(s)",
            "enabledFunction": this.hasEntriesSelected.bind(this),
            "onClick": this.onDeleteClicked.bind(this)
        }
    ];
}

BuyersController.prototype.getTabTitle = function() {
    return "Buyers";
};

BuyersController.prototype.getToolbarButtons = function() {
    return this.toolbarButtons;
};

BuyersController.prototype.hasEntries = function() {
    return this.documentService.getBuyersCount() > 0;
};

BuyersController.prototype.getEntries = function() {
    return this.documentService.getBuyers();
};

BuyersController.prototype.getBuyerTotal = function(buyer) {
    return this.documentService.getDebt(buyer);
};

BuyersController.prototype.hasEntriesSelected = function() {
    return this.documentService.getSelectedBuyersCount() > 0;
};

BuyersController.prototype.onEntryClicked = function(ev, buyer) {
    var buyerCopy = angular.copy(buyer);
    this.dialogsService.showBuyerDetailsDialog(ev, buyerCopy).then(function(buyerEdited) {
        angular.copy(buyerEdited, buyer);
    }).catch(function() {
        // User has canceled
    });

    // http://stackoverflow.com/questions/37350828/multiple-elements-with-ng-click-within-in-md-list-item
    ev.stopPropagation();
};

BuyersController.prototype.onAddClicked = function() {
    var self = this;
    var buyer = this.documentService.instanceEmptyBuyer();
    this.dialogsService.showBuyerDetailsDialog(undefined, buyer).then(function() {
        self.documentService.addBuyer(buyer);
    }).catch(function() {
        // User has canceled
    });
};

BuyersController.prototype.onDeleteClicked = function() {
    var self = this;

    // Appending dialog to document.body to cover sidenav in docs app
    var confirm = this.dialogsService.$mdDialog.confirm()
        .title('Remove selected items?')
        .textContent('This operation cannot be undone.')
        .ariaLabel('Remove items')
        .ok('Remove')
        .cancel('Keep them');

    this.dialogsService.$mdDialog.show(confirm).then(function() {
        self.documentService.removeSelectedBuyers();
    }, function() {
        // User has canceled
    });
};

app.controller('buyersController', BuyersController, ['$scope', 'DialogsService', 'DocumentService', 'ConfigService']);