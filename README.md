<p align="center"><img src="http://raw.densitydesign.org/wp-content/uploads/2013/10/Header.png"></p>

**Raw** is an open web tool developed at the [DensityDesign Research Lab](http://www.densitydesign.org) (Politecnico di Milano) to create custom vector-based visualizations on top of the amazing [d3.js](https://github.com/mbostock/d3) library by [Mike Bostock](http://bost.ocks.org/mike/).
Primarily conceived as a tool for designers and vis geeks, **Raw** aims at providing a missing link  between spreadsheet applications (e.g. Microsoft Excel, Apple Numbers, Google Docs, OpenRefine, …) and vector graphics editors (e.g. Adobe Illustrator, Inkscape, ...).

**Raw** works with [delimiter-separated values](http://en.wikipedia.org/wiki/Delimiter-separated_values) (i.e. csv and tsv files) as well as with copied-and-pasted texts from other applications (e.g. Microsoft Excel, TextWrangler, TextEdit,…). Based on the [svg](http://en.wikipedia.org/wiki/Svg) format, visualizations can be easily edited with vector graphics applications for further refinements, or directly embedded into web pages.

Knowing the need of working with sensitive information, the data uploaded to **Raw** is processed only by the web browser: no server-side operation or storage is performed and no one will see, touch or copy your data!

**Raw** is also highly customizable and extensible, accepting new custom layouts defined by users. For more information about how to add or edit layouts, see the Documentation section.

- Online app: [http://app.raw.densitydesign.org](http://app.raw.densitydesign.org)
- Official web site: [http://raw.densitydesign.org](http://raw.densitydesign.org)
- Documentation: [https://github.com/densitydesign/raw/wiki](https://github.com/densitydesign/raw/wiki)
- Google group: [https://groups.google.com/forum/#!forum/densitydesign-raw](https://groups.google.com/forum/#!forum/densitydesign-raw)


##Usage
The easiest way to use Raw is by accessing the most updated version on the [official app page](http://app.raw.densitydesign.org). However Raw can also run locally on your machine, see the installation instructions below to know how.

##Installation
If you want to run your instance of Raw locally on your machine, be sure you have the following requirements installed. **Starting from version 0.1.2, we decided to simplify the code and removing Node.js: only Bower is needed to install client-side dependencies.**

###Requirements

- [git](http://git-scm.com/book/en/Getting-Started-Installing-Git)
- [Bower](http://bower.io/#installing-bower)


Clone Raw from the command line:

``` sh
$ git clone git://github.com/densitydesign/raw.git
```

browse to Raw root folder:

``` sh
$ cd raw
```

install client-side dependencies:

``` sh
$ bower install
```
	
You can now access Raw from any local web server. For example, you can run Python's built-in server:

``` sh
$ python -m SimpleHTTPServer 4000
```

or for Python 3+

``` sh
$ python -m http.server 4000
```

Once this is running, go to [http://localhost:4000/](http://localhost:4000/).

Troubles with the installation? Maybe a look at the [issues](https://github.com/densitydesign/raw/issues) page can solve your problem, otherwise visit the [Google group](https://groups.google.com/forum/#!forum/densitydesign-raw).


##Documentation and Support

Documentation and FAQs about how to use Raw can be found on the [official website](http://raw.densitydesign.org). Development guide will be available soon on the Wiki of this repository. Sorry for this.

##Layouts

Information about the available layouts can be found on the [wiki](https://github.com/densitydesign/raw/wiki/Layouts).

If you have any suggestion or request about new layouts to include, please let us know! If you have already created new layouts and you would like to see them included into Raw, please send us a [pull request](https://github.com/densitydesign/raw/pulls).

##Libraries

Raw has been developed using a lot of cool stuff available out there:

[angular.js](https://github.com/angular/angular.js)  
[angular-ui](https://github.com/angular-ui)  
[bootstrap (2.3.2)](https://github.com/twbs/bootstrap)  
[bootstrap-colorpicker](http://www.eyecon.ro/bootstrap-colorpicker/)  
[Bower](https://github.com/bower/bower)  
[canvas-toBlob.js](https://github.com/eligrey/canvas-toBlob.js)  
[canvg.js](http://code.google.com/p/canvg/)  
[CodeMirror](https://github.com/marijnh/codemirror)  
[d3.js](https://github.com/mbostock/d3)  
[FileSaver.js](https://github.com/eligrey/FileSaver.js)  
[jQuery](https://github.com/jquery/jquery)  
[rgbcolor.js](http://www.phpied.com/rgb-color-parser-in-javascript/)  
[select2](http://ivaynberg.github.io/select2/)

##Roadmap

- Improving documentation and API reference
- Refactoring using [reusable charts](http://bost.ocks.org/mike/chart/) as layouts
- Introducing continuous color scales (for numeric values)
- Creating and exporting visualizations' legends
- Labels based on data
- PDF export
- Mobile version

##Team and Contacts

Raw has been developed and maintained at DensityDesign Research Lab by:
 
Giorgio Caviglia <giorgio.caviglia@polimi.it>  
Michele Mauri <michele.mauri@polimi.it>  
Giorgio Uboldi <giorgio.uboldi@polimi.it>  
Matteo Azzi <matteo.azzi@polimi.it>  

If you want to know more about Raw, how it works and future developments, please visit the [official website](http://raw.densitydesign.org). For any specific request or comment we suggest you to use Github or the [Google group](https://groups.google.com/forum/#!forum/densitydesign-raw). If none of these worked for you, you can write us at <raw@densitydesign.org>.

Want to contribute to Raw's development? You are more than welcome! Just fork the repo and use Github's issues and pull requests.


##License

Raw is provided under the LGPL (Lesser General Public License) v.3:

> Copyright (c), 2013 DensityDesign Lab, Giorgio Caviglia, Michele Mauri,
> Giorgio Uboldi, Matteo Azzi
> 
> <info@densitydesign.org>  
> <giorgio.caviglia@polimi.it>  
> <michele.mauri@polimi.it>  
> <giorgio.uboldi@polimi.it>  
> <matteo.azzi@polimi.it>  
> 
> This program is free software: you can redistribute it and/or modify
> it under the terms of the GNU Lesser General Public License as published by
> the Free Software Foundation, either version 3 of the License, or
> (at your option) any later version.
> 
> This program is distributed in the hope that it will be useful,
> but WITHOUT ANY WARRANTY; without even the implied warranty of
> MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
> GNU Lesser General Public License for more details.
> 
> You should have received a copy of the GNU Lesser General Public License
> along with this program.  If not, see <http://www.gnu.org/licenses/>.
