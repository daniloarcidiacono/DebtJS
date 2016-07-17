function DebtJSMovementsTab() {
	return {
		templateUrl: 'views/movements-tab/movements-tab.view.html'
	}
}

app.directive('debtjsMovementsTab', DebtJSMovementsTab, ['$scope']);