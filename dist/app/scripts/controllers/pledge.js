'use strict';

angular.module('distApp')
  .controller('PledgeCtrl', ['$scope', '$routeParams', 'API', 'Socket', function($scope, $routeParams, API, Socket) {

  var project_id = $routeParams.project_id;
  
  // amount field is enabled by default
  $scope.amountDisabled = false;

  API.project({ project_id: project_id }).$promise.then(function(project) {
    $scope.project = project

    $scope.amount = project.cost // the user won't be able to set the pledge amount
        // and it will default to the cost of the project if under 40k
      if (project.cost < 40000) {
        $scope.amountDisabled = true
      }

      if (project.limit == 0) {
  		$scope.alreadyFunded = true
  	  }

  	  $scope.showPledgeConfirmation = false

      console.log($scope.amountDisabled)
  })

  $scope.pledge = function() {
    Socket.emit('project::fund', {
      name: [$scope.first_name, $scope.last_name].join(' '),
      email: $scope.email,
      amount: $scope.amount,
      address: $scope.address,
 	  phone_number: $scope.phone_number,
      project_id: project_id 
    }, function(err) {
      if (err) $scope.showErrorLabel = true;
      $scope.showSuccessLabel = true
    })
  }

  Socket.on('project::funded', function(data) {
    if (data.project_id == project_id) {
      $scope.alreadyFunded = true
    }
  })


  $scope.relateIQ_contacts = {}
  $scope.relateIQ_contacts.first_names = window.first_names
  $scope.relateIQ_contacts.last_names = window.last_names
  $scope.relateIQ_contacts.emails = window.emails
  $scope.relateIQ_contacts.phone_numbers = window.phone_numbers
  $scope.relateIQ_contacts.addresses = window.addresses

  $scope.onSelect = function() {

    // get the index of the selected first_name in the array, then autofill based on 
    // the same array index
    var i = window.first_names.indexOf($scope.first_name)
    console.log('got index = ', i)
    // did not bother doing the autofill for other parameters for now

    $scope.last_name = window.last_names[i]
    $scope.email = window.emails[i]
    $scope.phone_number = window.phone_numbers[i]
    $scope.address = window.addresses[i]
  };
}]);


