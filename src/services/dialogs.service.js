function DialogsService($mdDialog, $q) {
	this.$mdDialog = $mdDialog;
	this.$q = $q;
}

DialogsService.prototype.showEntryDetailsDialog = function(ev, entry) {
	var deferred = this.$q.defer();

	this.$mdDialog.show({
		// http://stackoverflow.com/questions/31240772/passing-data-to-mddialog
		locals: {
			"entry": entry
		},
		controller: "entryDetailsController as $entryDetailsCtrl",
		templateUrl: 'templates/dialogs/entrydetails.template.html',
		parent: angular.element(document.body),
		targetEvent: ev,
		clickOutsideToClose: true,
		fullscreen: true
	}).then(function(editedEntry) {
		if (editedEntry !== undefined) {
			deferred.resolve(editedEntry);
		} else {
			deferred.reject();
		}
	}, function() {
		deferred.reject();
	});

	return deferred.promise;
};

DialogsService.prototype.showBuyerDetailsDialog = function(ev, buyer) {
	var deferred = this.$q.defer();

	this.$mdDialog.show({
		// http://stackoverflow.com/questions/31240772/passing-data-to-mddialog
		locals: {
			"buyer": buyer
		},
		controller: "buyerDetailsController as $buyerDetailsCtrl",
		templateUrl: 'templates/dialogs/buyerdetails.template.html',
		parent: angular.element(document.body),
		targetEvent: ev,
		clickOutsideToClose: true,
		fullscreen: true
	}).then(function(editedBuyer) {
		if (editedBuyer !== undefined) {
			deferred.resolve(editedBuyer);
		} else {
			deferred.reject();
		}
	}, function() {
		deferred.reject();
	});

	return deferred.promise;
};

DialogsService.prototype.showImportDialog = function(ev) {
	var deferred = this.$q.defer();

	this.$mdDialog.show({
		controller: "importController as $importCtrl",
		templateUrl: 'templates/dialogs/import.template.html',
		parent: angular.element(document.body),
		targetEvent: ev,
		clickOutsideToClose: true,
		fullscreen: true
	}).then(function(pickedPaste) {
		if (pickedPaste !== undefined) {
			deferred.resolve(pickedPaste);
		} else {
			deferred.reject();
		}
	}, function() {
		deferred.reject();
	});

	return deferred.promise;
};

DialogsService.prototype.showError = function(options) {
	this.$mdDialog.show(
		this.$mdDialog.alert()
			.parent(options.parent || angular.element(document.body))
			.clickOutsideToClose(true)
			.title(options.title || 'Error')
			.textContent(options.textContent || "error")
			.ariaLabel(options.ariaLabel || 'Error')
			.ok(options.ok || 'Dismiss')
	);
}


app.service('DialogsService', DialogsService, ['$mdDialog', '$q']);
