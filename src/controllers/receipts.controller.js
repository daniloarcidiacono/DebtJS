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
            "onClick": this.onDeleteClicked.bind(this)
        },
        {
            "ariaLabel": "Upload",
            "icon": "static/icons/cloud_upload.svg",
            "iconOverflow": "static/icons/cloud_upload_black.svg",
            "tooltip": "Upload",
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

ReceiptsController.prototype.getTabTitle = function() {
    return "Receipts";
};

ReceiptsController.prototype.getToolbarButtons = function() {
    return this.toolbarButtons;
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

ReceiptsController.prototype.onNewClicked = function() {
    console.debug("onNewClicked");
};

ReceiptsController.prototype.onAddClicked = function() {
    var self = this;

    var entry = this.documentService.instanceEmptyEntry();
    this.dialogsService.showEntryDetailsDialog(undefined, entry).then(function() {
        console.debug(entry);
        //self.documentService.addItem(entry);
    }).catch(function() {
        // User has canceled
    });
};

ReceiptsController.prototype.onDeleteClicked = function() {
    console.debug("onDeleteClicked");
};

ReceiptsController.prototype.onUploadClicked = function() {
    console.debug("onUploadClicked");
};

ReceiptsController.prototype.onDownloadClicked = function() {
    console.debug("onDownloadClicked");
};

app.controller('receiptsController', ReceiptsController, ['$scope', 'DialogsService', 'DocumentService', 'ConfigService']);