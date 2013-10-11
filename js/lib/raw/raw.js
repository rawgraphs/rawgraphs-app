/**
 * RAW
 * (c) 2012-2013 DensityDesign Lab http://www.densitydesign.org
 */

(function() {

	var raw = window.raw || (window.raw = {});
	
	/* Helpers */

	raw.isBoolean = function(value) {
  		return typeof value == 'boolean';
	}

	raw.isString = function(value){
		return typeof value == 'string';
	}

	raw.isArray = function(value){
		return Object.prototype.toString.apply(value) == '[object Array]';
	}

	raw.isNumber = function(value){
		return typeof value == 'number'; //|| !isNaN(parseFloat(value));
	}

	raw.isObject = function(value){
		return value != null && typeof value == 'object';
	}

	raw.isDate = function(value){
		return Object.prototype.toString.apply(value) == '[object Date]';
	}

	raw.isFunction = function(value){
		return typeof value == 'function';
	}

	raw.isBooleanLike = function(value){
		if (value.toLowerCase() === 'true' || value.toLowerCase() === 'yes' || value === 1 ) return true;
    	if (value.toLowerCase() === 'false' || value.toLowerCase() === 'no' || value === 0 ) return true;
		return false;
	}

	raw.isNumberLike = function(value) {
		return !isNaN(value.replace(',','.'));
	}

	//TODO: provare a parsare e vedere che succede...
	raw.isDateLike = function(value){
		value = value.replace(/[\-|\.\_]/g, '/');
		value = value.replace(/^(\d{1,2})\/(\d{1,2})\/(\d{2,4})/g , '$3/$1/$2');
		if (value.search(/^\d{2,4}\/\d{1,2}\/\d{1,2}\b$/) != 0) return false;
		if (!raw.isNumberLike(value) && Date.parse(value)) return true;
		return false;
	}

	raw.sniff = function(value) {
		if (value === null || value.length === 0) return 'null';
		if (raw.isObject(value)) return 'object';
		if (raw.isArray(value)) return 'array';
		if (raw.isNumber(value)) return 'number';
		// String
		if (raw.isBooleanLike(value)) return 'boolean';
		if (raw.isDateLike(value)) return 'date';
		if (raw.isNumberLike(value)) return 'number';
		if (raw.isString(value)) return 'string';
		return null;
	}

	raw.sniffAll = function(objs) {
		var keys = {};
		d3.keys(objs[0]).forEach(function(d){ keys[d] = []; });

		objs.forEach(function(d){
			for(var key in keys) {
				keys[key].push(raw.sniff(d[key]));
			}
		})
		return keys;
	}


	raw.maxOnValue = function(obj){
		var entries = d3.entries(obj).sort(function(a,b){ return a.value < b.value; });
		return entries[0].key == "null" && entries.length > 1 ? entries[1].key : entries[0].key;
	}


	/* Returns object value by string path */

	raw.reach = function(obj, path){
    	var path = path ? path.split('.') : null;
    	var result = obj;
    	if (!path) return obj;
    	for (var i=0, len=path.length; i<len; i++){
        	result = result[path[i]];
    	};
    	return result;
	};

	raw.unique = function(array, path) {
		var nesting = d3.nest()
			.key(function(d) { return raw.reach(d,path); })
			.map(array)
		return d3.keys(nesting);
	}

	raw.count = function(array,path) {
		var nesting = d3.nest()
			.key(function(d) { return raw.reach(d, path); })
			.rollup(function(d){return d.length;})
			.map(array)
		return nesting;
	}

	raw.diverging = function(){
		
		var values = {},
			domain = [],
			saturation = .4,
			light = .6;
		
		var diverging = function(x){

			if(!arguments.length || !raw.isString(x)) return values;
			if(values.hasOwnProperty(x)) return values[x];
			values[x] = d3.hsl( 360/domain.length*(domain.indexOf(x)), saturation, light ).toString()
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
			//values = {};
			var newValues = {};
			domain.forEach(function(d){
				var k = d != 'null' ? d : "undefined";
				if(values.hasOwnProperty(k)) newValues[k] = values[k];
			})
			values = newValues;
			return diverging;
		}

		diverging.empty = function(){
			values = {}
			return diverging;
		}
		
		/* Manually getting/setting values */
		diverging.value = function(name,value){
			if (arguments.length == 1) return values[name];
			values[name] = value;
			return diverging;
		}

		
		return diverging;
		
	}

	/* Returns object value by string path */
	raw.deepValue = function(obj, path){
    	var path = path.split('.');
    	var result = obj;
    	for (var i=0, len=path.length; i<len; i++){
        	result = result[path[i]];
    	};
    	return result;
	};

	/* Counting single values in array of objects */
	raw.countUnique = function(array, path) {
		var nesting = d3.nest()
			.key(function(d) { return raw.deepValue(d,path); })
			.map(array)
		return d3.keys(nesting).length;
	}


	/* Helpers */

	/* Auto-detect delimiter, inspired by JosipK's C++ algorithm
	   http://www.codeproject.com/KB/cs/auto-detect-csv-separator.aspx */
	raw.detectDelimiter = function(string, delimiters){
		
		if (!arguments.length) return;

		if (!delimiters) delimiters = [",",";",":","\t"]
		
		var rows = string.split("\n"),
			delimitersCount = delimiters.map(function(d){ return 0; }),
			character,
			quoted = false,
			firstChar = true;
		
		for (row in rows) {

			// ignoring blank rows */
			if (!rows[row].length) continue; 

			for (var characterCount=0; characterCount < rows[row].length - 1; characterCount++) {

				character = rows[row][characterCount];

				switch(character) {

					case '"':
						if (quoted) {
							if (rows[row][characterCount+1] != '"') quoted = false;
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
		}

		var maxCount = d3.max(delimitersCount);
		return maxCount == 0 ? '\0' : delimiters[delimitersCount.indexOf(maxCount)];
	}

	/* Parsing a string into an array of objects */
	raw.parse = function(string, delimiter) {
		
		// c'mon...
		if (!string) return [];

		// maybe we are lucky and the string is a well formed json...
		
		// we can only accept json arrays of objects, so let's check if the string starts with an [
		// I know this is not so robust... any better ideas?
		if (string[0] == "[") {

			try {
				var result = JSON.parse(string);
				return result;
			}
			catch (e) {
				throw new Error(e.message);
				return false;
			}
			
		}
		
		if (!delimiter) delimiter = raw.detectDelimiter(string);
		
		var objPattern = new RegExp(
			(
				"(\\" + delimiter + "|\\r?\\n|\\r|^)" +
				"(?:\"([^\"]*(?:\"\"[^\"]*)*)\"|" +
				"([^\"\\" + delimiter + "\\r\\n]*))"
			),
			"gi"
		);

		var arrData = [[]],
			arrMatches = null,
			objData = [],
			header = [];
							
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
			if (arrData[row].length == 1 && arrData[row].length != header.length) continue;
			
			if(arrData[row].length == header.length) {
				var obj = {};
				for (var h in header){
					obj[header[h]] = arrData[row][h];
				}
				objData.push(obj);
			} else {

				throw new Error("Hey, there's something strange at line " + (row+1) );
				return false;
			}
		}
		
		return objData;	
		
		
		
	}

	// Tree { name, classes, children[] }
	// TODO: improve this, please
	raw.seek = function(t, path, classes, full_path, full_classes) {
		if (arguments.length == 3) {
			full_path = path;
			full_classes = classes;
		}
		if (path.length < 1)
			return false;
		var p = t.children.filter(function(d){ return d.name == path[0] ? true : false; })[0]
		if (!p) {
			var fp = {};
			for(var c in full_classes){
				fp[full_classes[c]] = full_path[c];
			}
			p = { name: path[0], class:classes[0], children:[], path:fp };	
			t.children.push(p);
		}
		if (path.length == 1) return p;
		else return raw.seek(p, path.slice(1), classes.slice(1), full_path, full_classes);
	}

})();

