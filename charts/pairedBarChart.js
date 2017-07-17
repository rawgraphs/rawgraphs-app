(function() {

  // A Paired Bar Chart

  var model = raw.model();

  // Common categories dimension. Each category will define
  // one bar on the left and right bar charts.
  var categories = model.dimension()
    .title('Common Axis')
    .types(Number, String)
    .required(1)
  // Values dimension. It will define the size of the left bars
  var sizesLeft = model.dimension()
    .title('Left Bars')
    .types(Number)
  // Values dimension. It will define the size of the right bars
  var sizesRight = model.dimension()
    .title('Right Bars')
    .types(Number)

  var leftTitleString = "left title";
  var rightTitleString = "right title";

  // Colors dimension. It will define the color of the bars
  var colorsDimension = model.dimension()
    .title('Colors')
    .types(String);

  // Mapping function
  // For each record in the data returns the values
  // for the common axis, the size of the left bar and the size of the right bar
  // and the color of the bars.
  model.map(function(data) {

    leftTitleString = sizesLeft();
    rightTitleString = sizesRight();

    var results = d3.nest()
      .key(categories)
      .rollup(function(g) {
        var result = g.map(function(d) {
          return {
            category: categories(d),
            color: colorsDimension(d)
          }
        })[0];
        // If the size is defined, accumulate the sizes according to the grouping function,
	// otherwise count items
	var groupFunction = d3.sum;
	if (gFunction() == 'Min') {
	  groupFunction = d3.min;
	} else if (gFunction() == 'Max') {
	  groupFunction = d3.max;
	} else if (gFunction() == 'Avg') {
	  groupFunction = d3.mean;
	}
        result.sizeRight = sizesRight() != null ? groupFunction(g, function(d) {
            return +sizesRight(d)
        }) : g.length;
        result.sizeLeft = sizesLeft() != null ? groupFunction(g, function(d) {
            return +sizesLeft(d)
        }) : g.length;
        return result;
      })
      .entries(data);

    return results;
  })

  // The Chart
  var chart = raw.chart()
    .title("Paired Bar Chart")
    .description("A paired bar chart combines two bar chart to compare them along a common axis. Mostly known as pyramid chart for age-distributed data.")
    .thumbnail("imgs/pairedBarChart.png")
    .category('Other')
    .model(model);

  var width = chart.number()
    .title('Width')
    .defaultValue(800);

  var height = chart.number()
    .title('Height')
    .defaultValue(600);

  // Use the same scale for left and right bars. If not selected,
  // the left and right bar charts are scaled independently.
  var sameScale = chart.checkbox()
    .title("Use same scale")
    .defaultValue(false);

  // Determines the position of the common axis. Either in the middle
  // between left and right bars, or all the way on the left hand side.
  var commonAxisInMiddle = chart.checkbox()
    .title("Common axis in the middle")
    .defaultValue(false);

  // The horizontal space for the common axis. Can be adjusted to acommodate the
  // labels of the common axis ticks.
  var commonAxisSpace = chart.number()
    .title('Space for common axis')
    .defaultValue(50);

  // The values of the bars can be displayed directly next to the bars.
  var labelsForBars = chart.checkbox()
    .title("Show labels for bars")
    .defaultValue(false);

  // If bars are colored, a legend can be added to display the mapping from color to category.
  var addLegend = chart.checkbox()
    .title("Add Legend")
    .defaultValue(false);

  var nrDecimalPlaces = chart.number()
    .title('Number of decimal places for bar labels')
    .defaultValue(2);

  // The bars can be sorted, either according to the common axis or to the left or right bar sizes.
  var sorting = chart.list()
    .title("Sorting")
    .values(['None', 'Common Axis', 'Left Bars', 'Right Bars'])
    .defaultValue('None');

  // Sorting can be done either top-down or bottom-up.
  var sortingAscending = chart.checkbox()
    .title("Sort ascending")
    .defaultValue(false);

  // If the bars are colored by groups, sorting can be done within the colored group or globally.
  var sortingWithinGroups = chart.checkbox()
    .title("Sort within groups")
    .defaultValue(true);

  // If a category has multiple data rows, multiple values are combined by a grouping function.
  var gFunction = chart.list()
    .title("Grouping Function")
    .values(['Min', 'Avg', 'Max', 'Sum'])
    .defaultValue('Sum');

  // Padding between left and right charts
  var middlePaddingValue = chart.number()
    .title('Padding between left and right charts')
    .defaultValue(3);

  // Left padding (to show labels of common axis completely).
  var leftPadding = chart.number()
    .title('Left Padding')
    .defaultValue(0);

  // Right padding (sometimes needed to display labels for bars completely).
  var rightPadding = chart.number()
    .title('Right Padding')
    .defaultValue(0);

  // Padding between bars within the left and right bar charts.
  var xPadding = chart.number()
    .title('Padding between bars')
    .defaultValue(0.1);

  // Specifies how many ticks the left axis should have (a hint to d3)
  var nrTicksLeft = chart.number()
    .title('Number of Ticks Left (hint)')
    .defaultValue(10);

  // Specifies how many ticks the right axis should have (a hint to d3)
  var nrTicksRight = chart.number()
    .title('Number of Ticks Right (hint)')
    .defaultValue(10);

  // Chart colors
  var colors = chart.color()
    .title("Color scale");

  // Drawing function
  chart.draw(function(selection, data) {

    // Define margins
    var legendColorHeight = 18;
    var legendSpacing = 2;
    var legendRowHeight = legendColorHeight + legendSpacing;

    if (colors.domain().length > 2 && addLegend()) {
      var marginBottom = 20 + (colors.domain().length + 1) * legendRowHeight;
    } else {
      var marginBottom = 50;
    }

    var marginLeft = leftPadding() + 10;
    var middlePadding = middlePaddingValue();
    if (commonAxisInMiddle()) {
      middlePadding = middlePadding + commonAxisSpace() / 2;
    } else {
      marginLeft = marginLeft + commonAxisSpace();
    }
    var marginRight = rightPadding() + 10;

    // Find the max and min values to scale left and right bars accordingly
    maxValueRight = d3.max(data, function(d) {
      return d.values.sizeRight;
    });
    maxValueLeft = d3.max(data, function(d) {
      return d.values.sizeLeft;
    });
    minValueRight = d3.min(data, function(d) {
      return d.values.sizeRight;
    });
    minValueLeft = d3.min(data, function(d) {
      return d.values.sizeLeft;
    });

    // If minimum values are negative, add some 'slack' to axis such that the smallest bar
    // has non-zero size.
    if (minValueLeft < 0) {
      addToMinValueLeft = (maxValueLeft - minValueLeft) / 20;
      minValueLeft = minValueLeft - addToMinValueLeft;
    } else {
      minValueLeft = 0;
    }
    if (minValueRight < 0) {
      addToMinValueRight = (maxValueRight - minValueRight) / 20;
      minValueRight = minValueRight - addToMinValueRight;
    } else {
      minValueRight = 0;
    }

    if (sameScale()) {
      if (maxValueRight > maxValueLeft) {
        maxValueLeft = maxValueRight;
      } else {
        maxValueRight = maxValueLeft;
      }

      if (minValueRight < minValueLeft) {
        minValueLeft = minValueRight;
      } else {
        minValueRight = minValueLeft;
      }
    }

    var isSortingActivated = sorting() != 'None';
    var sortProperty;
    if (sorting() == 'Common Axis') {
      sortProperty = function(v) {
        return v.category;
      };
    } else if (sorting() == 'Left Bars') {
      sortProperty = function(v) {
        return v.sizeLeft;
      };
    } else if (sorting() == 'Right Bars') {
      sortProperty = function(v) {
        return v.sizeRight;
      };
    } else {
      sortProperty = function(v) {
        return v.category;
      };
    }

    // sort data
    if (isSortingActivated) {
      data.sort(function(a, b) {
        var aGroup = a.values.color;
        var bGroup = b.values.color;
        var aVal = sortProperty(a.values);
        var bVal = sortProperty(b.values);

        var diff = 0;
        if (aVal > bVal) {
          diff = 1;
        }
        if (aVal < bVal) {
          diff = -1;
        }
        if (sortingAscending()) {
          diff = -diff;
        }

        if (sortingWithinGroups()) {
          if (aGroup != bGroup) {
            if (aGroup < bGroup) {
              return -1;
            } else {
              return 1;
            }
          } else {
            return diff;
          }
        } else {
          return diff;
        }
      });
    }

    // Check consistency among categories and colors, save them all
    var allCategories = [];
    var allColors = [];

    var tmpCategories = data.map(function(val) {
      return val.values.category;
    })
    allCategories = allCategories.concat(tmpCategories);

    // Same for color
    var tmpColors = data.map(function(val) {
      return val.values.color;
    })
    allColors = allColors.concat(tmpColors);

    //keep uniques
    allCategories = allCategories.filter(function(item, pos) {
      return allCategories.indexOf(item) == pos;
    });
    allColors = d3.set(allColors).values();

    // svg size
    selection
      .attr("width", width())
      .attr("height", height())
      .attr("viewBox", "0 0 " + width() + " " + height());

    // Define barchart size
    var w = +width() - marginLeft - marginRight,
      h = +height() - marginBottom;

    // Define scales
    var commonScale = d3.scale.ordinal()
      .rangeBands([0, h], +xPadding(), 0);

    var rightScale = d3.scale.linear()
      .range([w / 2 + middlePadding + marginLeft, w + marginLeft]);

    var leftScale = d3.scale.linear()
      .range([marginLeft + w / 2 - middlePadding, marginLeft]);


    // Define color scale domain
    colors.domain(allColors);
    var hasNoGroupingColors = allColors.length == 1 && allColors[0] == "null";
    if (hasNoGroupingColors) {
      colors.domain(['left', 'right']);
    }

    // Define middle domain
    commonScale.domain(allCategories);
    // Define left and right domains
    if (sameScale()) {
      rightScale.domain([minValueRight, maxValueRight]);
      leftScale.domain([minValueLeft, maxValueLeft]);
    } else {
      rightScale.domain([minValueRight, maxValueRight]);
      leftScale.domain([minValueLeft, maxValueLeft]);
    }

    barchart = selection.append("g");

    var translate = "translate(" + commonAxisSpace() + ",0)"
    orient = 'left';
    if (commonAxisInMiddle()) {
      translate = "translate(" + (marginLeft + w / 2 - middlePadding + 5) + ",0)";
      orient = 'right';
    }

    // Draw common axis
    barchart.append("g")
      .attr("class", "y axis")
      .style("font-size", "10")
      .style("font-family", "Arial, Helvetica")
      .attr("transform", translate)
      .call(d3.svg.axis().scale(commonScale).orient(orient));

    if (commonAxisInMiddle()) {
      $('.y path, .y line').css('display', 'none');
    }

    // Draw the bars
    barchart.selectAll(".barRight")
      .data(data)
      .enter().append("rect")
      .attr("class", "bar")
      .attr("x", function(d) {
        return w / 2 + middlePadding + marginLeft;
      })
      .attr("width", function(d) {
        return rightScale(d.values.sizeRight) - w / 2 - middlePadding - marginLeft;
      })
      .attr("y", function(d) {
        return commonScale(d.values.category);
      })
      .attr("height", commonScale.rangeBand())
      .style("fill", function(d) {
        return colors()(d.values.color || "right");
      });

    barchart.selectAll(".barLeft")
      .data(data)
      .enter().append("rect")
      .attr("class", "barLeft")
      .attr("x", function(d) {
        return leftScale(d.values.sizeLeft);
      })
      .attr("width", function(d) {
        return w / 2 - middlePadding - leftScale(d.values.sizeLeft) + marginLeft;
      })
      .attr("y", function(d) {
        return commonScale(d.values.category);
      })
      .attr("height", commonScale.rangeBand())
      .style("fill", function(d) {
        return colors()(d.values.color || "left");
      });


    // Draw labels for bar values next to bars.
    if (labelsForBars()) {
      var labelFormat = d3.format(",." + nrDecimalPlaces() + "f");
      barchart.selectAll(".barLabelRight")
        .data(data)
        .enter().append("text")
        .attr("class", "barLabel")
        .attr("font-size", "10")
        .attr("x", function(d) {
          return rightScale(d.values.sizeRight) + 2;
        })
        .attr("y", function(d) {
          return commonScale(d.values.category) + commonScale.rangeBand() / 2 + 4;
        })
        .text(function(d) {
          return labelFormat(d.values.sizeRight);
        });

      barchart.selectAll(".barLabelLeft")
        .data(data)
        .enter().append("text")
        .attr("class", "barLabel")
        .attr("text-anchor", "end")
        .attr("font-size", "10")
        .attr("x", function(d) {
          return leftScale(d.values.sizeLeft) - 2;
        })
        .attr("y", function(d) {
          return commonScale(d.values.category) + commonScale.rangeBand() / 2 + 4;
        })
        .text(function(d) {
          return labelFormat(d.values.sizeLeft);
        });
    }

    // Draw right axis
    rightAxis = selection.append("g")
      .attr("class", "x axis")
      .style("font-size", "10")
      .style("font-family", "Arial, Helvetica")
      .attr("transform", "translate(" + "0" + "," + h + ")")
      .call(d3.svg.axis().scale(rightScale).orient("bottom").ticks(nrTicksRight()))

    // Draw left axis
    leftAxis = selection.append("g")
      .attr("class", "x axis")
      .style("font-size", "10")
      .style("font-family", "Arial, Helvetica")
      .attr("transform", "translate(" + "0" + "," + h + ")")
      .call(d3.svg.axis().scale(leftScale).orient("bottom").ticks(nrTicksLeft()))

    // Titles for left and right bar charts (taken from data column headers)
    var leftTitleX = leftAxis.node().getBBox().width / 2 + leftAxis.node().getBBox().x;
    leftTitle = selection.append("text")
      .attr("x", leftTitleX)
      .attr("y", +height() - marginBottom + 40)
      .style("font-size", "15")
      .style("font-family", "Arial, Helvetica")
      .style("text-anchor", "middle")
      .text(leftTitleString);

    var rightTitleX = rightAxis.node().getBBox().width / 2 + rightAxis.node().getBBox().x;
    rightTitle = selection.append("text")
      .attr("x", rightTitleX)
      .attr("y", +height() - marginBottom + 40)
      .style("font-size", "15")
      .style("font-family", "Arial, Helvetica")
      .style("text-anchor", "middle")
      .text(rightTitleString);

    // Set styles
    d3.selectAll(".axis line, .axis path")
      .style("shape-rendering", "crispEdges")
      .style("fill", "none")
      .style("stroke", "#ccc");

    // Add legend (if applicable)
    var hasGroupingColors = !hasNoGroupingColors;
    if (hasGroupingColors && addLegend()) {
      var textSpacing = 2*legendSpacing;

      var legend = barchart.selectAll('.legend')
        .data(colors.domain())
        .enter()
        .append('g')
        .attr('class', 'legend')
        .attr('transform', function(d, i) {
          var offset = legendRowHeight * (i+1);
          return 'translate(' + 10 + ',' + (height() - offset) + ')';
        });

      legend.append('rect')
        .attr('width', legendColorHeight)
        .attr('height', legendColorHeight)
        .style('fill', function(d) {
          return colors()(d)
        })
        .style('stroke', function(d) {
          return colors()(d)
        });
      legend.append('text')
        .attr('x', legendColorHeight + textSpacing)
        .attr('y', legendColorHeight - textSpacing)
        .text(function(d) {
          return d;
        });

    }


  });

})();
