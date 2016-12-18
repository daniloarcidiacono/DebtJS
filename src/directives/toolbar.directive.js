function ToolbarDirective() {
    return {
        restrict: 'E',
        templateUrl: 'templates/toolbar.template.html',
        controller: 'toolbarController as $toolbarCtrl'
    }
}

app.directive("debtjsToolbar", ToolbarDirective);