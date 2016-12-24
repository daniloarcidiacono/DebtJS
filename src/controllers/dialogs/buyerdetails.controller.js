function BuyerDetailsController($scope, $mdDialog, buyer) {
    this.$scope = $scope;
    this.$mdDialog = $mdDialog;
    this.buyer = buyer;
}

BuyerDetailsController.prototype.cancel = function() {
    this.$mdDialog.cancel();
};

BuyerDetailsController.prototype.accept = function() {
    // Hide
    this.$mdDialog.hide(this.buyer);
};

BuyerDetailsController.prototype.reject = function() {
    this.$mdDialog.hide(undefined);
};

app.controller('buyerDetailsController', BuyerDetailsController, [ '$scope', '$mdDialog' ]);