"use strict";
/*global Firebase, FirebaseSimpleLogin, _*/

angular.module("dtsc")
.controller("MainCtrl", function ($scope, $firebase, baseUrl) {
  $scope.description = "";
  $scope.tricks = $firebase(new Firebase(baseUrl + "/tricks"));
  $scope.tricked = $firebase(new Firebase(baseUrl + "/tricked"));

  $scope.auth = new FirebaseSimpleLogin(new Firebase(baseUrl), function(error, user) {
    if (user) {
      $scope.user = user;
      $scope.$apply();
    }
  });

  $scope.logIn = function() {
    $scope.auth.login("github");
  };

  $scope.logOut = function() {
    $scope.auth.logout();
    $scope.user = undefined;
  };

  $scope.isLoggedIn = function() {
    return angular.isDefined($scope.user);
  };

  $scope.addTrick = function() {
    if ($scope.description) {
      $scope.tricks.$add({
        username: $scope.user.username,
        email: $scope.user.email,
        avatar_url: $scope.user.avatar_url,
        description: $scope.description,
        votes: [$scope.user.uid],
        shirt: _.sample(["interface", "objectlateral", "sitepen", "changelog"])
      });

      $scope.description = "";
    }
  };

  $scope.voteCount = function(trick) {
    if (trick) {
      return trick.votes.length;
    }
  };

  $scope.canVote = function(trick) {
    return !_.contains($scope.tricks[trick.$id].votes, $scope.user.uid);
  };

  $scope.vote = function(trick) {
    if (!angular.isDefined(trick.votes)) {
      trick.votes = [];
    }

    if ($scope.canVote(trick)) {
      var trickRef = $scope.tricks.$child(trick.$id);
      trick.votes.push($scope.user.uid);
      var newVotes = _.uniq(trick.votes);
      trickRef.$update({votes: newVotes});
    }
  };

  $scope.canComplete = function(trick) {
    return $scope.user.uid === "github:8212";
  };

  $scope.complete = function(trick) {
    $scope.tricked.$add({
      username: trick.username,
      email: trick.email,
      description: trick.description,
      shirt: trick.shirt
    });
    $scope.tricks.$remove(trick.$id);
  };

  $scope.canRemove = function(trick) {
    return ($scope.user.uid === "github:8212" || trick.username === $scope.user.username);
  };

  $scope.remove = function(trick) {
    $scope.tricks.$remove(trick.$id);
  };
});
