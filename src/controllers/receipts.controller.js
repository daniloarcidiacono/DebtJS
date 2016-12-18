function ReceiptsController($scope, TabsService, DocumentService, ConfigService) {
    this.$scope = $scope;
    this.tabsService = TabsService;
    this.documentService = DocumentService;
    this.configService = ConfigService;
    this.toolbarButtons = [
        {
            "ariaLabel": "New",
            "icon": "static/icons/insert_drive_file.svg",
            "tooltip": "New",
            "onClick": this.onNewClicked
        },
        {
            "ariaLabel": "Add",
            "icon": "static/icons/add_circle_outline.svg",
            "tooltip": "Add item",
            "onClick": this.onAddClicked
        },
        {
            "ariaLabel": "Delete",
            "icon": "static/icons/delete.svg",
            "tooltip": "Delete item(s)",
            "onClick": this.onDeleteClicked
        },
        {
            "ariaLabel": "Upload",
            "icon": "static/icons/cloud_upload.svg",
            "iconOverflow": "static/icons/cloud_upload_black.svg",
            "tooltip": "Upload",
            "onClick": this.onUploadClicked,
            "overflow": true
        },
        {
            "ariaLabel": "Download",
            "icon": "static/icons/cloud_download.svg",
            "iconOverflow": "static/icons/cloud_download_black.svg",
            "tooltip": "Download",
            "onClick": this.onDownloadClicked,
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

ReceiptsController.prototype.onNewClicked = function() {
    console.debug("onNewClicked");
};

ReceiptsController.prototype.onAddClicked = function() {
    console.debug("onAddClicked");
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

app.controller('receiptsController', ReceiptsController, ['$scope', 'TabsService', 'DocumentService', 'ConfigService']);