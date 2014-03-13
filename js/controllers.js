'use strict';

/* Controllers */

angular.module('raw.controllers', [])

  .controller('RawCtrl', ['$scope','dataService', function ($scope, dataService) {

  	dataService.loadSample('data/flow.csv').then(
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
    })

    $scope.charts = raw.charts.values().sort(function (a,b){ return a.title() < b.title() ? -1 : a.title() > b.title() ? 1 : 0; });
    $scope.chart = $scope.charts[0];
    $scope.model = $scope.chart.model();


    $scope.clearDimensions = function(){      
        $scope.model.dimensions().values().forEach(function (d){
          d.value = [];
        })
    }

    $scope.selectChart = function(chart){
      $scope.chart = chart;
      $scope.model = $scope.chart.model();
      $scope.model.clean();
    }

    $scope.isEmpty = function(){
      return $scope.model && !$scope.model.dimensions().values().filter(function (d){ return d.value.length } ).length;
    }

    $(document).ready(function(){
      $('[data-spy="scroll"]').each(function () {
        $(this).scrollspy('refresh');
      });
    })


  }])