angular.module('rawApp')
  .directive('downloader', function () {
    return {
      restrict: 'E',
      replace:true,
      scope : {
        type : '@',
        source : '@',
        label : '@'
      },
      template :  '<div class="row-fluid">' +
                    '<p class="header">{{label}}</p>' +
                    '<form class="form-search">' +
                        '<input class="span12" placeholder="filename" type="text" maxlength="50">' +
                      '<button class="btn btn-block btn-success push-up" ng-click="download()">Download</button>' +
                    '</form>' +
                  '</div>',

      link: function postLink(scope, element, attrs) {

        scope.download = function(){
          if(!scope.type || !scope.source) return;

          if (scope.type == "svg") downloadSVG();
          if (scope.type == "png") downloadImage();
          if (scope.type == "json") downloadData();
        }

        /* Download SVG */
        var downloadSVG = function(){
         
          var html = d3.select(scope.source).select("svg")
            .attr("version", 1.1)
            .attr("xmlns", "http://www.w3.org/2000/svg")
            .node().parentNode.innerHTML;

          var blob = new Blob([html], { type: "data:image/svg+xml" });

          saveAs(blob, (element.find('input').value || element.find('input').attr("placeholder")) + ".svg")
        }

        /* Download Image */
        var downloadImage = function(){
          var content = d3.select("body").append("canvas")
              .attr("id", "canvas")
              .style("display","none")

          var html = d3.select(scope.source).select("svg")
              .node().parentNode.innerHTML;

          canvg('canvas',html);
          var canvas = document.getElementById("canvas");//, ctx = canvas.getContext("2d");
          canvas.toBlob(function(blob) {
              saveAs(blob, (element.find('input').value || element.find('input').attr("placeholder")) + ".png");
          }, "image/png");

          d3.select("#canvas").remove();
        }

        /* Download Data */
        var downloadData = function() {
          var json = JSON.stringify(scope.$eval(scope.source));
          var blob = new Blob([json], {type: "data:text/json;charset=utf-8"});
          saveAs(blob, (element.find('input').value || element.find('input').attr("placeholder")) + ".json")
        }

      }
    };
  });