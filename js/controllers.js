'use strict';

/* Controllers */

angular.module('raw.controllers', [])

  .controller('RawCtrl', function ($scope, dataService) {

  	dataService.loadSample('data/multivariate.csv').then(
      function(data){
        $scope.text = data;
      }, 
      function(error){
        $scope.error = error;
      }
    );

    $scope.raw = raw;
    $scope.data = [];
    $scope.metadata = [];
    $scope.error = false;

    $scope.parse = function(text){
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
      if (!$scope.data.length) $scope.model.clear();
    }

    $scope.delayParse = dataService.debounce($scope.parse, 500, false);

    $scope.$watch("text", function (text){
      $scope.delayParse(text);
    });

    $scope.charts = raw.charts.values().sort(function (a,b){ return a.title() < b.title() ? -1 : a.title() > b.title() ? 1 : 0; });
    $scope.chart = $scope.charts[0];
    $scope.model = $scope.chart.model();

    $scope.selectChart = function(chart){
      $scope.chart = chart;
      $scope.model = $scope.chart.model();
      $scope.model.clear();
    }

    $scope.isEmpty = function(){
      return $scope.model && !$scope.model.dimensions().values().filter(function (d){ return d.value.length } ).length;
    }

    function refreshScroll(){
      $('[data-spy="scroll"]').each(function () {
        $(this).scrollspy('refresh');
      });
    }

    $(window).scroll(function(){

      // check for mobile
      if ($(window).width() < 760 || $('#mapping').height() < 300) return;

      var scrollTop = $(window).scrollTop() + 0,
          mappingTop = $('#mapping').offset().top+10,
          mappingHeight = $('#mapping').height(),
          isBetween = scrollTop > mappingTop+10 && scrollTop <= mappingTop + mappingHeight - $(".sticky").height()-20,
          isOver = scrollTop > mappingTop + mappingHeight - $(".sticky").height()-20,
          mappingWidth = mappingWidth ? mappingWidth : $('.col-lg-9').width();


      if (isBetween) {
        $(".sticky")
          .css("position","fixed")
          .css("width", mappingWidth+"px")
          .css("top","20px")
      } 

     if(isOver) {
        $(".sticky")
          .css("position","fixed")
          .css("width", mappingWidth+"px")
          .css("top", (mappingHeight - $(".sticky").height() + 0 - scrollTop+mappingTop) + "px");
          return;
      }

      if (isBetween) return;

      $(".sticky")
        .css("position","relative")
        .css("top","")
        .css("width", "");

    })

    $(document).ready(refreshScroll);


  })