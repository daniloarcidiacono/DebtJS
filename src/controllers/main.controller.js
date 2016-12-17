function MainController($scope, $mdSidenav, $window) {
	this.$scope = $scope;
	this.$mdSidenav = $mdSidenav;
	this.$window = $window;

	this.myDate = new Date();
}

MainController.prototype.toggleSidenav = function() {
	this.$mdSidenav('left').toggle();
};


MainController.prototype.navigateToGithub = function() {
	this.$window.location.href = "https://github.com/daniloarcidiacono/DebtJS";
};

app.controller('mainController', MainController, ['$scope', '$mdSidenav', '$window']);