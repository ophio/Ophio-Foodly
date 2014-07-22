/*global Firebase*/

'use strict';

/**
 * @ngdoc function
 * @name ophioFoodly.controller:CategoryCtrl
 * @description
 * # CategoryCtrl
 * Controller of the ophioFoodly
 */

var app  = angular.module('ophioFoodly');

app.controller('CategoryCtrl',
  function ($scope, settings, AuthenticationService, $filter, $routeParams, $firebase) {
    var firebaseRef = new Firebase(settings.FIREBASE_URL);
    var itemStoreRef = firebaseRef.child('availableItems');
    var voteStoreRef = firebaseRef.child('votes');

    var getTodaysVotes = function(){
      var todayDate = $filter('date')(new Date(), 'yyyy-MM-dd');
      var voteRef = $firebase(voteStoreRef.child(todayDate));
      return voteRef;
    };

    $scope.resultsDate = {
      entries: [
        {time: 1, count: 100},
        {time: 2, count: 20},
        {time: 3, count: 43}
      ]
    };

    $scope.temp = {};
    $scope.temp.addingItem = false;
    $scope.temp.newItemName = '';
    $scope.temp.currentCategory = $routeParams.category;

    $scope.availableItems = $firebase(itemStoreRef);
    $scope.todaysVotes = getTodaysVotes();
    $scope.categories = [
      {href: 'healthy', title: 'Healthy Bites'},
      {href: 'snacks', title: 'Snacks'},
      {href: 'drinks', title: 'Drinks'}
    ];

    $scope.currentUser = AuthenticationService.getCurrentUser();

    $scope.todaysVotes.$on('loaded', function() {
       $scope.$apply();
    });
    $scope.getVoteCount = function(itemVotesDict){
      return _.keys(itemVotesDict).length;
      // console.log(itemVotesDict);
    };

    $scope.upVoteItem = function(itemId){
      var d = new Date();
      var vhr = d.getHours();
      var vmin = d.getMinutes();
      if (vhr >=10 && vhr <= 17 ) {
      var itemVotes = $scope.todaysVotes.$child(itemId);
      var vote = itemVotes.$child($scope.currentUser.id);
      vote.createdAt = new Date();
      vote.$save();
      }
      else{
        $('.votealert').modal('toggle');
      }
    };

    $scope.addNewItem = function(){
      var item = {
        name: $scope.temp.itemName,
        category: $scope.temp.currentCategory,
        createdBy: $scope.currentUser.id
      };

      $scope.availableItems.$add(item);
      $scope.temp.itemName = '';
      $scope.temp.addingItem = false;
    };
  }
);
