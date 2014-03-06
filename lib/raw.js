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
          throw new Error("Please, check line " + ( row + 1 ) );
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
        types = [Number, String, Date, Boolean],
        multiple = false,
        optional = false;

    var dimension = function(object) {
      if (!dimension.value.length) return null;
      if (!arguments.length) return dimension.value;
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

    var id = id || Date.now(),
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
      var id = id || Math.round(Date.now() + Math.random() * 1000);
      var dimension = model_dimension(this);
      dimensions.set(id, dimension);
      return dimension;
    }

    model.dimensions = function() {
      return dimensions.values();
    }

    raw.models.set(id,model);
    
    return model;

  }


  // Built-in models

  raw.models.set('tree', function(){

    var tree = raw.model();

    var hierarchy = tree.dimension()
       .title('Hierarchy')
       .multiple(true);

    var size = tree.dimension()
       .title('Size')
       .types(Number)

    var color = tree.dimension()
       .title('Color')

    var label = tree.dimension()
       .title('Label')

    tree.map(function (data){
      var root = { children : [] };
      data.forEach(function (d){
        if (!hierarchy()) return root;
        
        var leaf = seek(root, hierarchy(d), hierarchy.value);
        if(leaf === false) return;

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
      var p = root.children.filter(function(d){ return d.name == path[0] ? true : false; })[0]
      
      if (!p) {
        var fp = {};
        for(var c in classes){
          fp[classes[c]] = path[c];
        }
        p = { name: path[0], class:classes[0], children:[], path:fp };  
        root.children.push(p);
      }
      if (path.length == 1) return p;
      else return seek(p, path.slice(1), classes.slice(1));
    }

    return tree;

  })

  raw.models.set('points', function(){

    var points = raw.model();

    var x = points.dimension()
      .title("X Axis")
      .types(Number, Date)
      .rollup(function (d){ return parseFloat(d); })

    var y = points.dimension()
      .title("Y Axis")
      .types(Number, Date)
      .rollup(function (d){ return parseFloat(d); })

    var size = points.dimension()
      .title("Size")
      .types(Number)

    var color = points.dimension()
      .title("Color")

    var label = points.dimension()
      .title("Label")

    points.map(function (data){
      return data.map(function (d){
        return {
          x : +x(d),
          y : +y(d),
          size : +size(d),
          color : color(d),
          label : label(d)
        }
      })
    })

    return points;

  })


  raw.models.tree = raw.models.get('tree');
  raw.models.points = raw.models.get('points');

  /**
   * Charts
   */

  var chart_option = function (map) {

    var title = "Untitled",
        description = null,
        type = "number",
        _default = null;

    var option = function(){
      return option.value;
    }

    option.value = _default;

    option.title = function(_) {
      if (!arguments.length) return title;
      title = _.toString();
      return option;
    }

    option.defaultValue = function(_) {
      if (!arguments.length) return _default;
      option.value = _default = _;
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

    return option;
  }

  raw.chart = function (id) { 

    var id = id || Date.now(),
        title = "Untitled",
        description = null,
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
    if (raw.isBoolean(value)) return Boolean.name;
    if (raw.isDate(value)) return Date.name;
    if (raw.isNumber(value)) return Number.name;
    if (raw.isString(value)) return String.name;
    return null;
  }

  
	exports.raw = raw;

})(typeof exports !== 'undefined' && exports || this);