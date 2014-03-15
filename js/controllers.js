'use strict';

/* Controllers */

angular.module('raw.controllers', [])

  .controller('RawCtrl', function ($scope, dataService) {

  	dataService.loadSample('data/dispersion.csv').then(
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
          mappingTop = $('#mapping').offset().top,
          mappingHeight = $('#mapping').height(),
          isBetween = scrollTop > mappingTop && scrollTop <= mappingTop + mappingHeight-$(".sticky").height()-70,
          isOver = scrollTop > mappingTop+mappingHeight,
          isSticky = false,
          mappingWidth = mappingWidth ? mappingWidth : $('.col-lg-9').width();

      if (isBetween && !isSticky) {
        $(".sticky")
          .css("position","fixed")
          .css("width", mappingWidth+"px")
          .css("top","80px")
        return;
      } 

      if ($(".sticky").css('position') != 'fixed') return;

      $(".sticky")
        .css("position","relative")
        .css("top","0px")
        .css("width", "");

      isSticky = false;

    })

    $(document).ready(refreshScroll);


  })