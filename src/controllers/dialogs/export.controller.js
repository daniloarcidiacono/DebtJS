function ExportController($scope, ToastsService, DialogsService, PasteBinService, suggestedName, exportFunction) {
    this.$scope = $scope;
    this.toastsService = ToastsService;
    this.dialogsService = DialogsService;
    this.pasteBinService = PasteBinService;
    this.suggestedName = suggestedName;
    this.exportFunction = exportFunction;
    this.name = this.suggestedName + "";
    this.loading = false;
}

ExportController.prototype.isLoading = function() {
    return this.loading;
};

ExportController.prototype.cancel = function() {
    this.dialogsService.$mdDialog.cancel();
};

ExportController.prototype.accept = function() {
    this.loading = true;

    var self = this;
    this.exportFunction(this.name).then(function(pasteKey) {
        self.loading = false;
        self.dialogsService.$mdDialog.hide({ "name": name, "key": pasteKey});
    }).catch(function(error) {
        self.loading = false;
        self.toastsService.showSimpleToast({
            "textContent": "Could not export the paste:" + error.statusText
        });
    });
};

ExportController.prototype.reject = function() {
    this.dialogsService.$mdDialog.hide(undefined);
};

app.controller('exportController', ExportController, [ '$scope', 'ToastsService', 'DialogsService', 'PasteBinService' ]);