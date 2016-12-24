function ReceiptsController($scope, DialogsService, DocumentService, ConfigService) {
    this.$scope = $scope;
    this.dialogsService = DialogsService;
    this.documentService = DocumentService;
    this.configService = ConfigService;
    this.toolbarButtons = [
        {
            "ariaLabel": "New",
            "icon": "static/icons/insert_drive_file.svg",
            "tooltip": "New",
            "enabledFunction": this.isDocumentTouched.bind(this),
            "onClick": this.onNewClicked.bind(this)
        },
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
        },
        {
            "ariaLabel": "Upload",
            "icon": "static/icons/cloud_upload.svg",
            "iconOverflow": "static/icons/cloud_upload_black.svg",
            "tooltip": "Upload",
            "enabledFunction": this.isDocumentTouched.bind(this),
            "onClick": this.onUploadClicked.bind(this),
            "overflow": true
        },
        {
            "ariaLabel": "Download",
            "icon": "static/icons/cloud_download.svg",
            "iconOverflow": "static/icons/cloud_download_black.svg",
            "tooltip": "Download",
            "onClick": this.onDownloadClicked.bind(this),
            "overflow": true
        }
    ];
}

ReceiptsController.prototype.isDocumentTouched = function() {
    return this.documentService.getItemCount() !== 0;
};

ReceiptsController.prototype.getTabTitle = function() {
    var total = this.documentService.getTotalAmount();
    if (total > 0){
        return "Receipts (" + total + " €)";
    }

    return "Receipts";
};

ReceiptsController.prototype.getToolbarButtons = function() {
    return this.toolbarButtons;
};

ReceiptsController.prototype.getFormattedEntryBuyers = function(entry) {
    var result = "";
    var separator = "";

    for (var i = 0; i < this.documentService.buyers.length; i++) {
        var buyer = this.documentService.buyers[i];
        if (entry[buyer.name] === true) {
            result = result + separator + buyer.name;
            separator = ", ";
        }
    }

    return result;
};

ReceiptsController.prototype.onEntryClicked = function(ev, entry) {
    var entryCopy = angular.copy(entry);
    this.dialogsService.showEntryDetailsDialog(ev, entryCopy).then(function(entryEdited) {
       angular.copy(entryEdited, entry);
    }).catch(function() {
        // User has canceled
    });

    // http://stackoverflow.com/questions/37350828/multiple-elements-with-ng-click-within-in-md-list-item
    ev.stopPropagation();
};

ReceiptsController.prototype.hasEntriesSelected = function() {
    return this.documentService.getSelectedItemsCount() > 0;
};

ReceiptsController.prototype.getEntries = function() {
    return this.documentService.getData();
};

ReceiptsController.prototype.hasEntries = function() {
    return this.documentService.getData().length > 0;
};

ReceiptsController.prototype.onNewClicked = function() {
    var self = this;

    // Appending dialog to document.body to cover sidenav in docs app
    var confirm = this.dialogsService.$mdDialog.confirm()
        .title('Create new document?')
        .textContent('All data will be lost.')
        .ariaLabel('New document')
        .ok('Start from scratch')
        .cancel('Keep it');

    this.dialogsService.$mdDialog.show(confirm).then(function() {
        self.documentService.reset();
    }, function() {
        // User has canceled
    });
};

ReceiptsController.prototype.onAddClicked = function() {
    var self = this;
    var entry = this.documentService.instanceEmptyEntry();
    this.dialogsService.showEntryDetailsDialog(undefined, entry).then(function() {
        self.documentService.addItem(entry);
    }).catch(function() {
        // User has canceled
    });
};

ReceiptsController.prototype.onDeleteClicked = function() {
    var self = this;

    // Appending dialog to document.body to cover sidenav in docs app
    var confirm = this.dialogsService.$mdDialog.confirm()
        .title('Remove selected items?')
        .textContent('This operation cannot be undone.')
        .ariaLabel('Remove items')
        .ok('Remove')
        .cancel('Keep them');

    this.dialogsService.$mdDialog.show(confirm).then(function() {
        self.documentService.removeSelectedItems();
    }, function() {
        // User has canceled
    });
};

ReceiptsController.prototype.onUploadClicked = function() {
    console.debug("onUploadClicked");
};

ReceiptsController.prototype.onDownloadClicked = function() {
    console.debug("onDownloadClicked");
};

app.controller('receiptsController', ReceiptsController, ['$scope', 'DialogsService', 'DocumentService', 'ConfigService']);