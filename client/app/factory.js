angular.module('Electric').factory('Factory', ['$http', 
  function($http) {
    var methods = {
      create: function(mensaje) {
        console.log(mensaje);
        return $http.post('/api', mensaje);
        // handle the promise here???
      }, 
      getTime: function() {
        return $http.get('/api/time');
      }, 
    };
    return methods;
  }
]);