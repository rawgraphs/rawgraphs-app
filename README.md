<p align="center"><img src="http://raw.densitydesign.org/wp-content/uploads/2014/04/header.png"></p>

#RAW v1.0 is here!
We have completely rebuilt RAW adding many new features and charts!

##What's New

- **APIs to add and edit Charts**
- **Lots of new Charts!**
- Linear color scales for numeric values
- Improved Documentation and Developer Guide
- Mobile support
- Brand new User Interface
- Updated libraries 
- Fixed bugs


##About

**RAW** is an open web tool developed at the [DensityDesign Research Lab](http://www.densitydesign.org) (Politecnico di Milano) to create custom vector-based visualizations on top of the amazing [d3.js](https://github.com/mbostock/d3) library by [Mike Bostock](http://bost.ocks.org/mike/).
Primarily conceived as a tool for designers and vis geeks, RAW aims at providing a missing link  between spreadsheet applications (e.g. Microsoft Excel, Apple Numbers, Google Docs, OpenRefine, …) and vector graphics editors (e.g. Adobe Illustrator, Inkscape, …).

RAW works with [delimiter-separated values](http://en.wikipedia.org/wiki/Delimiter-separated_values) (i.e. csv and tsv files) as well as with copied-and-pasted texts from other applications (e.g. Microsoft Excel, TextWrangler, TextEdit, …). Based on the [svg](http://en.wikipedia.org/wiki/Svg) format, visualizations can be easily edited with vector graphics applications for further refinements, or directly embedded into web pages.

Knowing the need of working with sensitive information, the data uploaded to RAW is processed only by the web browser: **no server-side operations or storages are performed** and no one will see, touch or copy your data!

RAW is also highly customizable and extensible, accepting new custom layouts defined by users. For more information about how to add or edit layouts, see the [Developer Guide](https://github.com/densitydesign/raw/wiki/Developer-Guide).

- App page: [app.raw.densitydesign.org](http://app.raw.densitydesign.org)
- Project official page: [raw.densitydesign.org](http://raw.densitydesign.org)
- Documentation: [github.com/densitydesign/raw/wiki](https://github.com/densitydesign/raw/wiki)
- Google group: [groups.google.com/forum/#!forum/densitydesign-raw](https://groups.google.com/forum/#!forum/densitydesign-raw)


##Usage
The easiest way to use RAW is by accessing the most updated version on the **[official app page](http://app.raw.densitydesign.org)**. However, RAW can also run locally on your machine: see the installation instructions below to know how.

##Installation
If you want to run your instance of RAW locally on your machine, be sure you have the following requirements installed.

###Requirements

- [git](http://git-scm.com/book/en/Getting-Started-Installing-Git)
- [Bower](http://bower.io/#installing-bower)

###Instructions

Clone RAW from the command line:

``` sh
$ git clone git://github.com/densitydesign/raw.git
```

browse to RAW root folder:

``` sh
$ cd raw
```

install client-side dependencies:

``` sh
$ bower install
```
	
You can now run RAW from your local web server. For example, you can run Python's built-in server:

``` sh
$ python -m SimpleHTTPServer 4000
```

or for Python 3+

``` sh
$ python -m http.server 4000
```

Once this is running, go to [http://localhost:4000/](http://localhost:4000/).

Troubles with the installation? Maybe a look at the [issues](https://github.com/densitydesign/raw/issues) page can solve your problem, otherwise join the [Google group](https://groups.google.com/forum/#!forum/densitydesign-raw).


##Documentation and Support

Documentation and FAQs about how to use RAW can be found on the [wiki](https://github.com/densitydesign/raw/wiki/).

##Charts

Information about the available charts can be found [here](https://github.com/densitydesign/raw/wiki/Available-Charts). Adding new charts is very easy in RAW, see how [here](https://github.com/densitydesign/raw/wiki/Adding-New-Charts)!

If you have any suggestion or request about new layouts to include, please let us know! If you have already created new charts and you would like to see them included into Raw, please send us a [pull request](https://github.com/densitydesign/raw/pulls).

##Libraries

**RAW** has been developed using a lot of cool stuff found out there:

[angular.js](https://github.com/angular/angular.js)  
[angular-bootstrap-colorpicker](https://github.com/buberdds/angular-bootstrap-colorpicker)  
[angular-ui](https://github.com/angular-ui)  
[bootstrap](https://github.com/twbs/bootstrap)  
[bootstrap-colorpicker](http://www.eyecon.ro/bootstrap-colorpicker/)  
[Bower](https://github.com/bower/bower)  
[canvas-toBlob.js](https://github.com/eligrey/canvas-toBlob.js)  
[canvg.js](http://code.google.com/p/canvg/)  
[CodeMirror](https://github.com/marijnh/codemirror)  
[d3.js](https://github.com/mbostock/d3)  
[FileSaver.js](https://github.com/eligrey/FileSaver.js)  
[jQuery](https://github.com/jquery/jquery)  
[jQuery UI Touch Punch](https://github.com/furf/jquery-ui-touch-punch/)  
[rgbcolor.js](http://www.phpied.com/rgb-color-parser-in-javascript/)  
[ZeroClipboard](https://github.com/zeroclipboard/zeroclipboard)

##Roadmap

- ~~Refactoring using [reusable charts](http://bost.ocks.org/mike/chart/) as layouts~~
- ~~Introducing continuous color scales (for numeric values)~~
- ~~Mobile support~~
- Improving documentation and API Reference
- Creating and exporting legends
- PDF export

##Team and Contacts

**RAW** has been developed and maintained at DensityDesign Research Lab by:
 
Giorgio Caviglia <giorgio.caviglia@gmail.com>  
Michele Mauri <michele.mauri@polimi.it>  
Giorgio Uboldi <giorgio.uboldi@polimi.it>  
Matteo Azzi <matteo.azzi@polimi.it>  

If you want to know more about RAW, how it works and future developments, please visit the [official website](http://raw.densitydesign.org). For any specific request or comment we suggest you to use Github or the [Google group](https://groups.google.com/forum/#!forum/densitydesign-raw). If none of these worked for you, you can write us at <raw@densitydesign.org>.

##Contributing

Want to contribute to RAW's development? You are more than welcome! Start by forking the repository (the "Fork" button at the top-right corner of this page) and follow the instructions above to clone it and install dependencies. Then you can use Github's issues and pull requests to discuss and share your work.


##License

RAW is provided under the LGPL (Lesser General Public License) v.3:

	Copyright (c), 2013-2014 DensityDesign Lab, Giorgio Caviglia, Michele Mauri,
	Giorgio Uboldi, Matteo Azzi
	
	<info@densitydesign.org>  
	<giorgio.caviglia@gmail.com>  
	<michele.mauri@polimi.it>  
	<giorgio.uboldi@polimi.it>  
	<matteo.azzi@polimi.it>  
	 
	This program is free software: you can redistribute it and/or modify
	it under the terms of the GNU Lesser General Public License as published by
	the Free Software Foundation, either version 3 of the License, or
	(at your option) any later version.
	 
	This program is distributed in the hope that it will be useful,
	but WITHOUT ANY WARRANTY; without even the implied warranty of
	MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
	GNU Lesser General Public License for more details.
	 
	You should have received a copy of the GNU Lesser General Public License
	along with this program.  If not, see <http://www.gnu.org/licenses/>.
