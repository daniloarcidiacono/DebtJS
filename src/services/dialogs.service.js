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

app.service('DialogsService', DialogsService, ['$mdDialog', '$q']);
