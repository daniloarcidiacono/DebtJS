function SidenavDirective() {
    return {
        restrict: 'E',
        templateUrl: 'templates/sidenav.template.html',
        controller: 'sidenavController as $sidenavCtrl'
    }
}

app.directive("debtjsSidenav", SidenavDirective);