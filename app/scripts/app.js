"use strict";

angular.module("dtsc", ["ngRoute", "firebase"])
  .config(function ($routeProvider) {
    $routeProvider
      .when("/", {
        templateUrl: "views/main.html",
        controller: "MainCtrl"
      })
      .otherwise({
        redirectTo: "/"
      });
  })
  .value("baseUrl", "https://luminous-fire-9110.firebaseio.com");
