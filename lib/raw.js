/*!
 *  RAW 1.0.0
 *  http://raw.densitydesign.org
 *  Copyright 2013-2014 DensityDesign Lab, Giorgio Caviglia, Michele Mauri, Giorgio Uboldi, Matteo Azzi
 *
 *  Licensed under the LGPL License, Version 3.0
 *  You should have received a copy of the GNU Lesser General Public License
 *  along with this program. If not, see
 *
 *      http://www.gnu.org/licenses/lgpl-3.0.html
 *
 * This program is free software: you can redistribute it and/or modify it
 * under the terms of the GNU Lesser General Public License as published
 * by the Free Software Foundation, either version 3 of the License,
 * or (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty
 * of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.
 * See the GNU Lesser General Public License for more details.
 */

!function (exports){
	'use strict';

  var raw = {
    version : "1.0.0",
    models : d3.map(),
    charts : d3.map()
  };

  // Parsing

  raw.parser = function (delimiter) {

    // Insiperd by Ben Nadel's algorithm
    // http://www.bennadel.com/blog/1504-ask-ben-parsing-csv-strings-with-javascript-exec-regular-expression-command.htm
    function parser(string) {
      if (!string || string.length === 0) return [];

      var delimiter = parser.delimiter || detectDelimiter(string),
          rows = [[]],
          match, matches,
          data = [],
          re = new RegExp((
              "(\\" + delimiter + "|\\r?\\n|\\r|^)" +
              "(?:\"([^\"]*(?:\"\"[^\"]*)*)\"|" +
              "([^\"\\" + delimiter + "\\r\\n]*))"
            ),"gi"
          );

      while (matches = re.exec(string)){
        match = matches[2] ? matches[2].replace(new RegExp( "\"\"", "g" ), "\"" ) : matches[3];
        if (matches[1].length && matches[1] != delimiter ) rows.push([]);
        rows[rows.length - 1].push( match );
      }

      var header = rows[0];

      for (var i=1; i<rows.length; i++) {
        if (rows[i].length == 1 && rows[i][0].length == 0 && rows[i].length != header.length) continue;
        if(rows[i].length == header.length) {
          var obj = {};
          for (var h in header){
            obj[header[h]] = rows[i][h];
          }
          data.push(obj);
        } else {
          throw new ParseError(i);
          return false;
        }
      }
      return data;
    }

    function mode(array) {
      if(!arguments.length || array.length === 0) return null;
      var counter = {}, mode = array[0], max = 1;
      for(var i = 0; i < array.length; i++) {
        var el = array[i];
        if(counter[el] == null) counter[el] = 1;
        else counter[el]++;
        if(counter[el] > max) {
          mode = el;
          max = counter[el];
        }
      }
      return mode;
    }

    function sniff(objs) {
      var keys = {};
      d3.keys(objs[0]).forEach(function (d){ keys[d] = []; });
      objs.forEach(function(d){
        for(var key in keys) {
          var type = raw.typeOf(d[key]);
          if (type) keys[key].push(type);
        }
      })
      return keys;
    }

    function detectDelimiter(string){

      if (!arguments.length) return;

      var delimiters = [",",";","\t",":","|"],
          delimitersCount = delimiters.map(function (d){ return 0; }),
          header = string.split("\n")[0],
          character,
          quoted = false,
          firstChar = true;

      for (var i in header) {
        character = header[i];
        switch(character) {
          case '"':
            if (quoted) {
              if (header[i+1] != '"') quoted = false;
              else i++;
            }
            else if (firstChar) quoted = true;
            break;

          default:
            if (quoted) break;
            var index = delimiters.indexOf(character);
            if (index !== -1) {
              delimitersCount[index]++;
              firstChar = true;
              continue;
            }
            break;
        }
        if (firstChar) firstChar = false;
      }

      var maxCount = d3.max(delimitersCount);
      return maxCount == 0 ? '\0' : delimiters[delimitersCount.indexOf(maxCount)];
    }

    function ParseError(message) {
      this.name = "ParseError";
      this.message = message || "Sorry something went wrong while parsing your data.";
    }
    ParseError.prototype = new Error();
    ParseError.prototype.constructor = ParseError;

    parser.metadata = function(string){
      return d3.entries(sniff(parser(string))).map(function (d){
        return { key : d.key, type : mode(d.value) }
      })
    }

    parser.delimiter = delimiter;

    return parser;

  }

  // Models

  var model_dimension = function () {

    var title = "Untitled",
        description = null,
        types = [Number, String, Date],
        multiple = false,
        required = false,
        dispatch = d3.dispatch('change');

    var dimension = function(object) {
      if (!dimension.value.length) return null;
      if (!arguments.length) return dimension.value.map(function (d){return d.key;});
      return multiple
        ? dimension.value.map(function (d){ return accessor.call(dimension, object[d.key]); })
        : accessor.call(dimension, object[dimension.value[0].key]);
    };

    function accessor(d){
      return d;
    }

    dimension.accessor = function(_) {
      if (!arguments.length) return accessor;
      accessor = _;
      return dimension;
    }

    dimension.multiple = function(_) {
      if (!arguments.length) return multiple;
      multiple = _;
      return dimension;
    }

    dimension.required = function(_) {
      if (!arguments.length) return required;
      required = +_;
      return dimension;
    }

    dimension.title = function(_) {
      if (!arguments.length) return title;
      title = _ + "";
      return dimension;
    }

    dimension.description = function(_) {
      if (!arguments.length) return description;
      description = _ + "";
      return dimension;
    }

    dimension.types = function() {
      if (!arguments.length) return types;
      var i = -1, n = arguments.length;
      types = [];
      while (++i < n) types.push(arguments[i]);
      return dimension;
    }

    dimension.type = function() {
      if (!dimension.value[0] || !dimension.value[0].type) return;
      return multiple
        ? dimension.value.map(function (d){ return d.type })
        : dimension.value[0].type;
    }

    dimension.clear = function() {
      dimension.value = [];
    }

    dimension.value = [];

    return dimension;
  }


  raw.model = function () {

    var title = "Untitled",
        description = null,
        dimensions = d3.map();

    var model = function (data) {
      if (!data) return;
      return map.call(this, data);
    }

    function map(data) {
      return data;
    }

    model.title = function(_) {
      if (!arguments.length) return title;
      title = "" + _;
      return model;
    }

    model.description = function(_) {
      if (!arguments.length) return description;
      description = "" + _;
      return model;
    }

    model.map = function(_) {
      if (!arguments.length) return map;
      map = _;
      return model;
    }

    model.dimension = function(id) {
      var id = id || dimensions.values().length;
      var dimension = model_dimension();
      dimensions.set(id, dimension);
      return dimension;
    }

    model.dimensions = function() {
      return dimensions;
    }

    model.isValid = function() {
      return dimensions.values()
        .filter(function(d){ return d.required() > d.value.length; })
        .length == 0;
    }

    model.instruction = function() {
      return dimensions.values()
        .filter(function(d){ return d.required() > d.value.length; })
        .map(function(d){ var v = d.required() - d.value.length > 1 ? 'dimensions' : 'dimension'; return '<b>'+d.title() + "</b> requires at least " + (d.required() - d.value.length) + " more " + v;  })
        .join(". ")
    }

    model.clear = function() {
      dimensions.values().forEach(function (d){ d.clear()});
    }

    return model;

  }


  // Built-in models

  // Tree
  raw.models.set('tree', function(){

    var tree = raw.model();

    var hierarchy = tree.dimension('hierarchy')
       .title('Hierarchy')
       .description("This is a description of the hierarchy that illustrates what the dimension is for and other things.")
       .required(1)
       .multiple(true);

    var size = tree.dimension('size')
       .title('Size')
       .description("This is a description of the hierarchy that illustrates what the dimension is for and other things.")
       .accessor(function (d){ return +d; })
       .types(Number)

    var color = tree.dimension('color')
       .title('Color')

    var label = tree.dimension('label')
       .title('Label')
       .multiple(true)

    tree.map(function (data){
      var root = { children : [] };
      data.forEach(function (d){

        if (!hierarchy()) return root;


        var leaf = seek(root, hierarchy(d), hierarchy());
        if(leaf === false || !leaf) return;

        if (!leaf.size) leaf.size = 0;
        leaf.size += size() ? +size(d) : 1;

        //console.log(leaf, color(), color(d))
        leaf.color = color(d);
        leaf.label = label(d);

        delete leaf.children;
      });
      return root;
    })

    function seek(root, path, classes) {
      if (path.length < 1) return false;
      if (!root.children) root.children = [];
      var p = root.children.filter(function (d){ return d.name == path[0]; })[0];

      if (!p) {
        if( /\S/.test(path[0]) ) {
          p = { name: path[0], class:classes[0], children:[]};
          root.children.push(p);
        } else p = root;
      }
      if (path.length == 1) return p;
      else return seek(p, path.slice(1), classes.slice(1));
    }

    return tree;

  })

  // Points
  raw.models.set('points', function(){

    var points = raw.model();

    var x = points.dimension('x')
      .title("X Axis")
      .types(Number, Date)
      .accessor(function (d){ return this.type() == "Date" ? new Date(d) : +d; })
      .required(1)

    var y = points.dimension('y')
      .title("Y Axis")
      .types(Number, Date)
      .accessor(function (d){ return this.type() == "Date" ? new Date(d) : +d; })
      .required(1)

    var size = points.dimension('size')
      .title("Size")
      .types(Number)

    var color = points.dimension('color')
      .title("Color")

    var label = points.dimension('label')
      .title("Label")
      .multiple(true)

    points.map(function (data){
      return data.map(function (d){
        return {
          x : x(d),
          y : y(d),
          size : size() ? +size(d) : 1,
          color : color(d),
          label : label(d)
        }
      })
    })

    return points;

  })

  // Graph
  raw.models.set('graph', function(){

    var graph = raw.model();

    var steps = graph.dimension('steps')
      .title('Steps')
      .multiple(true)
      .required(2)

    var size = graph.dimension('size')
      .title('Size')
      .types(Number)
      .accessor(function (d){ return +d; })

    graph.map(function (data){

      var d = { nodes: [], links: [] }

      if (!steps() || steps().length < 2) return d;

      var n = [], l = [], si, ti;

      for (var i=0; i < steps().length-1; i++ ) {

        var sg = steps()[i]
        var tg = steps()[i+1]
        var relations = d3.nest()
          .key(function (d) { return d[sg] } )
          .key(function (d) { return d[tg] } )
          .entries(data)

        relations.forEach(function (s){
          si = getNodeIndex(n, s.key, sg);

          if ( si == -1) {
            n.push({ name : s.key, group : sg })
            si = n.length-1;
          }

          s.values.forEach(function (t){
            ti = getNodeIndex(n, t.key, tg)
            if (ti == -1) {
              n.push({ name : t.key, group : tg })
              ti = n.length-1;
            }
            var value = size() ? d3.sum(t.values, function (d){ return +size(d); }) : t.values.length;
            var link = { source : n[si], target : n[ti], value : value };
            l.push(link);
          })

        })
      }
      d.nodes = n.sort(customSort);
      l.forEach(function (d){ d.source = n.indexOf(d.source); d.target = n.indexOf(d.target)});
      d.links = l;
      return d;

    })

    function customSort(a, b) {
      var Item1 = a.group;
      var Item2 = b.group;
      if(Item1 != Item2){
          return (Item1.localeCompare(Item2));
      }
      else{
          return (a.name.localeCompare(b.name));
      }
    }

    function sortByGroup(a,b){
      if(a.group < b.group) return -1;
      if(a.group > b.group) return 1;
      return 0;
    }

    function getNodeIndex(array, name, group) {
      for (var i in array){
        var a = array[i]
        if (a['name'] == name && a['group'] == group) {
          return i;
        }
      }
      return -1;
    }

    return graph;

  })

  // Identity
  raw.models.set('identity', function(){
    return raw.model();
  })

  raw.models.tree = raw.models.get('tree');
  raw.models.points = raw.models.get('points');
  raw.models.graph = raw.models.get('graph');
  raw.models.identity = raw.models.get('identity');


  // Charts

  // Generic abstarct option
  var chart_option = function () {

    var title = 'Untitled',
        description, defaultValue;

    var option = function(){
      return option.value;
    }

    option.title = function(_) {
      if (!arguments.length) return title;
      title = _ + "";
      return option;
    }

    option.defaultValue = function(_) {
      if (!arguments.length) return defaultValue;
      option.value = defaultValue = _;
      return option;
    }

    option.description = function(_) {
      if (!arguments.length) return description;
      description = _ + "";
      return option;
    }

    option.reset = function() {
      option.value = defaultValue;
    }

    option.value = defaultValue;

    return option;
  }

  // Number option
  var chart_option_number = function() {

    var option = chart_option(),
        type = 'number',
        fitToWidth = false;

    option.fitToWidth = function(_){
      if (!arguments.length) return fitToWidth;
      fitToWidth = +_;
      return option;
    }

    option.type = function() {
      return type;
    }


    return option;
  }

  // List option
  var chart_option_list = function() {

    var option = chart_option(),
        type ='list',
        values = [];

    option.values = function(_){
      if (!arguments.length) return values;
      values = _;
      return option;
    }

    option.type = function() {
      return type;
    }

    return option;
  }

  // Checkbox option
  var chart_option_checkbox = function() {
    var option = chart_option(),
        type = 'checkbox';

    option.type = function() {
      return type;
    }

    return option;
  }

  // Color option
  var chart_option_color = function() {
    var option = chart_option(),
        type = 'color',
        domain = [],
        dispatch = d3.dispatch('change');

    option.domain = function(array, f){
      if (!arguments.length) return domain;
      if (arguments.length === 1) {
        domain = array;
      } else {
        domain = array.map(f);
      }
      dispatch.change(domain);
      return option;
    }

    option.type = function() {
      return type;
    }

    d3.rebind(option, dispatch, "on");

    return option;
  }

  raw.chart = function (id) {

    var id = id || raw.charts.values().length,
        title = "Untitled",
        description = null,
        category = null,
        thumbnail = "",
				isDrawing = false,
        options = d3.map(),
				dispatch = d3.dispatch('endDrawing', 'startDrawing');

    var chart = function (selection) {
      selection.each(function (data){
        draw.call(this, selection, model(data));
      })
    }

    function model(data){
      return data;
    }

    function draw(selection, data) {
      return;
    }

    chart.title = function(_) {
      if (!arguments.length) return title;
      title = _.toString();
      return chart;
    }

    chart.description = function(_) {
      if (!arguments.length) return description;
      description = _.toString();
      return chart;
    }

    chart.category = function(_) {
      if (!arguments.length) return category;
      category = _.toString();
      return chart;
    }

    chart.thumbnail = function(_) {
      if (!arguments.length) return thumbnail;
      thumbnail = _.toString();
      return chart;
    }

    chart.model = function(_) {
      if (!arguments.length) return model;
      model = _;
      return chart;
    }

    chart.draw = function(_) {
      if (!arguments.length) return draw;
      draw = _;
      return chart;
    }

    // Options

    chart.number = function(id){
      var id = id || options.size();
      var option = chart_option_number();
      options.set(id, option);
      return option;
    }

    chart.list = function(id){
      var id = id || options.size();
      var option = chart_option_list();
      options.set(id, option);
      return option;
    }

    chart.checkbox = function(id){
      var id = id || options.size();
      var option = chart_option_checkbox();
      options.set(id, option);
      return option;
    }

    chart.color = function(id){
      var id = id || options.size();
      var option = chart_option_color();
      options.set(id, option);
      return option;
    }

    chart.options = function() {
      return options.values();
    }

    chart.clear = function() {
      options.values().clear();
    }

		chart.isDrawing = function(_) {
			if (!arguments.length) return isDrawing;
			isDrawing = _;
			return chart;
		}

		chart.dispatchStartDrawing = function() {
			dispatch.startDrawing();
		}

		chart.dispatchEndDrawing = function() {
			dispatch.endDrawing();
		}

		d3.rebind(chart, dispatch, "on");

    raw.charts.set(id, chart);

    return chart;

  }

  // Utils

  //
  raw.getMaxWidth = function(array, accessor) {
    var accessor = accessor || function (d){ return d; },
        array = array.map(accessor),
        widths = [];

    var svg = d3.select('body')
      .append('svg')

    var texts = svg.selectAll('text')
      .data(array)
      .enter().append('text')
      .style("font-size","11px")
      .style("font-family","Arial, Helvetica")
      .text(String)

    texts.each(function(){ widths.push(this.getBBox().width); });
    svg.remove();
    return d3.max(widths);

  }

  var timeFormat = '([\\sT]?(0?[0-9]|1[0-9]|2[0-4])\:(0?[1-9]|[012345][0-9])(\\:(0?[1-9]|[012345][0-9])(\\.[0-9]{1,3})?)?((\\s*[\\+\\-](0?[0-9]|1[0-9]|2[0-4])(\\:)?(0?[1-9]|[012345][0-9]))|(\\s*[A-z]{1,3}))*?)?';

  raw.dateFormats = [
    new RegExp('^([\\+-]?\\d{4}(?!\\d{2}\\b))((-?)((0[1-9]|1[0-2])(\\3([12]\\d|0[1-9]|3[01]))?|W([0-4]\\d|5[0-2])(-?[1-7])?|(00[1-9]|0[1-9]\\d|[12]\\d{2}|3([0-5]\\d|6[1-6])))([T\\s]((([01]\\d|2[0-3])((:?)[0-5]\\d)?|24\\:?00)([\\.,]\\d+(?!:))?)?(\\17[0-5]\\d([\.,]\\d+)?)?([zZ]|([\\+-])([01]\\d|2[0-3]):?([0-5]\\d)?)?)?)?$'),
    new RegExp('^(0?[1-9]|1[012])[\\-\\_\\.\\/\\s]+(0?[1-9]|[12][0-9]|3[01])[\\-\\_\\.\\/\\s]+([0-9]{2,4})' + timeFormat + '$'),
//  new RegExp('^([0-9]{2,4})[\\-\\_\\.\\/\\s]+(0?[1-9]|1[012])[\\-\\_\\.\\/\\s]+(0?[1-9]|[12][0-9]|3[01])' + timeFormat + '$'),
//  new RegExp('^([0-9]{2,4})[\\-\\_\\.\\/\\s]+(0?[1-9]|1[012])[\\-\\_\\.\\/\\s]*(0?[1-9]|[12][0-9]|3[01])?$'),
    new RegExp('^[A-z]{3,}(\\,)?[\\-\\_\\.\\/\\s]*([A-z]{3,}(\\,)?[\\-\\_\\.\\/\\s]+)?(0?[1-9]|[12][0-9]|3[01])([A-z]{2})?(\\,)?[\\-\\_\\.\\/\\s]*([0-9]{2,4})' + timeFormat + '$'),
    new RegExp('^([A-z]{3,}(\\,)?[\\-\\_\\.\\/\\s]*)?((0?[1-9]|[12][0-9]|3[01])([A-z]{2})?(\\,)?[\\-\\_\\.\\/\\s]*)?[A-z]{3,}(\\,)?[\\-\\_\\.\\/\\s]*([0-9]{2,4})' + timeFormat + '$'),
//  new RegExp('^([A-z]{3,}(\\,)?\\s+)?(0?[1-9]|[12][0-9]|3[01])([A-z]{2})?[\\-\\_\\.\\/\\s]*(0?[1-9]|1[012])[\\-\\_\\.\\/\\s]*([0-9]{2,4})' + timeFormat + '$'),
    new RegExp('^[A-z]{3,}(\\,)?\\s+([A-z]{3,}(\\,)?\\s+)?(0?[1-9]|[12][0-9]|3[01])?\\s*' + timeFormat + '\\s+([0-9]{2,4})$')
  ]

  raw.isString = function(value){
    return typeof value == 'string';
  }

  raw.isNumber = function(value) {
    return !isNaN(value);
  }

  raw.isDate = function(value){
    var isDate = false;
    for (var format in raw.dateFormats){
      if (value.trim().match(raw.dateFormats[format])) {
				isDate = !isNaN(Date.parse(value)) && value.length != 4;
        if (isDate){
						break;
				}
      }
    }
    return isDate;
  }

  raw.typeOf = function (value) {
    if (value === null || value.length === 0) return null;
    if (raw.isDate(value)) return Date.name;
    if (raw.isNumber(value)) return Number.name;
    if (raw.isString(value)) return String.name;
    return null;
  }

  raw.divergingRange = function(n){
    return d3.range(n).map(function (d){
      return d3.hsl( 360 / n * d, .4, .58 ).toString();
    })
  }

  raw.foreground = function(color){
    return d3.hsl(color).l > .5 ? "#222222" : "#ffffff";
  }

	exports.raw = raw;

}(typeof exports !== 'undefined' && exports || this);
