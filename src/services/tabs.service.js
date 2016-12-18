function TabsService($rootScope) {
	this.currentNavItem = "receipts";

	var self = this;
	$rootScope.$on('$routeChangeSuccess', function(event, current) {
		self.currentNavItem = current.locals.$template.toLowerCase().trim();
	});
}

app.service('TabsService', TabsService, ['$rootScope']);
