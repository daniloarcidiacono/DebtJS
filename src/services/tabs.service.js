function TabsService($rootScope, $location) {
	this.currentNavItem = "receipts";

	var self = this;
	$rootScope.$on('$routeChangeSuccess', function() {
		self.currentNavItem = $location.path().trim().substring(1);
	});
}

app.service('TabsService', TabsService, ['$rootScope', '$location']);
