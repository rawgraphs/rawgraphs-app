'use strict';

/* Controllers */

angular.module('raw.controllers', []).

  controller('rawCtrl', function ($scope, $http, dataService) {

    $scope.loading = false;
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
      $scope.loading = true;
      dataService.loadSample($scope.sample).then(
        function(data){
          $scope.text = data;
          $scope.loading = false;
        }, 
        function(error){
          $scope.error = error;
        }
      );
    })

    $scope.getBackground = function(chart) {
        return chart && chart.image? { 'background-image': 'url(' + chart.image + ')'  } : { 'background-image' : 'none' };
    }


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
            $scope.charts.forEach(function(c, ind){ c.id = ind; c.text = c.title; })
            $scope.chart = $scope.charts[0];
            $scope.$apply();
            $("#suca").select2("data", $scope.chart);
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

  $scope.dragging = {};

  $scope.myValueFunction = function(card) {
    return 0;
   //return card.values.opt1 + card.values.opt2;
  };


  // reset charts
  $scope.reset = function() {
    if (!$scope.charts) return;
    $scope.charts.forEach(function(chart){
      // TODO: create a reset method in models
      // reset model structure
      d3.values(chart.model.structure).forEach(function(d){ d.value = []; });
      // reset model map
      d3.values(chart.model.map).forEach(function(d){ d.value = []; });
    })
  }

  // general update
  $scope.update = function(){
  
    $('[data-spy="scroll"]').each(function () {
      $(this).scrollspy('refresh');
    });
  
  }

  // update the scroll when things change
  $scope.$watch("chart", $scope.update, true)
  $scope.$watch("text", $scope.update, true)

  // update charts when things change
  $scope.$watch("chart.title", $scope.reset, true)
  $scope.$watch("header", $scope.reset, true)

  $(window).scroll(function(){
    var scrollTop = $(window).scrollTop() + 0,
        mappingTop = $('#mapping').offset().top,
        mappingHeight = $('#mapping').height(),
        isBetween = scrollTop > mappingTop && scrollTop <= mappingTop+mappingHeight-$(".sticky").height()-70,
        isOver = scrollTop > mappingTop+mappingHeight,
        isSticky = false,
        mappingWidth = mappingWidth ? mappingWidth : $('#visualization').width();

    if (isBetween && !isSticky) {
      $(".sticky")
        .css("position","fixed")
        .css("width", mappingWidth+"px")
        .css("top","80px")
      return;
    } 

    $(".sticky")
      .css("position","relative")
      .css("top","0px")
      .css("width", "");
    isSticky = false;
  })

  $scope.select2Options = {
    minimumResultsForSearch: -1,    
    initSelection : function (element, callback) {
      var data = { id: element.val(), text: element.val() };
      callback(data);
    }
  };


  // listeners
  $(document).ready(function(){

    $scope.update();

    // create scroll links
    $("#header ul li a[href^='#']").on('click', function(e) {
      e.preventDefault();
      $('html, body').animate({ scrollTop: $(this.hash).offset().top - 70 }, 500, "easeOutCubic");
    });

    // toggle options
    $('.toggles').click(function() {
      $('a.toggles i').toggleClass('icon-chevron-left icon-chevron-right');
      $('#options').toggle(0, function() {
        $('#visualization').toggleClass('span12'),
        $('#visualization').toggleClass('span9')
      });
    });  

  });

});
