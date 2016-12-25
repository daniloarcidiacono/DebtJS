function ImportController($scope, ToastsService, DialogsService, PasteBinService, importFunction) {
    this.$scope = $scope;
    this.toastsService = ToastsService;
    this.dialogsService = DialogsService;
    this.pasteBinService = PasteBinService;
    this.importFunction = importFunction;
    this.pastes = undefined;

    var self = this;
    this.loading = true;

    this.pasteBinService.listPastebins().then(function(result) {
        self.pastes = result.data;
        self.loading = false;
    }).catch(function(error) {
        self.pastes = [];
        self.loading = false;
        self.toastsService.showSimpleToast({
            "textContent": "Could not load pastes: " + error.statusText
        });
    });
}

ImportController.prototype.isLoading = function() {
    return this.loading;
};

ImportController.prototype.hasPastesLoaded = function() {
    return this.pastes !== undefined;
};

ImportController.prototype.hasPastes = function() {
    return this.pastes !== undefined && this.pastes.length > 0;
};

ImportController.prototype.getPastes = function() {
    return this.pastes;
};

ImportController.prototype.deletePaste = function(event, paste) {
    var self = this;

    // Appending dialog to document.body to cover sidenav in docs app
    var confirm = this.dialogsService.$mdDialog.confirm()
        .title('Remove paste?')
        .textContent('This operation cannot be undone.')
        .ariaLabel('Remove items')
        .ok('Remove')
        .parent(angular.element(document.querySelector('#importDialog')))
        .cancel('Keep them');

    this.dialogsService.$mdDialog.show(confirm).then(function() {
        // TODO: Remove paste
    }, function() {
        // User has canceled
    });

    event.stopPropagation();
};

ImportController.prototype.cancel = function() {
    this.dialogsService.$mdDialog.cancel();
};

ImportController.prototype.accept = function(paste) {
    this.loading = true;

    var self = this;
    this.importFunction(paste).then(function(importedObject) {
        self.loading = false;
        self.dialogsService.$mdDialog.hide(importedObject);
    }).catch(function(error) {
        self.loading = false;
        self.toastsService.showSimpleToast({
            "textContent": "Could not import the paste:" + error.statusText
        });
    });
};

ImportController.prototype.reject = function() {
    this.dialogsService.$mdDialog.hide(undefined);
};

app.controller('importController', ImportController, [ '$scope', 'ToastsService', 'DialogsService', 'PasteBinService' ]);