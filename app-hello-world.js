// app to send to the angular in web worker
var appDefinition = {
  cmd: 'ngApp',
  // goes to the document.body
  html: '<h1 ng-controller="helloController">Hello {{ title }}</h1>',
  setupApp: function setupApp(angular) {
    angular.module('myApp', [])
      .controller('helloController', ['$scope', function ($scope) {
        $scope.title = 'from Angular ' + angular.version.full + ' running in Web Worker!';
        console.log('changed $scope title to "hello from Angular in web worker"');
      }]);
    return 'myApp';
  },
  renderedApp: function renderedApp(angular) {
    var $timeout = angular.element(document.body).injector().get('$timeout');
    $timeout(function () {
      console.log('after digest cycle body html is');
      console.log(document.body.innerHTML);
      // communicate back to the page
      self.postMessage(document.body.innerHTML);
    });
  }
};
