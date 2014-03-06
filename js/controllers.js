'use strict';

/* Controllers */

angular.module('raw.controllers', []).
  controller('RawCtrl', ['$scope','dataService', function ($scope, dataService) {

  	dataService.loadSample('data/dispersion.csv').then(
      function(data){
        $scope.text = data;
      }, 
      function(error){
        $scope.error = error;
      }
    );

    $scope.raw = raw;

    // watching for changes in text
    $scope.$watch("text", function (text){
      
      try {
        var parser = raw.parser(text);
        $scope.data = parser.data();
        $scope.metadata = parser.metadata();
        $scope.error = false;
      } catch(e){
        $scope.data = [];
        $scope.metadata = [];
        $scope.error = e.message;
      }
      
      $scope.chart = raw.charts.values()[0];
      $scope.model = $scope.chart.model();

      //$scope.update();

    })


    $scope.update = function(){
    	$scope.$apply();
    }

    $(document).ready(function(){
      $('[data-spy="scroll"]').each(function () {
        $(this).scrollspy('refresh');
      });
    })


  }])