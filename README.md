# RAW

![image](http://www.densitydesign.org/wp-content/themes/whiteasmilk/img/logo.png)

Raw is a web tool developed at the [DensityDesign Research Lab](http://www.densitydesign.org) (Politecnico di Milano) to create customizable vector-based visualizations of multivariate datasets, using the amazing [d3.js](https://github.com/mbostock/d3) library.
Primarily conceived as a production tool for designers, Raw aims at providing **a missing link**  between spreadsheet applications (e.g. Microsoft Excel, Apple Numbers, OpenRefine) and vector graphics editors (e.g. Adobe Illustrator, Adobe InDesign, CorelDRAW).

Currently, Raw accepts **delimiter-separated values** (i.e. csv and tsv files) as well as **copied-and-pasted texts** by other applications (e.g. Microsoft Excel). Based on [svg](http://en.wikipedia.org/wiki/Svg) format, visualizations can be easily imported in and edited by vector graphics applications for further refinements, or directly embedded into web pages.

Intended to be used also with sensitive information, the data uploaded to Raw will be processed only by the web browser: no server-side operation or storage will be performed.

Raw is also highly customizable and extensible, accepting new custom layouts defined by users. For more information about how to add or edit layouts, see the Documentation section.


##Usage
The easiest way to use Raw is by accessing the most updated version on the [official website](http://app.raw.densitydesign.org). However, as a Node.js app, Raw can also run locally on your machine. 

##How to install and run Raw on your machine
If you want to run your instance of Raw locally on your machine, [download](https://github.com/densitydesign/raw/archive/master.zip) or [clone](github-mac://openRepo/https://github.com/densitydesign/raw) this repository and follow these instructions:

- Be sure you have [Node.js](http://dnodejs.org/) installed, otherwise [download](http://nodejs.org/download/) and install it.
- Enter the repository, install the dependencies and start the app:

		cd raw
		npm install
		npm start


- Browse the app at <http://localhost:4000>

##Documentation and Support

Documentation and FAQs about how to use Raw can be found on the [offical website](http://raw.densitydesign.org). Development documentation will be available soon on the Wiki of this repository. Sorry for this.


##Libraries

Raw has been developed using a lot of cool stuff available out there:

[angular.js](https://github.com/angular/angular.js)  
[angular-ui](https://github.com/angular-ui)  
[Blob.js](https://github.com/eligrey/Blob.js)  
[bootstrap](https://github.com/twbs/bootstrap)  
[bootstrap-colorpicker](http://www.eyecon.ro/bootstrap-colorpicker/)  
[bootstrap-select](https://github.com/silviomoreto/bootstrap-select)  
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


##Roadmap

- Improve documentation
- Simplify the creation of layouts through reusable charts
- PDF export

##Team and Contacts

Raw has been developed and maintained at DensityDesign Research Lab by:
 
Giorgio Caviglia <giorgio.caviglia@polimi.it>  
Michele Mauri <michele.mauri@polimi.it>  
Giorgio Uboldi <giorgio.uboldi@polimi.it>  
Matteo Azzi <matteo.azzi@polimi.it>  
Azzurra Pini <azzurra.pini@polimi.it>  

**Want to contribute? You are more than welcome! Just fork the repo and create issues and pull requests!**

If you want to know more about Raw, how it works and future developments, please visit the [offical website](http://raw.densitydesign.org). For any specific request or comment we suggest you to use Github or the [Google group](http://). If none of these worked for you, you can write us at <raw@densitydesign.org>.


##License

Raw is provided under the LGPL (Lesser General Public License) v.3:

> Copyright (c), 2013 DensityDesign Lab, Giorgio Caviglia, Michele Mauri,
> Giorgio Uboldi, Matteo Azzi and Azzurra Pini
> 
> <info@densitydesign.org>  
> <giorgio.caviglia@polimi.it>  
> <michele.mauri@polimi.it>  
> <giorgio.uboldi@polimi.it>  
> <matteo.azzi@polimi.it>  
> <azzurra.pini@polimi.it>  
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