(function (exports){
	
	'use strict';

  var raw = {
    models : d3.map(),
    charts : d3.map()
  };


  raw.parser = function (text, delimiter) {

    if (!arguments.length) return;

    var parser = {};

    function mode(array) {
      if(array.length == 0) return null;
      var modeMap = {}, maxEl = array[0], maxCount = 1;
      for(var i = 0; i < array.length; i++) {
        var el = array[i];
        if(modeMap[el] == null)
          modeMap[el] = 1;
        else
          modeMap[el]++;  
        if(modeMap[el] > maxCount) {
          maxEl = el;
          maxCount = modeMap[el];
        }
      }
      return maxEl;
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
          rows = string.split("\n"),
          delimitersCount = delimiters.map(function (d){ return 0; }),
          character,
          quoted = false,
          firstChar = true;

      for (var characterCount in rows[0]) {

        character = rows[0][characterCount];

        switch(character) {

          case '"':
            if (quoted) {
              if (rows[0][characterCount+1] != '"') quoted = false;
              else characterCount++;
            }
            else if (firstChar) quoted = true;
            
            break;
            
          default:
            if (!quoted) {
              var index = delimiters.indexOf(character);
              if (index !== -1)
              {
                delimitersCount[index]++;
                firstChar = true;
                continue;
              }
            }
            break;
        }
        if (firstChar) firstChar = false;
      }
    
      var maxCount = d3.max(delimitersCount);
      return maxCount == 0 ? '\0' : delimiters[delimitersCount.indexOf(maxCount)];
    }

    function parse(string, delimiter) {
      
      if (!string) return [];
      
      var delimiter = delimiter || detectDelimiter(string),
          arrData = [[]],
          arrMatches = null,
          objData = [],
          header = [],
          objPattern = new RegExp((
              "(\\" + delimiter + "|\\r?\\n|\\r|^)" +
              "(?:\"([^\"]*(?:\"\"[^\"]*)*)\"|" +
              "([^\"\\" + delimiter + "\\r\\n]*))"
            ),"gi"
          );
                
      while (arrMatches = objPattern.exec( string )){
        
        try {
          var strMatchedDelimiter = arrMatches[ 1 ];
            if (strMatchedDelimiter.length &&
              (strMatchedDelimiter != delimiter)
              ){
                arrData.push( [] );
              }
            
            if (arrMatches[ 2 ]){
              var strMatchedValue = arrMatches[ 2 ].replace(
                new RegExp( "\"\"", "g" ),
                "\""
              );
            } else {
              var strMatchedValue = arrMatches[ 3 ];
            }
          arrData[ arrData.length - 1 ].push( strMatchedValue );
        
        } catch(e) {
          throw new Error(e.message);       
          return false;
        }
      }
      
      header = arrData[0];
        
      for (var row=1; row<arrData.length; row++) {

        // skipping empty rows
        if (arrData[row].length == 1 && arrData[row][0].length == 0 && arrData[row].length != header.length) continue;

        if(arrData[row].length == header.length) {
          var obj = {};
          for (var h in header){
            obj[header[h]] = arrData[row][h];
          }
          objData.push(obj);
        } else {
          throw new Error("Please, check line " + ( row + 1 ) + "");
          return false;
        }
      }
      
      return objData; 
      
    }

    parser.data = function(){
      return parse(text, delimiter);
    }

    parser.metadata = function(){
      return d3.entries(sniff(parser.data())).map(function (d){
        return { key : d.key, type : mode(d.value) }
      })
    }

    return parser;

  }

  /**
   * Models
   */

  var model_dimension = function (map) {

    var title = "Untitled",
        description = null,
        types = [Number, String, Date],
        multiple = false,
        optional = false;

    var dimension = function(object) {
      if (!dimension.value.length) return null;
      if (!arguments.length) return dimension.value.map(function (d){return d.key;});
      return multiple
        ? dimension.value.map(function (d){ return rollup.call(this, object[d.key]); })
        : rollup.call(this, object[dimension.value[0].key]);
    };

    dimension.value = [];

    function rollup(d){
      return d;
    }

    dimension.rollup = function(_) {
      if (!arguments.length) return rollup;
      rollup = _;
      return dimension;
    }

    dimension.multiple = function(_) {
      if (!arguments.length) return multiple;
      multiple = _;
      return dimension;
    }

    dimension.optional = function(_) {
      if (!arguments.length) return optional;
      optional = _;
      return dimension;
    }

    dimension.title = function(_) {
      if (!arguments.length) return title;
      title = _.toString();
      return dimension;
    }

    dimension.description = function(_) {
      if (!arguments.length) return description;
      description = _.toString();
      return dimension;
    }

    dimension.types = function() {
      if (!arguments.length) return types;
      var i = -1, n = arguments.length;
      types = [];
      while (++i < n) types.push(arguments[i]);
      return dimension;
    }

    /*dimension.value = function(_) {
      if (!arguments.length) return value;
      value = _;
      return dimension;
    }*/

    return dimension;
  }

  
  raw.model = function (id) { 

    var id = raw.models.values().length,
        title = "Untitled",
        description = null,
        dimensions = d3.map();

    var model = function (data) { 
      return map.call(this, data);
    }

    function map(data) {
      return data;
    }

    model.title = function(_) {
      if (!arguments.length) return title;
      title = _.toString();
      return model;
    }

    model.description = function(_) {
      if (!arguments.length) return description;
      description = _.toString();
      return model;
    }

    model.map = function(_) {
      if (!arguments.length) return map;
      map = _;
      return model;
    }

    model.dimension = function(id) {
      var id = id || dimensions.values().length;
      var dimension = model_dimension(this);
      dimensions.set(id, dimension);
      return dimension;
    }

    model.dimensions = function() {
      return dimensions;
    }

    model.clear = function() {
      dimensions.values().forEach(function (d){ d.value = []; })
    }

    //raw.models.set(id,model);
    
    return model;

  }


  // Built-in models

  raw.models.set('tree', function(){

    var tree = raw.model();

    var hierarchy = tree.dimension('hierarchy')
       .title('Hierarchy')
       .description("This is a description of the hierarchy that illustrates what the dimension is for and other things.")
       .multiple(true);

    var size = tree.dimension('size')
       .title('Size')
       .description("This is a description of the hierarchy that illustrates what the dimension is for and other things.")
       .rollup(function (d){ return +d; })
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
        var fp = {};
        for(var c in classes){
          fp[classes[c]] = path[c];
        }
        if( /\S/.test(path[0]) ) {
          p = { name: path[0], class:classes[0], children:[], path:fp };  
          root.children.push(p);
        } else p = root;
      }
      if (path.length == 1) return p;
      else return seek(p, path.slice(1), classes.slice(1));
    }

    return tree;

  })

  raw.models.set('points', function(){

    var points = raw.model();

    var x = points.dimension('x')
      .title("X Axis")
      .types(Number, Date)
      .rollup(function (d){ return +d; })

    var y = points.dimension('y')
      .title("Y Axis")
      .types(Number, Date)
      .rollup(function (d){ return +d; })

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
          x : +x(d),
          y : +y(d),
          size : size() ? +size(d) : 1,
          color : color(d),
          label : label(d)
        }
      })
    })

    return points;

  })


  raw.models.set('graph', function(){

    var graph = raw.model();

    var steps = graph.dimension('steps')
      .title('Steps')
      .multiple(true)

    var size = graph.dimension('size')
      .title('Size')
      .types(Number)

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
            n.push({ "name" : s.key, "group" : sg })
            si = n.length-1;
          }


          s.values.forEach(function (t){
            ti = getNodeIndex(n, t.key, tg)
            if (ti == -1) {
              n.push({ "name" : t.key, "group" : tg })
              ti = n.length-1;
            }
            var value = size() ? d3.sum(t.values, function (d){ return +size(d); }) : t.values.length;
            var link = { "source" : n[si], "target" : n[ti], "value" : value };
            l.push(link);
          })

        })
      }
      d.nodes = n.sort(customSort);
      l.forEach(function (d){ d.source = n.indexOf(d.source); d.target = n.indexOf(d.target)});
      d.links = l;
      return d;

    })

    function sortByName(a,b){
      if(a.name < b.name) return -1;
      if(a.name > b.name) return 1;
      return 0; 
    }

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


  raw.models.tree = raw.models.get('tree');
  raw.models.points = raw.models.get('points');
  raw.models.graph = raw.models.get('graph');

  /**
   * Charts
   */

  var chart_option = function (map) {

    var title = "Untitled",
        description = null,
        type = "number",
        fit = false,
        data = null,
        values = [],
        listener = function(){ },
        defaultValue = null;

    var option = function(){
      return option.value;
    }

    option.value = defaultValue;

    option.title = function(_) {
      if (!arguments.length) return title;
      title = _.toString();
      return option;
    }

    option.defaultValue = function(_) {
      if (!arguments.length) return defaultValue;
      option.value = defaultValue = _;
      return option;
    }

    option.listener = function(_) {
      if (!arguments.length) return listener;
      listener = _;
      return option;
    }

    option.data = function() {
      return listener.apply(this, [arguments]);
    }

    option.values = function(_) {
       if (!arguments.length) return values;
      values = _;
      return option;
    }

    option.description = function(_) {
      if (!arguments.length) return description;
      description = _.toString();
      return option;
    }

    option.type = function(_) {
      if (!arguments.length) return type;
      type = _.toString();
      return option;
    }

    option.fitToWidth = function(_) {
      if (!arguments.length) return fit;
      fit = _;
      return option;
    }

    return option;
  }

  raw.chart = function (id) { 

    var id = id || raw.charts.values().length,
        title = "Untitled",
        description = null,
        thumbnail = "",
        options = d3.map();

    var chart = function (selection) {
      selection.each(function (data){
        draw.call(this, selection, model(data));
      })
    }

    function model(data){
      return data;
    }

    function draw(data) {
      return data;
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

    chart.option = function(id) {
      var id = id || Math.round(Date.now() + Math.random() * 1000);
      var option = chart_option(this);
      options.set(id, option);
      return option;
    }

    chart.options = function() {
      return options.values();
    }

    chart.clean = function() {
      options.values().forEach(function (d){ d.value = null; })
    }

    raw.charts.set(id, chart);
    
    return chart;

  }

  /**
   * Utils
   */

  raw.isString = function(value){
    return typeof value == 'string';
  }

  raw.isBoolean = function(value){
    if (value.toLowerCase() === 'true' || value.toLowerCase() === 'yes' || value === 1 ) return true;
    if (value.toLowerCase() === 'false' || value.toLowerCase() === 'no' || value === 0 ) return true;
    return false;
  }

  raw.isNumber = function(value) {
    return !isNaN(value);//.replace(',','.'));
  }

  raw.isDate = function(value){
    value = value.replace(/[\-|\.\_]/g, '/');
    value = value.replace(/^(\d{1,2})\/(\d{1,2})\/(\d{2,4})/g , '$3/$1/$2');
    if (value.search(/^\d{2,4}\/\d{1,2}\/\d{1,2}\b$/) != 0) return false;
    if (!raw.isNumber(value) && Date.parse(value)) return true;
    return false;
  }

  raw.typeOf = function (value) {
    if (value === null || value.length === 0) return null;
    //if (raw.isBoolean(value)) return Boolean.name;
    if (raw.isDate(value)) return Date.name;
    if (raw.isNumber(value)) return Number.name;
    if (raw.isString(value)) return String.name;
    return null;
  }

  function d3_scaleExtent(domain) {
    var start = domain[0], stop = domain[domain.length - 1];
    return start < stop ? [ start, stop ] : [ stop, start ];
  }

  raw.divergingRange = function(n){
    return d3.range(n).map(function (d){
      return d3.hsl( 360 / n * d, .4, .57 ).toString();
    })
  }

  raw.diverging = function() {
    return d3_scale_ordinal([], {
      t: "range",
      a: [ [ ] ]
    });
  };

  function d3_scale_ordinal(domain, ranger) {
    var index, range, rangeBand;
    function scale(x) {
      return range[((index.get(x) || ranger.t === "range" && index.set(x, domain.push(x))) - 1) % range.length];
    }
    function steps(start, step) {
      return d3.range(domain.length).map(function(i) {
        return start + step * i;
      });
    }
    scale.domain = function(x) {
      if (!arguments.length) return domain;
      domain = [];
      index = d3.map();
      var i = -1, n = x.length, xi;
      while (++i < n) if (!index.has(xi = x[i])) index.set(xi, domain.push(xi));
      index.values().forEach(function (d,a){
        range.push(d3.hsl( 360/domain.length * a, .4, .6 ).toString());
      })
      return scale[ranger.t].apply(scale, ranger.a);
    };
    scale.range = function(x) {
      if (!arguments.length) return range;
      range = x;
      rangeBand = 0;
      ranger = {
        t: "range",
        a: arguments
      };
      return scale;
    };
    scale.rangePoints = function(x, padding) {
      if (arguments.length < 2) padding = 0;
      var start = x[0], stop = x[1], step = (stop - start) / (Math.max(1, domain.length - 1) + padding);
      range = steps(domain.length < 2 ? (start + stop) / 2 : start + step * padding / 2, step);
      rangeBand = 0;
      ranger = {
        t: "rangePoints",
        a: arguments
      };
      return scale;
    };
    scale.rangeBands = function(x, padding, outerPadding) {
      if (arguments.length < 2) padding = 0;
      if (arguments.length < 3) outerPadding = padding;
      var reverse = x[1] < x[0], start = x[reverse - 0], stop = x[1 - reverse], step = (stop - start) / (domain.length - padding + 2 * outerPadding);
      range = steps(start + step * outerPadding, step);
      if (reverse) range.reverse();
      rangeBand = step * (1 - padding);
      ranger = {
        t: "rangeBands",
        a: arguments
      };
      return scale;
    };
    scale.rangeRoundBands = function(x, padding, outerPadding) {
      if (arguments.length < 2) padding = 0;
      if (arguments.length < 3) outerPadding = padding;
      var reverse = x[1] < x[0], start = x[reverse - 0], stop = x[1 - reverse], step = Math.floor((stop - start) / (domain.length - padding + 2 * outerPadding)), error = stop - start - (domain.length - padding) * step;
      range = steps(start + Math.round(error / 2), step);
      if (reverse) range.reverse();
      rangeBand = Math.round(step * (1 - padding));
      ranger = {
        t: "rangeRoundBands",
        a: arguments
      };
      return scale;
    };
    scale.rangeBand = function() {
      return rangeBand;
    };
    scale.rangeExtent = function() {
      return d3_scaleExtent(ranger.a[0]);
    };
    scale.copy = function() {
      return d3_scale_ordinal(domain, ranger);
    };
    return scale.domain(domain);
  }

  raw._diverging = function(){
    
    var values = {},
      domain = [],
      range = [],
      saturation = .4,
      light = .6;
    
    var diverging = function(x){

      if(!arguments.length || !raw.isString(x)) return values;
      if(values.hasOwnProperty(x)) return values[x];
      values[x] = d3.hsl( 360/domain.length*(domain.indexOf(x)), saturation, light ).toString();
      return values[x];
    }

    diverging.values = function(){
      return values;
    }

    diverging.saturation = function(x){
      if (!arguments.length) return saturation;
      saturation = x;
      return diverging;
    }
    
    diverging.light = function(x){
      if (!arguments.length) return light;
      light = x;
      return diverging;
    }

    diverging.domain = function(x){
      if (!arguments.length) return domain;
      domain = x;
      var newValues = {};
      domain.forEach(function (d){
        var k = d != 'null' ? d : "undefined";
        if(values.hasOwnProperty(k)) newValues[k] = values[k];
        else newValues[k] = diverging(k);
      })
      values = newValues;
      return diverging;
    }

    diverging.range = function(_){
      if (!arguments.length) return d3.values(values);
      range = _;
      return diverging;
    }

    diverging.empty = function(){
      values = {}
      return diverging;
    }
    
    diverging.value = function(name,value){
      if (arguments.length == 1) return values[name];
      values[name] = value;
      return diverging;
    }
    
    return diverging;
    
  }

  raw.foreground = function(color){
    return d3.hsl(color).l > .5 ? "#222222" : "#ffffff";
  }

  
	exports.raw = raw;

})(typeof exports !== 'undefined' && exports || this);