## About

**RAWGraphs** is an open web tool to create custom vector-based visualizations on top of the amazing [d3.js](https://github.com/mbostock/d3) library.
It has been developed by [DensityDesign Research Lab](http://www.densitydesign.org/) ([Politecnico di Milano](http://www.polimi.it/)), [Calibro](http://calib.ro/) and [INMAGIK](https://inmagik.com/).

Primarily conceived as a tool for designers and vis geeks, RAWGraphs aims at providing a missing link between spreadsheet applications (e.g. LibreOffice Calc, Microsoft Excel, Apple Numbers, Google Docs, …) and vector graphics editors (e.g. Inkscape, Adobe Illustrator, …).

RAWGraphs works with [tabular data](<https://en.wikipedia.org/wiki/Table_(information)>) (e.g. spreadhseets and comma-separated values) as well as with copied-and-pasted texts from other applications. Based on the [SVG](http://en.wikipedia.org/wiki/Svg) format, visualizations can be easily edited with vector graphics applications for further refinements, or directly embedded into web pages.

Knowing the need of working with sensitive information, the data injected into RAWGraphs is processed only by the web browser: **no server-side operations or storages are performed** and no one will see, touch or copy your data!

RAWGraphs is also highly customizable and extensible, accepting new custom layouts defined by users. For more information about how to add or edit layouts, see the [Developer Guide](https://github.com/rawgraphs/raw/wiki/Developer-Guide).

- App page: [app.rawgraphs.io](http://app.rawgraphs.io)
- Project official page: [rawgraphs.io](http://rawgraphs.io)
- Google group: [groups.google.com/forum/#!forum/densitydesign-raw](https://groups.google.com/forum/#!forum/densitydesign-raw)

## Usage

The easiest way to use RAWGraphs is by accessing the most updated version on the **[official app page](http://app.rawgraphs.io)**. However, RAWGraphs can also run locally on your machine: see the installation instructions below to know how.

## Installation

If you want to run your instance of RAWGraphs locally on your machine, be sure you have the following requirements installed. the following guide is meant for intermediate users (you will have to open your console and type some commands, it's better it you konw what you are doing).

### Requirements

- [GIT](https://git-scm.com/book/en/v2/Getting-Started-Installing-Git) (coould be used through the interface of [GitHub Desktop](https://desktop.github.com/))
- [Node.js](https://nodejs.org/en/)
- [Yarn](https://yarnpkg.com/getting-started/install)

### Instructions

1. Clone the rawgraphs-app repository
2. open the terminal (on Mac) or command prompt (on Windows) and browse to the flower containing the project
3. Install needed dependencies typing the command `yarn install`
4. Run the program locally in development mode: `yarn start`

You can build your own version and upload on your server by running the command `yarn build`.

## Contributing

Want to contribute to RAWGraphs's development? You are more than welcome! Start by forking the repository (the "Fork" button at the top-right corner of this page) and follow the instructions above to clone it and install dependencies. Then you can use Github's issues and pull requests to discuss and share your work.
You will need to sign a [Contributor License Agreement (CLA)](https://en.wikipedia.org/wiki/Contributor_License_Agreement) before making a submission. We adopted CLA to be sure that the project will remain open source. For more information, write us: <hello@rawgraphs.io>.

## Publications / Citing RAWGraphs

If you have found RAWGraphs useful in your research, or if you want to reference it in your work, please consider to cite the paper we presented at [CHItaly 2017](http://sites.unica.it/chitaly2017/).

you can read the full article in Green Open Access at the following link:

![oa icon](http://dl.acm.org/images/oa.gif) [RAWGraphs: A Visualisation Platform to Create Open Outputs](http://rawgraphs.io/about/#cite)

Cite RAWGraphs:

> Mauri, M., Elli, T., Caviglia, G., Uboldi, G., & Azzi, M. (2017). RAWGraphs: A Visualisation Platform to Create Open Outputs. In _Proceedings of the 12th Biannual Conference on Italian SIGCHI Chapter_ (p. 28:1–28:5). New York, NY, USA: ACM. https://doi.org/10.1145/3125571.3125585

Bibtex:

```
@inproceedings{Mauri:2017:RVP:3125571.3125585,
 author = {Mauri, Michele and Elli, Tommaso and Caviglia, Giorgio and Uboldi, Giorgio and Azzi, Matteo},
 title = {RAWGraphs: A Visualisation Platform to Create Open Outputs},
 booktitle = {Proceedings of the 12th Biannual Conference on Italian SIGCHI Chapter},
 series = {CHItaly '17},
 year = {2017},
 isbn = {978-1-4503-5237-6},
 location = {Cagliari, Italy},
 pages = {28:1--28:5},
 articleno = {28},
 numpages = {5},
 url = {http://doi.acm.org/10.1145/3125571.3125585},
 doi = {10.1145/3125571.3125585},
 acmid = {3125585},
 publisher = {ACM},
 address = {New York, NY, USA},
 keywords = {Visualization tools, data visualization, open output, visual interface},
}
```

## License

RAWGraphs is provided under the [Apache License 2.0](https://github.com/rawgraphs/rawgraphs-frontend/blob/master/LICENSE):

    Copyright (c), 2013-2019 DensityDesign Lab, Calibro, INMAGIK <hello@rawgraphs.io>
    
    Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with the License.
    You may obtain a copy of the License at
    
    	http://www.apache.org/licenses/LICENSE-2.0
    
    Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
    See the License for the specific language governing permissions and limitations under the License.
