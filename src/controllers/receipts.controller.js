function ReceiptsController($scope, $filter, $q, ToastsService, DialogsService, DocumentService, PasteBinService, ConfigService) {
    this.$scope = $scope;
    this.$filter = $filter;
    this.$q = $q;
    this.toastsService = ToastsService;
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
    entry[this.documentService.getBuyer().name] = true;
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
    var self = this;
    this.dialogsService.showExportDialog(undefined, this.documentService.getExportTitle(), this.exportPaste.bind(this)).then(function(nameAndPasteKey) {
        self.toastsService.showSimpleToast({
            "textContent": "Paste saved to http://pastebin.com/" + nameAndPasteKey.key
        });
    }).catch(function() {
        // User has canceled
    });
};

ReceiptsController.prototype.onDownloadClicked = function() {
    var self = this;
    this.dialogsService.showImportDialog(undefined, this.importPaste.bind(this)).then(function(importedObject) {
        self.documentService.setFromObject(importedObject);
    }).catch(function() {
        // User has canceled
    });
};

ReceiptsController.prototype.exportPaste = function(name) {
    var deferred = this.$q.defer();

    // 1: Get the paste
    this.pasteBinService.createPastebin(name, this.documentService.getDocumentObject()).then(function(result) {
        var pasteKey = result.data;

        // Success
        deferred.resolve(pasteKey);
    }).catch(function(error) {
        // Network error
        deferred.reject(error);
    });

    return deferred.promise;
};

ReceiptsController.prototype.importPaste = function(paste) {
    var deferred = this.$q.defer();
    var self = this;

    // 1: Get the paste
    this.pasteBinService.getPaste(paste.key).then(function(result) {
        // 2: Parse the paste
        try {
            var newDoc = result.data;

            // Check the version
            if (newDoc.version !== self.documentService.version) {
                throw "Invalid version (expected " + self.documentService.version + ", got " + newDoc.version + ")";
            }

            // Convert back the date object
            newDoc.date = new Date(newDoc.date);
            for (var i = 0; i < newDoc.rowData.length; i++) {
                newDoc.rowData[i].amount = parseFloat(newDoc.rowData[i].amount);
            }

            // Success
            deferred.resolve(newDoc);
        } catch (e) {
            // Parsing error
            deferred.reject(e);
        }
    }).catch(function(error) {
        // Network error
        deferred.reject(error);
    });

    return deferred.promise;
};

app.controller('receiptsController', ReceiptsController, ['$scope', '$filter', '$q', 'ToastsService', 'DialogsService', 'DocumentService', 'PasteBinService', 'ConfigService']);