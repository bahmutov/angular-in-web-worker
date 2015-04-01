var appDefinition = {
  cmd: 'ngApp',
  // goes to the document.body
  html: '<my-calendar></my-calendar>',
  setupApp: function setupApp(angular) {
    'use strict';
    function range(n) {
      var numbers = [];
      for (let k = 0; k < n; k += 1) {
        numbers.push(k);
      }
      return numbers;
    }
    var DAYS = [];
    for (let k = 1; k < 32; k += 1) {
      DAYS.push('Oct ' + k);
    }

    var randomMillis = function() {
      return Math.floor(Math.random() * 10000);
    }

    angular.module("myapp", []).
    directive("myCalendar", function() {
        return {
            restrict: 'E',
            scope: true,
            replace: true,
            template:("\n<div>\n           <button class=\"btn\" id=\"load\" ng-hide=\"loaded\" ng-click=\"load()\">Load</button>\n" +
              "<button class=\"btn\" ng-show=\"loaded\" ng-click=\"searchAll()\">Search all month</button>\n           " +
              "<table ng-if=\"loaded\">\n            <tr>\n             <th ng-repeat=\"day in days\" class=\"day-header\">\n{{day}}\n</th>\n</tr>\n" +
              "<tr ng-repeat=\"hour in hours\">\n" +
                "<td ng-repeat=\"day in days\" class=\"hour-cell\">\n" +
                  "<my-calendar-cell hour=\"{{hour}}\" day=\"{{day}}\"></my-calendar-cell>\n" +
                "</td>\n" +
              "</tr>\n" +
            "</table>\n" +
          "</button>\n"),
            link: function(scope, element, attrs) {
                scope.loaded = false;
                scope.hours = range(1);
                scope.days = DAYS;

                scope.searchAll = function() {
                  scope.$broadcast('allSearchRequested');
                }

                scope.load = function() {
                  scope.loaded = true;
                }
            }
        }
    }).
    directive("myCalendarCell", function() {
      return {
        restrict: 'E',
        replace: true,
        template: ("\n<div ng-click=\"cellClicked(day, hour)\" ng-class=\"cellClass()\">\n" +
         "<div ng-if=\"showHour()\" class=\"time\">\n          {{hour}}:00\n        </div>\n" +
         "<div ng-if=\"showSpinner()\">\n          ...\n        </div>\n" +
         "<div ng-if=\"showSearchResults()\">\n          <div>{{status.searchResults.options}}</div>\n" +
         "<div class=\"result-label\">results</div>\n</div>\n</div>\n"),
        link: function(scope, element, attrs) {
          scope.day = attrs.day;
          scope.hour = attrs.hour;
          scope.status = {};
        },
        controller: function($scope, $rootScope, $timeout) {
          $scope.showSpinner = function() {
            return $scope.status.isSearching;
          }
          $scope.showHour = function() {
            return !$scope.status.isSearching && !$scope.status.searchResults;
          }
          $scope.showSearchResults = function() {
            return $scope.status.searchResults;
          }
          $scope.cellClass = function() {
            if ($scope.status.isSearching) {
              return 'searching';
            } else if ($scope.status.searchResults) {
              if ($scope.status.searchResults.options > 3) {
                return 'good-results'
              } else if ($scope.status.searchResults.options > 1) {
                return 'weak-results'
              } else {
                return 'bad-results'
              }
            }
          }
          $scope.cellClicked = function() {
            delete $scope.status.searchResults;
            $scope.status.isSearching = true;
            // Simulate an AJAX request:
            $timeout(function() {
              $scope.status.isSearching = false;
              $scope.status.searchResults = {options: Math.floor(Math.random() * 5)};
            }, randomMillis());
          }
          $scope.$on('allSearchRequested', function() {
            $scope.cellClicked();
          });
        }
      }
    });
    return 'myapp';
  },
  renderedApp: function renderedApp(angular) {
    var $timeout = angular.element(document.body).injector().get('$timeout');
    $timeout(function () {
      console.log('first digest cycle finished, clicking load');
      var scope = angular.element(document.getElementById('load')).scope();
      scope.load();
      $timeout(function () {
        console.log('finished loading');
        // console.log(document.body.innerHTML);
        // communicate back to the page
        self.postMessage(document.body.innerHTML);
      });
    });
  }
};
