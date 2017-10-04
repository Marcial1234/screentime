var money_formatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  // the default value for minimumFractionDigits depends on the currency
  // minimumFractionDigits: 2,
});

angular.module('Electric').controller('ElectricController',
  ['$scope', '$location', '$stateParams', '$state', 'Factory',
  function($scope, $location, $stateParams, $state, Factory) {

    $scope.hide_form = true;
    
    var update_counter = function() {
      $scope.time_to_go -= 1000;
      t = $scope.time_to_go;

      // Ugly but only way I got it to work ~
      $("#days_left").text(Math.floor(t / (1000 * 60 * 60 * 24)));
      $("#hours_left").text(Math.floor((t / (1000 * 60 * 60)) % 24));
      $("#minutes_left").text(Math.floor((t / 1000 / 60) % 60));
      $("#seconds_left").text(Math.floor((t / 1000) % 60));
    }

    $scope.start = function() {
      Factory.getTime().then(
        function (res) {
          var start_of_bidding = new Date(2017, 9, 7, 19);
          var current_server_time = new Date(res.data.time);
          
          var diff = start_of_bidding - current_server_time;
          $scope.time_to_go = new Date(diff);

          if (current_server_time < start_of_bidding)
            setInterval(update_counter, 1000);
          else
            $scope.hide_form = false;
      });
      
      // $scope.new_invoice = {};
      // $scope.new_invoice.to = "investing@screentimeuf.com";
      // $scope.new_invoice.email = true;
      // $scope.new_invoice.empleados = 1;
    }

    if ($stateParams.successMessage) {
      $scope.success = $stateParams.successMessage;
    }

    $scope.email = function(isValid) {
      // $scope.error = null;
      // // console.log($scope.new_invoice);

      // if (!$scope.new_invoice.extra)
      //   $scope.new_invoice.extra = 0;

      // $scope.new_invoice.to     = $scope.new_invoice.to.replace(" ", "").split(",");
      // $scope.new_invoice.total  = $scope.new_invoice.empleados * $scope.new_invoice.precio * $scope.new_invoice.horas;
      // $scope.new_invoice.total += $scope.new_invoice.materiales * (1 + ($scope.new_invoice.extra/100));

      Factory.create($scope.new_invoice).then(
        function(response) {
          $state.go('Electric.invoice', 
            { 
              successMessage: 
                "Factura por " + money_formatter.format($scope.new_invoice.total) +" enviada!" 
            });
          $scope.invoice();
        },
        function(error) {
          $scope.error = JSON.stringify(error);
          console.log(error);
      });
    };
  }
]);