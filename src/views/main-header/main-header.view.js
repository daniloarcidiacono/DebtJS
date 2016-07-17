function DebtJSMainHeader() {
	return {
		templateUrl: 'views/main-header/main-header.view.html'
	}
}

app.directive('debtjsMainHeader', DebtJSMainHeader, ['$scope']);