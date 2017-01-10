function ToastsService($mdToast, $q) {
	this.$mdToast = $mdToast;
	this.$q = $q;
}

ToastsService.prototype.showSimpleToast = function(options) {
	this.$mdToast.show(
		this.$mdToast.simple()
			.textContent(options.textContent || 'textContent')
			.position(options.position || 'bottom right')
			.hideDelay(options.hideDelay || 3000)
	);
};

app.service('ToastsService', ToastsService, ['$mdToast', '$q']);
