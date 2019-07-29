(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('d3-selection'), require('d3-format'), require('d3-dispatch'), require('d3-scale'), require('d3-array')) :
	typeof define === 'function' && define.amd ? define(['exports', 'd3-selection', 'd3-format', 'd3-dispatch', 'd3-scale', 'd3-array'], factory) :
	(factory((global.indexRollup = global.indexRollup || {}),global.d3Selection,global.d3Format,global.d3Dispatch,global.d3Scale,global.d3Array));
}(this, (function (exports,d3Selection,d3Format,d3Dispatch,d3Scale,d3Array) { 'use strict';

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) {
  return typeof obj;
} : function (obj) {
  return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
};

var d3_identity = function d3_identity(d) {
  return d;
};

var d3_reverse = function d3_reverse(arr) {
  var mirror = [];
  for (var i = 0, l = arr.length; i < l; i++) {
    mirror[i] = arr[l - i - 1];
  }
  return mirror;
};

//Text wrapping code adapted from Mike Bostock
var d3_textWrapping = function d3_textWrapping(text, width) {
  text.each(function () {
    var text = d3Selection.select(this),
        words = text.text().split(/\s+/).reverse(),
        word,
        line = [],
        lineNumber = 0,
        lineHeight = 1.2,
        //ems
    y = text.attr("y"),
        dy = parseFloat(text.attr("dy")) || 0,
        tspan = text.text(null).append("tspan").attr("x", 0).attr("dy", dy + "em");

    while (word = words.pop()) {
      line.push(word);
      tspan.text(line.join(" "));
      if (tspan.node().getComputedTextLength() > width && line.length > 1) {
        line.pop();
        tspan.text(line.join(" "));
        line = [word];
        tspan = text.append("tspan").attr("x", 0).attr("dy", lineHeight + dy + "em").text(word);
      }
    }
  });
};

var d3_mergeLabels = function d3_mergeLabels() {
  var gen = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];
  var labels = arguments[1];
  var domain = arguments[2];
  var range = arguments[3];
  var labelDelimiter = arguments[4];

  if ((typeof labels === "undefined" ? "undefined" : _typeof(labels)) === "object") {
    if (labels.length === 0) return gen;

    var i = labels.length;
    for (; i < gen.length; i++) {
      labels.push(gen[i]);
    }
    return labels;
  } else if (typeof labels === "function") {
    var customLabels = [];
    var genLength = gen.length;
    for (var _i = 0; _i < genLength; _i++) {
      customLabels.push(labels({
        i: _i,
        genLength: genLength,
        generatedLabels: gen,
        domain: domain,
        range: range,
        labelDelimiter: labelDelimiter
      }));
    }
    return customLabels;
  }

  return gen;
};

var d3_linearLegend = function d3_linearLegend(scale, cells, labelFormat) {
  var data = [];

  if (cells.length > 1) {
    data = cells;
  } else {
    var domain = scale.domain(),
        increment = (domain[domain.length - 1] - domain[0]) / (cells - 1);
    var i = 0;

    for (; i < cells; i++) {
      data.push(domain[0] + i * increment);
    }
  }

  var labels = data.map(labelFormat);
  return {
    data: data,
    labels: labels,
    feature: function feature(d) {
      return scale(d);
    }
  };
};

var d3_quantLegend = function d3_quantLegend(scale, labelFormat, labelDelimiter) {
  var labels = scale.range().map(function (d) {
    var invert = scale.invertExtent(d);
    return labelFormat(invert[0]) + " " + labelDelimiter + " " + labelFormat(invert[1]);
  });

  return {
    data: scale.range(),
    labels: labels,
    feature: d3_identity
  };
};

var d3_ordinalLegend = function d3_ordinalLegend(scale) {
  return {
    data: scale.domain(),
    labels: scale.domain(),
    feature: function feature(d) {
      return scale(d);
    }
  };
};

var d3_cellOver = function d3_cellOver(cellDispatcher, d, obj) {
  cellDispatcher.call("cellover", obj, d);
};

var d3_cellOut = function d3_cellOut(cellDispatcher, d, obj) {
  cellDispatcher.call("cellout", obj, d);
};

var d3_cellClick = function d3_cellClick(cellDispatcher, d, obj) {
  cellDispatcher.call("cellclick", obj, d);
};

var helper = {
  d3_drawShapes: function d3_drawShapes(shape, shapes, shapeHeight, shapeWidth, shapeRadius, path) {
    if (shape === "rect") {
      shapes.attr("height", shapeHeight).attr("width", shapeWidth);
    } else if (shape === "circle") {
      shapes.attr("r", shapeRadius);
    } else if (shape === "line") {
      shapes.attr("x1", 0).attr("x2", shapeWidth).attr("y1", 0).attr("y2", 0);
    } else if (shape === "path") {
      shapes.attr("d", path);
    }
  },

  d3_addText: function d3_addText(svg, enter, labels, classPrefix, labelWidth) {
    enter.append("text").attr("class", classPrefix + "label");
    var text = svg.selectAll("g." + classPrefix + "cell text." + classPrefix + "label").data(labels).text(d3_identity);

    if (labelWidth) {
      svg.selectAll("g." + classPrefix + "cell text." + classPrefix + "label").call(d3_textWrapping, labelWidth);
    }

    return text;
  },

  d3_calcType: function d3_calcType(scale, ascending, cells, labels, labelFormat, labelDelimiter) {
    var type = scale.invertExtent ? d3_quantLegend(scale, labelFormat, labelDelimiter) : scale.ticks ? d3_linearLegend(scale, cells, labelFormat) : d3_ordinalLegend(scale);

    //for d3.scaleSequential that doesn't have a range function
    var range = scale.range && scale.range() || scale.domain();
    type.labels = d3_mergeLabels(type.labels, labels, scale.domain(), range, labelDelimiter);

    if (ascending) {
      type.labels = d3_reverse(type.labels);
      type.data = d3_reverse(type.data);
    }

    return type;
  },

  d3_filterCells: function d3_filterCells(type, cellFilter) {
    var filterCells = type.data.map(function (d, i) {
      return { data: d, label: type.labels[i] };
    }).filter(cellFilter);
    var dataValues = filterCells.map(function (d) {
      return d.data;
    });
    var labelValues = filterCells.map(function (d) {
      return d.label;
    });
    type.data = type.data.filter(function (d) {
      return dataValues.indexOf(d) !== -1;
    });
    type.labels = type.labels.filter(function (d) {
      return labelValues.indexOf(d) !== -1;
    });
    return type;
  },

  d3_placement: function d3_placement(orient, cell, cellTrans, text, textTrans, labelAlign) {
    cell.attr("transform", cellTrans);
    text.attr("transform", textTrans);
    if (orient === "horizontal") {
      text.style("text-anchor", labelAlign);
    }
  },

  d3_addEvents: function d3_addEvents(cells, dispatcher) {
    cells.on("mouseover.legend", function (d) {
      d3_cellOver(dispatcher, d, this);
    }).on("mouseout.legend", function (d) {
      d3_cellOut(dispatcher, d, this);
    }).on("click.legend", function (d) {
      d3_cellClick(dispatcher, d, this);
    });
  },

  d3_title: function d3_title(svg, title, classPrefix, titleWidth) {
    if (title !== "") {
      var titleText = svg.selectAll("text." + classPrefix + "legendTitle");

      titleText.data([title]).enter().append("text").attr("class", classPrefix + "legendTitle");

      svg.selectAll("text." + classPrefix + "legendTitle").text(title);

      if (titleWidth) {
        svg.selectAll("text." + classPrefix + "legendTitle").call(d3_textWrapping, titleWidth);
      }

      var cellsSvg = svg.select("." + classPrefix + "legendCells");
      var yOffset = svg.select("." + classPrefix + "legendTitle").nodes().map(function (d) {
        return d.getBBox().height;
      })[0],
          xOffset = -cellsSvg.nodes().map(function (d) {
        return d.getBBox().x;
      })[0];
      cellsSvg.attr("transform", "translate(" + xOffset + "," + yOffset + ")");
    }
  },

  d3_defaultLocale: {
    format: d3Format.format,
    formatPrefix: d3Format.formatPrefix
  },

  d3_defaultFormatSpecifier: ".01f",

  d3_defaultDelimiter: "to"
};

function color() {
  var scale = d3Scale.scaleLinear(),
      shape = "rect",
      shapeWidth = 15,
      shapeHeight = 15,
      shapeRadius = 10,
      shapePadding = 2,
      cells = [5],
      cellFilter = void 0,
      labels = [],
      classPrefix = "",
      useClass = false,
      title = "",
      locale = helper.d3_defaultLocale,
      specifier = helper.d3_defaultFormatSpecifier,
      labelOffset = 10,
      labelAlign = "middle",
      labelDelimiter = helper.d3_defaultDelimiter,
      labelWrap = void 0,
      orient = "vertical",
      ascending = false,
      path = void 0,
      titleWidth = void 0,
      legendDispatcher = d3Dispatch.dispatch("cellover", "cellout", "cellclick");

  function legend(svg) {
    var type = helper.d3_calcType(scale, ascending, cells, labels, locale.format(specifier), labelDelimiter),
        legendG = svg.selectAll("g").data([scale]);

    legendG.enter().append("g").attr("class", classPrefix + "legendCells");

    if (cellFilter) {
      helper.d3_filterCells(type, cellFilter);
    }

    var cell = svg.select("." + classPrefix + "legendCells").selectAll("." + classPrefix + "cell").data(type.data);

    var cellEnter = cell.enter().append("g").attr("class", classPrefix + "cell");
    cellEnter.append(shape).attr("class", classPrefix + "swatch");

    var shapes = svg.selectAll("g." + classPrefix + "cell " + shape + "." + classPrefix + "swatch").data(type.data);

    //add event handlers
    helper.d3_addEvents(cellEnter, legendDispatcher);

    cell.exit().transition().style("opacity", 0).remove();
    shapes.exit().transition().style("opacity", 0).remove();

    shapes = shapes.merge(shapes);

    helper.d3_drawShapes(shape, shapes, shapeHeight, shapeWidth, shapeRadius, path);
    var text = helper.d3_addText(svg, cellEnter, type.labels, classPrefix, labelWrap);

    // we need to merge the selection, otherwise changes in the legend (e.g. change of orientation) are applied only to the new cells and not the existing ones.
    cell = cellEnter.merge(cell);

    // sets placement
    var textSize = text.nodes().map(function (d) {
      return d.getBBox();
    }),
        shapeSize = shapes.nodes().map(function (d) {
      return d.getBBox();
    });
    //sets scale
    //everything is fill except for line which is stroke,
    if (!useClass) {
      if (shape == "line") {
        shapes.style("stroke", type.feature);
      } else {
        shapes.style("fill", type.feature);
      }
    } else {
      shapes.attr("class", function (d) {
        return classPrefix + "swatch " + type.feature(d);
      });
    }

    var cellTrans = void 0,
        textTrans = void 0,
        textAlign = labelAlign == "start" ? 0 : labelAlign == "middle" ? 0.5 : 1;

    //positions cells and text
    if (orient === "vertical") {
      (function () {
        var cellSize = textSize.map(function (d, i) {
          return Math.max(d.height, shapeSize[i].height);
        });

        cellTrans = function cellTrans(d, i) {
          var height = d3Array.sum(cellSize.slice(0, i));
          return "translate(0, " + (height + i * shapePadding) + ")";
        };

        textTrans = function textTrans(d, i) {
          return "translate( " + (shapeSize[i].width + shapeSize[i].x + labelOffset) + ", " + (shapeSize[i].y + shapeSize[i].height / 2 + 5) + ")";
        };
      })();
    } else if (orient === "horizontal") {
      cellTrans = function cellTrans(d, i) {
        return "translate(" + i * (shapeSize[i].width + shapePadding) + ",0)";
      };
      textTrans = function textTrans(d, i) {
        return "translate(" + (shapeSize[i].width * textAlign + shapeSize[i].x) + ",\n          " + (shapeSize[i].height + shapeSize[i].y + labelOffset + 8) + ")";
      };
    }

    helper.d3_placement(orient, cell, cellTrans, text, textTrans, labelAlign);
    helper.d3_title(svg, title, classPrefix, titleWidth);

    cell.transition().style("opacity", 1);
  }

  legend.scale = function (_) {
    if (!arguments.length) return scale;
    scale = _;
    return legend;
  };

  legend.cells = function (_) {
    if (!arguments.length) return cells;
    if (_.length > 1 || _ >= 2) {
      cells = _;
    }
    return legend;
  };

  legend.cellFilter = function (_) {
    if (!arguments.length) return cellFilter;
    cellFilter = _;
    return legend;
  };

  legend.shape = function (_, d) {
    if (!arguments.length) return shape;
    if (_ == "rect" || _ == "circle" || _ == "line" || _ == "path" && typeof d === "string") {
      shape = _;
      path = d;
    }
    return legend;
  };

  legend.shapeWidth = function (_) {
    if (!arguments.length) return shapeWidth;
    shapeWidth = +_;
    return legend;
  };

  legend.shapeHeight = function (_) {
    if (!arguments.length) return shapeHeight;
    shapeHeight = +_;
    return legend;
  };

  legend.shapeRadius = function (_) {
    if (!arguments.length) return shapeRadius;
    shapeRadius = +_;
    return legend;
  };

  legend.shapePadding = function (_) {
    if (!arguments.length) return shapePadding;
    shapePadding = +_;
    return legend;
  };

  legend.labels = function (_) {
    if (!arguments.length) return labels;
    labels = _;
    return legend;
  };

  legend.labelAlign = function (_) {
    if (!arguments.length) return labelAlign;
    if (_ == "start" || _ == "end" || _ == "middle") {
      labelAlign = _;
    }
    return legend;
  };

  legend.locale = function (_) {
    if (!arguments.length) return locale;
    locale = d3Format.formatLocale(_);
    return legend;
  };

  legend.labelFormat = function (_) {
    if (!arguments.length) return legend.locale().format(specifier);
    specifier = d3Format.formatSpecifier(_);
    return legend;
  };

  legend.labelOffset = function (_) {
    if (!arguments.length) return labelOffset;
    labelOffset = +_;
    return legend;
  };

  legend.labelDelimiter = function (_) {
    if (!arguments.length) return labelDelimiter;
    labelDelimiter = _;
    return legend;
  };

  legend.labelWrap = function (_) {
    if (!arguments.length) return labelWrap;
    labelWrap = _;
    return legend;
  };

  legend.useClass = function (_) {
    if (!arguments.length) return useClass;
    if (_ === true || _ === false) {
      useClass = _;
    }
    return legend;
  };

  legend.orient = function (_) {
    if (!arguments.length) return orient;
    _ = _.toLowerCase();
    if (_ == "horizontal" || _ == "vertical") {
      orient = _;
    }
    return legend;
  };

  legend.ascending = function (_) {
    if (!arguments.length) return ascending;
    ascending = !!_;
    return legend;
  };

  legend.classPrefix = function (_) {
    if (!arguments.length) return classPrefix;
    classPrefix = _;
    return legend;
  };

  legend.title = function (_) {
    if (!arguments.length) return title;
    title = _;
    return legend;
  };

  legend.titleWidth = function (_) {
    if (!arguments.length) return titleWidth;
    titleWidth = _;
    return legend;
  };

  legend.textWrap = function (_) {
    if (!arguments.length) return textWrap;
    textWrap = _;
    return legend;
  };

  legend.on = function () {
    var value = legendDispatcher.on.apply(legendDispatcher, arguments);
    return value === legendDispatcher ? legend : value;
  };

  return legend;
}

function size() {
  var scale = d3Scale.scaleLinear(),
      shape = "rect",
      shapeWidth = 15,
      shapePadding = 2,
      cells = [5],
      cellFilter = void 0,
      labels = [],
      classPrefix = "",
      title = "",
      locale = helper.d3_defaultLocale,
      specifier = helper.d3_defaultFormatSpecifier,
      labelOffset = 10,
      labelAlign = "middle",
      labelDelimiter = helper.d3_defaultDelimiter,
      labelWrap = void 0,
      orient = "vertical",
      ascending = false,
      path = void 0,
      titleWidth = void 0,
      legendDispatcher = d3Dispatch.dispatch("cellover", "cellout", "cellclick");

  function legend(svg) {
    var type = helper.d3_calcType(scale, ascending, cells, labels, locale.format(specifier), labelDelimiter),
        legendG = svg.selectAll("g").data([scale]);

    if (cellFilter) {
      helper.d3_filterCells(type, cellFilter);
    }

    legendG.enter().append("g").attr("class", classPrefix + "legendCells");

    var cell = svg.select("." + classPrefix + "legendCells").selectAll("." + classPrefix + "cell").data(type.data);
    var cellEnter = cell.enter().append("g").attr("class", classPrefix + "cell");
    cellEnter.append(shape).attr("class", classPrefix + "swatch");

    var shapes = svg.selectAll("g." + classPrefix + "cell " + shape + "." + classPrefix + "swatch");

    //add event handlers
    helper.d3_addEvents(cellEnter, legendDispatcher);

    cell.exit().transition().style("opacity", 0).remove();

    shapes.exit().transition().style("opacity", 0).remove();
    shapes = shapes.merge(shapes);

    //creates shape
    if (shape === "line") {
      helper.d3_drawShapes(shape, shapes, 0, shapeWidth);
      shapes.attr("stroke-width", type.feature);
    } else {
      helper.d3_drawShapes(shape, shapes, type.feature, type.feature, type.feature, path);
    }

    var text = helper.d3_addText(svg, cellEnter, type.labels, classPrefix, labelWrap);

    // we need to merge the selection, otherwise changes in the legend (e.g. change of orientation) are applied only to the new cells and not the existing ones.
    cell = cellEnter.merge(cell);

    //sets placement

    var textSize = text.nodes().map(function (d) {
      return d.getBBox();
    }),
        shapeSize = shapes.nodes().map(function (d, i) {
      var bbox = d.getBBox();
      var stroke = scale(type.data[i]);

      if (shape === "line" && orient === "horizontal") {
        bbox.height = bbox.height + stroke;
      } else if (shape === "line" && orient === "vertical") {
        bbox.width = bbox.width;
      }
      return bbox;
    });

    var maxH = d3Array.max(shapeSize, function (d) {
      return d.height + d.y;
    }),
        maxW = d3Array.max(shapeSize, function (d) {
      return d.width + d.x;
    });

    var cellTrans = void 0,
        textTrans = void 0,
        textAlign = labelAlign == "start" ? 0 : labelAlign == "middle" ? 0.5 : 1;

    //positions cells and text
    if (orient === "vertical") {
      (function () {
        var cellSize = textSize.map(function (d, i) {
          return Math.max(d.height, shapeSize[i].height);
        });
        var y = shape == "circle" || shape == "line" ? shapeSize[0].height / 2 : 0;
        cellTrans = function cellTrans(d, i) {
          var height = d3Array.sum(cellSize.slice(0, i));

          return "translate(0, " + (y + height + i * shapePadding) + ")";
        };

        textTrans = function textTrans(d, i) {
          return "translate( " + (maxW + labelOffset) + ",\n          " + (shapeSize[i].y + shapeSize[i].height / 2 + 5) + ")";
        };
      })();
    } else if (orient === "horizontal") {
      (function () {
        cellTrans = function cellTrans(d, i) {
          var width = d3Array.sum(shapeSize.slice(0, i), function (d) {
            return d.width;
          });
          var y = shape == "circle" || shape == "line" ? maxH / 2 : 0;
          return "translate(" + (width + i * shapePadding) + ", " + y + ")";
        };

        var offset = shape == "line" ? maxH / 2 : maxH;
        textTrans = function textTrans(d, i) {
          return "translate( " + (shapeSize[i].width * textAlign + shapeSize[i].x) + ",\n              " + (offset + labelOffset) + ")";
        };
      })();
    }

    helper.d3_placement(orient, cell, cellTrans, text, textTrans, labelAlign);
    helper.d3_title(svg, title, classPrefix, titleWidth);

    cell.transition().style("opacity", 1);
  }

  legend.scale = function (_) {
    if (!arguments.length) return scale;
    scale = _;
    return legend;
  };

  legend.cells = function (_) {
    if (!arguments.length) return cells;
    if (_.length > 1 || _ >= 2) {
      cells = _;
    }
    return legend;
  };

  legend.cellFilter = function (_) {
    if (!arguments.length) return cellFilter;
    cellFilter = _;
    return legend;
  };

  legend.shape = function (_, d) {
    if (!arguments.length) return shape;
    if (_ == "rect" || _ == "circle" || _ == "line") {
      shape = _;
      path = d;
    }
    return legend;
  };

  legend.shapeWidth = function (_) {
    if (!arguments.length) return shapeWidth;
    shapeWidth = +_;
    return legend;
  };

  legend.shapePadding = function (_) {
    if (!arguments.length) return shapePadding;
    shapePadding = +_;
    return legend;
  };

  legend.labels = function (_) {
    if (!arguments.length) return labels;
    labels = _;
    return legend;
  };

  legend.labelAlign = function (_) {
    if (!arguments.length) return labelAlign;
    if (_ == "start" || _ == "end" || _ == "middle") {
      labelAlign = _;
    }
    return legend;
  };

  legend.locale = function (_) {
    if (!arguments.length) return locale;
    locale = d3Format.formatLocale(_);
    return legend;
  };

  legend.labelFormat = function (_) {
    if (!arguments.length) return legend.locale().format(specifier);
    specifier = d3Format.formatSpecifier(_);
    return legend;
  };

  legend.labelOffset = function (_) {
    if (!arguments.length) return labelOffset;
    labelOffset = +_;
    return legend;
  };

  legend.labelDelimiter = function (_) {
    if (!arguments.length) return labelDelimiter;
    labelDelimiter = _;
    return legend;
  };

  legend.labelWrap = function (_) {
    if (!arguments.length) return labelWrap;
    labelWrap = _;
    return legend;
  };

  legend.orient = function (_) {
    if (!arguments.length) return orient;
    _ = _.toLowerCase();
    if (_ == "horizontal" || _ == "vertical") {
      orient = _;
    }
    return legend;
  };

  legend.ascending = function (_) {
    if (!arguments.length) return ascending;
    ascending = !!_;
    return legend;
  };

  legend.classPrefix = function (_) {
    if (!arguments.length) return classPrefix;
    classPrefix = _;
    return legend;
  };

  legend.title = function (_) {
    if (!arguments.length) return title;
    title = _;
    return legend;
  };

  legend.titleWidth = function (_) {
    if (!arguments.length) return titleWidth;
    titleWidth = _;
    return legend;
  };

  legend.on = function () {
    var value = legendDispatcher.on.apply(legendDispatcher, arguments);
    return value === legendDispatcher ? legend : value;
  };

  return legend;
}

function symbol() {
  var scale = d3Scale.scaleLinear(),
      shape = "path",
      shapeWidth = 15,
      shapeHeight = 15,
      shapeRadius = 10,
      shapePadding = 5,
      cells = [5],
      cellFilter = void 0,
      labels = [],
      classPrefix = "",
      title = "",
      locale = helper.d3_defaultLocale,
      specifier = helper.d3_defaultFormatSpecifier,
      labelAlign = "middle",
      labelOffset = 10,
      labelDelimiter = helper.d3_defaultDelimiter,
      labelWrap = void 0,
      orient = "vertical",
      ascending = false,
      titleWidth = void 0,
      legendDispatcher = d3Dispatch.dispatch("cellover", "cellout", "cellclick");

  function legend(svg) {
    var type = helper.d3_calcType(scale, ascending, cells, labels, locale.format(specifier), labelDelimiter),
        legendG = svg.selectAll("g").data([scale]);

    if (cellFilter) {
      helper.d3_filterCells(type, cellFilter);
    }

    legendG.enter().append("g").attr("class", classPrefix + "legendCells");

    var cell = svg.select("." + classPrefix + "legendCells").selectAll("." + classPrefix + "cell").data(type.data);
    var cellEnter = cell.enter().append("g").attr("class", classPrefix + "cell");
    cellEnter.append(shape).attr("class", classPrefix + "swatch");

    var shapes = svg.selectAll("g." + classPrefix + "cell " + shape + "." + classPrefix + "swatch");

    //add event handlers
    helper.d3_addEvents(cellEnter, legendDispatcher);

    //remove old shapes
    cell.exit().transition().style("opacity", 0).remove();
    shapes.exit().transition().style("opacity", 0).remove();
    shapes = shapes.merge(shapes);

    helper.d3_drawShapes(shape, shapes, shapeHeight, shapeWidth, shapeRadius, type.feature);
    var text = helper.d3_addText(svg, cellEnter, type.labels, classPrefix, labelWrap);

    // we need to merge the selection, otherwise changes in the legend (e.g. change of orientation) are applied only to the new cells and not the existing ones.
    cell = cellEnter.merge(cell);

    // sets placement
    var textSize = text.nodes().map(function (d) {
      return d.getBBox();
    }),
        shapeSize = shapes.nodes().map(function (d) {
      return d.getBBox();
    });

    var maxH = d3Array.max(shapeSize, function (d) {
      return d.height;
    }),
        maxW = d3Array.max(shapeSize, function (d) {
      return d.width;
    });

    var cellTrans = void 0,
        textTrans = void 0,
        textAlign = labelAlign == "start" ? 0 : labelAlign == "middle" ? 0.5 : 1;

    //positions cells and text
    if (orient === "vertical") {
      (function () {
        var cellSize = textSize.map(function (d, i) {
          return Math.max(maxH, d.height);
        });

        cellTrans = function cellTrans(d, i) {
          var height = d3Array.sum(cellSize.slice(0, i));
          return "translate(0, " + (height + i * shapePadding) + " )";
        };
        textTrans = function textTrans(d, i) {
          return "translate( " + (maxW + labelOffset) + ",\n              " + (shapeSize[i].y + shapeSize[i].height / 2 + 5) + ")";
        };
      })();
    } else if (orient === "horizontal") {
      cellTrans = function cellTrans(d, i) {
        return "translate( " + i * (maxW + shapePadding) + ",0)";
      };
      textTrans = function textTrans(d, i) {
        return "translate( " + (shapeSize[i].width * textAlign + shapeSize[i].x) + ",\n              " + (maxH + labelOffset) + ")";
      };
    }

    helper.d3_placement(orient, cell, cellTrans, text, textTrans, labelAlign);
    helper.d3_title(svg, title, classPrefix, titleWidth);
    cell.transition().style("opacity", 1);
  }

  legend.scale = function (_) {
    if (!arguments.length) return scale;
    scale = _;
    return legend;
  };

  legend.cells = function (_) {
    if (!arguments.length) return cells;
    if (_.length > 1 || _ >= 2) {
      cells = _;
    }
    return legend;
  };

  legend.cellFilter = function (_) {
    if (!arguments.length) return cellFilter;
    cellFilter = _;
    return legend;
  };

  legend.shapePadding = function (_) {
    if (!arguments.length) return shapePadding;
    shapePadding = +_;
    return legend;
  };

  legend.labels = function (_) {
    if (!arguments.length) return labels;
    labels = _;
    return legend;
  };

  legend.labelAlign = function (_) {
    if (!arguments.length) return labelAlign;
    if (_ == "start" || _ == "end" || _ == "middle") {
      labelAlign = _;
    }
    return legend;
  };

  legend.locale = function (_) {
    if (!arguments.length) return locale;
    locale = d3Format.formatLocale(_);
    return legend;
  };

  legend.labelFormat = function (_) {
    if (!arguments.length) return legend.locale().format(specifier);
    specifier = d3Format.formatSpecifier(_);
    return legend;
  };

  legend.labelOffset = function (_) {
    if (!arguments.length) return labelOffset;
    labelOffset = +_;
    return legend;
  };

  legend.labelDelimiter = function (_) {
    if (!arguments.length) return labelDelimiter;
    labelDelimiter = _;
    return legend;
  };

  legend.labelWrap = function (_) {
    if (!arguments.length) return labelWrap;
    labelWrap = _;
    return legend;
  };

  legend.orient = function (_) {
    if (!arguments.length) return orient;
    _ = _.toLowerCase();
    if (_ == "horizontal" || _ == "vertical") {
      orient = _;
    }
    return legend;
  };

  legend.ascending = function (_) {
    if (!arguments.length) return ascending;
    ascending = !!_;
    return legend;
  };

  legend.classPrefix = function (_) {
    if (!arguments.length) return classPrefix;
    classPrefix = _;
    return legend;
  };

  legend.title = function (_) {
    if (!arguments.length) return title;
    title = _;
    return legend;
  };

  legend.titleWidth = function (_) {
    if (!arguments.length) return titleWidth;
    titleWidth = _;
    return legend;
  };

  legend.on = function () {
    var value = legendDispatcher.on.apply(legendDispatcher, arguments);
    return value === legendDispatcher ? legend : value;
  };

  return legend;
}

var thresholdLabels = function thresholdLabels(_ref) {
  var i = _ref.i,
      genLength = _ref.genLength,
      generatedLabels = _ref.generatedLabels,
      labelDelimiter = _ref.labelDelimiter;

  if (i === 0) {
    var values = generatedLabels[i].split(" " + labelDelimiter + " ");
    return "Less than " + values[1];
  } else if (i === genLength - 1) {
    var _values = generatedLabels[i].split(" " + labelDelimiter + " ");
    return _values[0] + " or more";
  }
  return generatedLabels[i];
};

var legendHelpers = {
  thresholdLabels: thresholdLabels
};

var index = {
  legendColor: color,
  legendSize: size,
  legendSymbol: symbol,
  legendHelpers: legendHelpers
};

exports.legendColor = color;
exports.legendSize = size;
exports.legendSymbol = symbol;
exports.legendHelpers = legendHelpers;
exports['default'] = index;

Object.defineProperty(exports, '__esModule', { value: true });

})));
//# sourceMappingURL=indexRollup.js.map
