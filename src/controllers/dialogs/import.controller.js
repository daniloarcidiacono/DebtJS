function ImportController($scope, $mdDialog, DialogsService, PasteBinService) {
    this.$scope = $scope;
    this.$mdDialog = $mdDialog;
    this.dialogsService = DialogsService;
    this.pasteBinService = PasteBinService;
    this.pastes = undefined;

    var self = this;
    this.loading = true;
    this.loadingError = undefined;

    this.pasteBinService.listPastebins().then(function(result) {
        self.pastes = result.data;
        self.loading = false;
    }).catch(function(error) {
        self.pastes = undefined;
        self.loadingError = error;
        self.loading = false;
    });
}

ImportController.prototype.isLoading = function() {
    return this.loading;
};

ImportController.prototype.hasPastes = function() {
    return !this.loading && !this.loadingError && this.pastes.length > 0;
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
    this.$mdDialog.cancel();
};

ImportController.prototype.accept = function(paste) {
    // Hide
    this.$mdDialog.hide(paste);
};

ImportController.prototype.reject = function() {
    this.$mdDialog.hide(undefined);
};

app.controller('importController', ImportController, [ '$scope', '$mdDialog', 'DialogsService', 'PasteBinService' ]);