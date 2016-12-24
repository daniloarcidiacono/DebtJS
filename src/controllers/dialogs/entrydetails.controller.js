function EntryDetailsController($scope, $mdDialog, DocumentService, entry) {
    this.$scope = $scope;
    this.$mdDialog = $mdDialog;
    this.documentService = DocumentService;
    this.entry = entry;

    // We need to convert from object keys to indexes
    for (var i = 0; i < this.documentService.buyers.length; i++) {
        var buyer = this.documentService.buyers[i];
        if (this.entry[buyer.name] === true) {
            if (this.entry.selectedBuyersIndexes === undefined) {
                this.entry.selectedBuyersIndexes = [];
            }
            this.entry.selectedBuyersIndexes.push(i);
        }
    }
}

EntryDetailsController.prototype.cancel = function() {
    this.$mdDialog.cancel();
};

EntryDetailsController.prototype.accept = function() {
    // We need to convert from indexes to keys on this.entry object
    if (this.entry.selectedBuyersIndexes !== undefined) {
        // First, reset each buyer
        for (var i = 0; i < this.documentService.buyers.length; i++) {
            var buyer = this.documentService.buyers[i];
            this.entry[buyer.name] = false;
        }

        // For each selected buyer
        for (var i = 0; i < this.entry.selectedBuyersIndexes.length; i++) {
            // Get the buyer
            var buyer = this.documentService.buyers[this.entry.selectedBuyersIndexes[i]];

            // Set the value
            this.entry[buyer.name] = true;
        }

        // Delete the indexes data
        delete this.entry.selectedBuyersIndexes;
    }

    // Hide
    this.$mdDialog.hide(this.entry);
};

EntryDetailsController.prototype.reject = function() {
    this.$mdDialog.hide(undefined);
};

app.controller('entryDetailsController', EntryDetailsController, [ '$scope', '$mdDialog', 'DocumentService' ]);