function MainController($scope, $mdSidenav) {
	this.$scope = $scope;
	this.$mdSidenav = $mdSidenav;
	window.setTimeout(function() {
		$mdSidenav('left').toggle();
	}, 0);
}

MainController.prototype.toggleSidenav = function() {
	this.$mdSidenav('left').toggle();
};

app.controller('mainController', MainController, ['$scope', '$mdSidenav']);