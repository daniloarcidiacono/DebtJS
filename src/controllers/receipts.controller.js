function ReceiptsController($scope, $filter, DialogsService, DocumentService, PasteBinService, ConfigService) {
    this.$scope = $scope;
    this.$filter = $filter;
    this.dialogsService = DialogsService;
    this.documentService = DocumentService;
    this.pasteBinService = PasteBinService;
    this.configService = ConfigService;
    this.toolbarButtons = [
        {
            "ariaLabel": "New",
            "icon": "static/icons/insert_drive_file.svg",
            "tooltip": "New (alt + N)",
            "enabledFunction": this.isDocumentTouched.bind(this),
            "onClick": this.onNewClicked.bind(this)
        },
        {
            "ariaLabel": "Add",
            "icon": "static/icons/add_circle_outline.svg",
            "tooltip": "Add item (alt + enter)",
            "onClick": this.onAddClicked.bind(this)
        },
        {
            "ariaLabel": "Delete",
            "icon": "static/icons/delete.svg",
            "tooltip": "Delete item(s) (canc)",
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

    this.$scope.$on('$routeChangeStart', function(next, current) {
        Mousetrap.unbind('alt+n');
        Mousetrap.unbind('alt+enter');
        Mousetrap.unbind('del');
    });

    Mousetrap.bind('alt+n', this.onNewClicked.bind(this));
    Mousetrap.bind('alt+enter', this.onAddClicked.bind(this));
    Mousetrap.bind('del', this.onDeleteClicked.bind(this));
}

ReceiptsController.prototype.isDocumentTouched = function() {
    return this.documentService.getItemCount() !== 0;
};

ReceiptsController.prototype.getTabTitle = function() {
    var total = this.documentService.getTotalAmount();
    if (total > 0) {
        return "Receipts (" + this.$filter('number')(total, 2) + " €)";
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
    var self = this;
    this.dialogsService.showImportDialog(undefined).then(function(paste) {
        self.pasteBinService.getPaste(paste.key).then(function(result) {
            try {
                self.importText(JSON.stringify(result.data));
            } catch (e) {
                self.dialogsService.showError({ "textContent": e, "parent": angular.element(document.body) });
            }
        }).catch(function(error) {
            self.dialogsService.showError({ "textContent": error, "parent": angular.element(document.body) });
        });
    }).catch(function() {
        // User has canceled
    });
};

ReceiptsController.prototype.importText = function(text) {
    var newDoc = JSON.parse(text);

    // Check the version
    if (newDoc.version !== this.documentService.version) {
        throw "Invalid version (expected " + this.documentService.version + ", got " + newDoc.version + ")";
    }

    // Convert back the date object
    newDoc.date = new Date(newDoc.date);
    for (var i = 0; i < newDoc.rowData.length; i++) {
        newDoc.rowData[i].amount = parseFloat(newDoc.rowData[i].amount);
    }

    // Copy
    this.documentService.setFromObject(newDoc);
};

app.controller('receiptsController', ReceiptsController, ['$scope', '$filter', 'DialogsService', 'DocumentService', 'PasteBinService', 'ConfigService']);