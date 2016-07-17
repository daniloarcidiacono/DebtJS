function DebtJSBuyersTab() {
	return {
		templateUrl: 'views/buyers-tab/buyers-tab.view.html'
	}
}

app.directive('debtjsBuyersTab', DebtJSBuyersTab, ['$scope']);