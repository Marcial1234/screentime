angular.module('Electric').config(['$stateProvider', '$urlRouterProvider', 
  function($stateProvider) {
    $stateProvider
      .state('Electric', {
        url: '/', 
        abstract: true, 
        template: '<ui-view/>'
      })
      .state('Electric.logger', {
        url: 'registrar', 
        templateUrl: '../partials/logger.html',
        params: { successMessage: null }
      })
      .state('Electric.invoice', {
        url: 'facturas', 
        templateUrl: '../partials/invoice.html',
        params: { successMessage: null }
      })
  } 
]);