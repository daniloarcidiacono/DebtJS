app.config(function($routeProvider) {
    $routeProvider
        .when("/receipts", {
            templateUrl: "templates/receipts.template.html",
            controller: "receiptsController as $receiptsCtrl"
        })
        .when("/buyers", {
            templateUrl : "templates/buyers.template.html",
            controller: "buyersController as $buyersCtrl"
        })
        .otherwise({
            redirectTo: "/receipts"
        });
});
