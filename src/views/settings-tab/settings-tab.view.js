function DebtJSSettingsTab() {
	return {
		templateUrl: 'views/settings-tab/settings-tab.view.html'
	}
}

app.directive('debtjsSettingsTab', DebtJSSettingsTab, ['$scope']);