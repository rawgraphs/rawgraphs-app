# RAW
Currently in beta.

**Raw** is an open web tool developed at the [DensityDesign Research Lab](http://www.densitydesign.org) (Politecnico di Milano) to create custom vector-based visualizations on top of the amazing [d3.js](https://github.com/mbostock/d3) library.
Primarily conceived as a tool for designers and vis geeks, Raw aims at providing a missing link  between spreadsheet applications (e.g. Microsoft Excel, Apple Numbers, OpenRefine) and vector graphics editors (e.g. Adobe Illustrator, Inkscape, ...).

**Raw** works with delimiter-separated values (i.e. csv and tsv files) as well as with copied-and-pasted texts from other applications (e.g. Microsoft Excel, TextWrangler, TextEdit). Based on the [svg](http://en.wikipedia.org/wiki/Svg) format, visualizations can be easily imported in and edited with vector graphics applications for further refinements, or directly embedded into web pages.

Knowing the need of working with sensitive information, the data uploaded to **Raw** is processed only by the web browser: no server-side operation or storage are performed - no one will see, touch or copy your data!

**Raw** is also highly customizable and extensible, accepting new custom layouts defined by users. For more information about how to add or edit layouts, see the Documentation section.

- Web site: [http://raw.densitydesign.org](http://raw.densitydesign.org)
- Online app: [http://app.raw.densitydesign.org](http://app.raw.densitydesign.org)
- Google group: [https://groups.google.com/forum/#!forum/densitydesign-raw](https://groups.google.com/forum/#!forum/densitydesign-raw)


##Usage
The easiest way to use Raw is by accessing the most updated version on the [official app website](http://app.raw.densitydesign.org). However, as an open source Node.js/Express app, Raw can also run locally on your machine. 

##Installation
If you want to run your instance of Raw locally on your machine, be sure you have [Node.js](http://dnodejs.org/) installed, otherwise [download](http://nodejs.org/download/) and install it.

###Requirements

- [git](http://git-scm.com/book/en/Getting-Started-Installing-Git)
- [Node.js](http://nodejs.org/download/) 
- [Bower](http://bower.io/#installing-bower)


Clone Raw from the command line:

	$ git clone git://github.com/densitydesign/raw.git

browse to Raw root folder:

	$ cd raw

install server-side dependencies:

	$ npm install
	
run server:

	$ npm start

Once this is running, go to [http://localhost:4000/](http://localhost:4000/).


##Documentation and Support

Documentation and FAQs about how to use Raw can be found on the [official website](http://raw.densitydesign.org). Development guide will be available soon on the Wiki of this repository. Sorry for this.

##Layouts

Currently, the following layouts are available:

- Treemap
- Bubble Chart
- Circle Packing
- Dendogram
- Circular Dendogram
- Hexagonal Binning
- Alluvial Diagram (Fineo-like diagram)

…and these will come soon:

- Ribbon Streamgraph
- Parallel Set 
- Area Graph
- Horizon Chart
- Convex-hull Scatterplot
- Parallel Coordinates
- Scatterplot Voronoi Tesselation
- Scatterplot Delaunay Triangulation
- Quantum Treemap

##Libraries

Raw has been developed using a lot of cool stuff available out there:

[angular.js](https://github.com/angular/angular.js)  
[angular-ui](https://github.com/angular-ui)  
[Blob.js](https://github.com/eligrey/Blob.js)  
[bootstrap](https://github.com/twbs/bootstrap)  
[bootstrap-colorpicker](http://www.eyecon.ro/bootstrap-colorpicker/)  
[canvas-toBlob.js](https://github.com/eligrey/canvas-toBlob.js)  
[canvg.js](http://code.google.com/p/canvg/)  
[CodeMirror](https://github.com/marijnh/codemirror)  
[d3.js](https://github.com/mbostock/d3)  
[express](https://github.com/visionmedia/express)  
[FileSaver.js](https://github.com/eligrey/FileSaver.js)  
[Jade](http://jade-lang.com/)  
[jQuery](https://github.com/jquery/jquery)  
[jsPDF](https://github.com/MrRio/jsPDF)  
[Node.js](http://nodejs.org/)  
[nodemon](https://github.com/remy/nodemon)  
[rgbcolor.js](http://www.phpied.com/rgb-color-parser-in-javascript/)  
[select2](http://ivaynberg.github.io/select2/)

##Roadmap

- Improve documentation and API reference
- Introducing continuous color scales (for numeric values)
- Creating and exporting visualizations' legends
- PDF export
- Code refactoring using [reusable charts](http://bost.ocks.org/mike/chart/) as layouts



##Team and Contacts

Raw has been developed and maintained at DensityDesign Research Lab by:
 
Giorgio Caviglia <giorgio.caviglia@polimi.it>  
Michele Mauri <michele.mauri@polimi.it>  
Giorgio Uboldi <giorgio.uboldi@polimi.it>  
Matteo Azzi <matteo.azzi@polimi.it>  

If you want to know more about Raw, how it works and future developments, please visit the [official website](http://raw.densitydesign.org). For any specific request or comment we suggest you to use Github or the [Google group](https://groups.google.com/forum/#!forum/densitydesign-raw). If none of these worked for you, you can write us at <raw@densitydesign.org>.

Want to contribute to Raw's development? You are more than welcome! Just fork the repo and use Github's issues and pull requests.

##Acknowledgments

Azzurra Pini  
Marta Croce

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