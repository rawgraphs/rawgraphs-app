'use strict';

/* Controllers */

angular.module('raw.controllers', []).

  controller('rawCtrl', function ($scope, $http, dataService) {

    // Loading config file
    dataService.loadConfig('config.json')
    .then(
      function (data) {
        $scope.chartsUrl = data.charts;
        $scope.samples = data.samples;
        //$scope.sample = $scope.samples[0];
      },
      function (error) {
        $scope.error = error;
      }
    )

    // loading samples
    $scope.$watch("sample", function(){
      if (!$scope.sample) return;
      dataService.loadSample($scope.sample).then(
        function(data){
          $scope.text = data;
        }, 
        function(error){
          $scope.error = error;
        }
      );
    })


    $scope.chooseSample = function(sample){
      $scope.sample = sample;
    }

    // loading charts
    $scope.$watch("chartsUrl", function(chartsUrl){
      if (!chartsUrl) return;
      $scope.charts = [];

      chartsUrl.forEach(function(d, i){

        function loaded() {
          if (i == chartsUrl.length-1) {
            $scope.charts = d3.values(raw.charts).map(function(chart){ return chart(); });
            $scope.chart = $scope.charts[0];
            $scope.$apply();
          }
        }

        var fileref = document.createElement('script')
        fileref.setAttribute("src", d)
        fileref.onload = loaded;
        document.getElementsByTagName("body")[0].appendChild(fileref);
        
      })

    },true)

    // watching for changes in text
    $scope.$watch("text", function(){
      $scope.error = false;
      try {

        $scope.data = raw.parse($scope.text);
        var sniff = raw.sniffAll($scope.data)
        $scope.header = d3.keys($scope.data[0]).map(function(d){
          return { key:d, type:raw.maxOnValue(raw.count(sniff[d]))}
        })
      } catch(e){
        $scope.data = [];
        $scope.header = [];
        $scope.error = e.message;
      }

      $scope.update();

    })

  $scope.myValueFunction = function(card) {
    console.log("asdasdas");
    return 0;
   //return card.values.opt1 + card.values.opt2;
  };

  $scope.$watch("chart", function(){
    $scope.update();
  }, true)
   

  // general update
  $scope.update = function(){
  
    $('[data-spy="scroll"]').each(function () {
      var $spy = $(this).scrollspy('refresh')
      //$spy.scrollspy({offset: 10})
    });
  
  }



  // listeners
  $(document).ready(function(){

    $scope.update();

    $("#header ul li a[href^='#']").on('click', function(e) {
      e.preventDefault();
      $('html, body').animate({ scrollTop: $(this.hash).offset().top - 70 }, 500, "easeOutCubic");
    });

   $('.toggles').click(function() {
      $('a.toggles i').toggleClass('icon-chevron-left icon-chevron-right');
      $('#options').toggle(0, function() {

        $('#visualization').toggleClass('span12'),
        $('#visualization').toggleClass('span9')

      });
    });
    

  });
   
  });
