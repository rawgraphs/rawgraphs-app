'use strict';

/* Controllers */

angular.module('raw.controllers', [])

  .controller('RawCtrl', function ($scope, dataService) {

    $scope.samples = [
      { title : 'Cars (Multivariate)', url : 'data/multivariate.csv' },
      { title : 'Movies (Dispersion)', url : 'data/dispersions.csv' },
      { title : 'Music industry (Time series)', url : 'data/music.csv' },
      { title : 'Lineup (Time chunks)', url : 'data/lineup.tsv' },
      { title : 'Orchestra (Weighted hierarchy)', url : 'data/orchestra.csv' },
      { title : 'Animal kingdom (Hierarchy)', url : 'data/animals.tsv' },
      { title : 'Titanic\'s passengers (Multi categorical)', url : 'data/titanic.tsv' }
    ]

    $scope.$watch('sample', function (sample){
      if (!sample) return;
      dataService.loadSample(sample.url).then(
        function(data){
          $scope.text = data;
        },
        function(error){
          $scope.error = error;
        }
      );
    });

    // init
    $scope.raw = raw;
    $scope.data = [];
    $scope.metadata = [];
    $scope.error = false;
    $scope.loading = true;

    $scope.categories = ['Hierarchies', 'Time Series', 'Distributions', 'Correlations', 'Others'];
    $scope.bgColors = {
      'Hierarchies': '#0f0',
      'Time Series': 'rgb(255, 185, 5)',
      'Distributions': 'rgb(5, 205, 255)',
      'Correlations': '#df0',
      'Others': '#0f0'
    }

    $scope.parse = function(text){

      if ($scope.model) $scope.model.clear();

      $scope.data = [];
      $scope.metadata = [];
      $scope.error = false;
      $scope.$apply();

      try {
        var parser = raw.parser();
        $scope.data = parser(text);
        $scope.metadata = parser.metadata(text);
        $scope.error = false;
      } catch(e){
        $scope.data = [];
        $scope.metadata = [];
        $scope.error = e.name == "ParseError" ? +e.message : false;
      }
      if (!$scope.data.length && $scope.model) $scope.model.clear();
      $scope.loading = false;
    }

    $scope.delayParse = dataService.debounce($scope.parse, 500, false);

    $scope.$watch("text", function (text){
      $scope.loading = true;
      $scope.delayParse(text);
    });

    $scope.charts = raw.charts.values().sort(function (a,b){ return a.title() < b.title() ? -1 : a.title() > b.title() ? 1 : 0; });
    $scope.chart = $scope.charts[0];
    $scope.model = $scope.chart ? $scope.chart.model() : null;

    $scope.$watch('error', function (error){
      if (!$('.CodeMirror')[0]) return;
      var cm = $('.CodeMirror')[0].CodeMirror;
      if (!error) {
        cm.removeLineClass($scope.lastError,'wrap','line-error');
        return;
      }
      cm.addLineClass(error, 'wrap', 'line-error');
      cm.scrollIntoView(error);
      $scope.lastError = error;

    })

    $('body').mousedown(function (e,ui){
      if ($(e.target).hasClass("dimension-info-toggle")) return;
      $('.dimensions-wrapper').each(function (e){
        angular.element(this).scope().open = false;
        angular.element(this).scope().$apply();
      })
    })

    $scope.codeMirrorOptions = {
      lineNumbers : true,
      lineWrapping : true,
      placeholder : 'Paste your text or drop a file from your computer here. No data on hand? Try one of our sample datasets!'
    }

    $scope.selectChart = function(chart){
      if (chart == $scope.chart) return;
      $scope.model.clear();
      $scope.chart = chart;
      $scope.model = $scope.chart.model();
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
          mappingTop = $('#mapping').offset().top + 10,
          mappingHeight = $('#mapping').height(),
          isBetween = scrollTop > mappingTop + 50 && scrollTop <= mappingTop + mappingHeight - $(".sticky").height() - 20,
          isOver = scrollTop > mappingTop + mappingHeight - $(".sticky").height() - 20,
          mappingWidth = mappingWidth ? mappingWidth : $('.mapping').width();

      if (mappingHeight-$('.dimensions-list').height() > 90) return;
      //console.log(mappingHeight-$('.dimensions-list').height())
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

      $scope.sortCategory = function (chart) {
        return chart.category();
      };

    $(document).ready(refreshScroll);


  })
