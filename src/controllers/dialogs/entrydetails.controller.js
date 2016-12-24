function EntryDetailsController($scope, $mdDialog, DocumentService, entry) {
    this.$scope = $scope;
    this.$mdDialog = $mdDialog;
    this.documentService = DocumentService;
    this.entry = entry;
}

EntryDetailsController.prototype.cancel = function() {
    this.$mdDialog.cancel();
};

EntryDetailsController.prototype.accept = function() {
    this.$mdDialog.hide(this.entry);
};

EntryDetailsController.prototype.reject = function() {
    this.$mdDialog.hide(undefined);
};

app.controller('entryDetailsController', EntryDetailsController, [ '$scope', '$mdDialog', 'DocumentService' ]);