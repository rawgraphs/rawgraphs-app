# [AngularStrap](http://mgcrea.github.io/angular-strap)

[![Bower Version](http://img.shields.io/bower/v/angular-strap.svg?style=flat)](https://github.com/mgcrea/angular-strap/releases) [![Build Status](http://img.shields.io/travis/mgcrea/angular-strap/master.svg?style=flat)](http://travis-ci.org/mgcrea/angular-strap) [![devDependency Status](http://img.shields.io/david/dev/mgcrea/angular-strap.svg?style=flat)](https://david-dm.org/mgcrea/angular-strap#info=devDependencies) [![Coverage Status](http://img.shields.io/codeclimate/coverage/github/mgcrea/angular-strap.svg?style=flat)](https://codeclimate.com/github/mgcrea/angular-strap) [![Climate Status](https://img.shields.io/codeclimate/github/mgcrea/angular-strap.svg?style=flat)](https://codeclimate.com/github/mgcrea/angular-strap)

[![Banner](http://mgcrea.github.io/angular-strap/images/snippet.png)](http://mgcrea.github.io/angular-strap)

AngularStrap is a set of native directives that enables seamless integration of [Bootstrap 3.0+](https://github.com/twbs/bootstrap) into your [AngularJS 1.2+](https://github.com/angular/angular.js) app.

- With no external dependency except the [Bootstrap CSS Styles](https://github.com/twbs/bootstrap/blob/master/dist/css/bootstrap.css), AngularStrap is lighter and faster than ever as it does leverage the power of ngAnimate from AngularJS 1.2+!

- AngularStrap is [tested](https://travis-ci.org/mgcrea/angular-strap) against the latest patch release of the 1.2, 1.3, 1.4 and 1.5 branches.

- If you don't want to use `ngAnimate`, you will have to include a tiny [ngAnimate mock](https://github.com/mgcrea/angular-strap/wiki/ngAnimate-mock).


## Documentation and examples

+ Check the [documentation](http://mgcrea.github.io/angular-strap) and [changelog](https://github.com/mgcrea/angular-strap/releases).


## Communication

- If you **need help**, use [Stack Overflow](http://stackoverflow.com/questions/tagged/angular-strap). (Tag 'angular-strap')
- If you'd like to **ask a general question**, use [Stack Overflow](http://stackoverflow.com/questions/tagged/angular-strap).
- If you **found a bug**, open an issue.
- If you **have a feature request**, open an issue.
- If you **want to contribute**, submit a pull request.


## Quick start

+ Install AngularStrap with [Bower](https://github.com/bower/bower).

>
```bash
$ bower install angular-strap --save
```

+ Include the required libraries in your `index.html`:

>
``` html
<script src="bower_components/angular/angular.js"></script>
<script src="bower_components/angular-animate/angular-animate.js"></script>
<script src="bower_components/angular-strap/dist/angular-strap.min.js"></script>
<script src="bower_components/angular-strap/dist/angular-strap.tpl.min.js"></script>
```

+ Inject the `mgcrea.ngStrap` module into your app:

>
``` js
angular.module('myApp', ['ngAnimate', 'mgcrea.ngStrap']);
```


## Developers

Clone the repo, `git clone git://github.com/mgcrea/angular-strap.git`, [download the latest release](https://github.com/mgcrea/angular-strap/zipball/master) or install with bower `bower install angular-strap --save`.

You will need to have bower installed globally into your node environment.

>
```bash
$ npm install -g bower
```

AngularStrap is tested with `karma` against the latest stable release of AngularJS.

> AngularStrap uses gulp@4.0, you must use the local gulp instance with `$(npm bin)/gulp` for it to work (or use an alias).

>
```bash
$ npm install
$ bower install
$ cd docs
$ bower install
$ cd ..
$ npm test
# or
$ npm run test:watch
```

You can build the latest version using `gulp`.

>
```bash
$ $(npm bin)/gulp build
```

You can quickly hack around (the docs) with:

>
```bash
  $ $(npm bin)/gulp serve
```

You can browse to http://localhost:9090/dev.html to work on a specific directive.

## Contributing

Please submit all pull requests the against master branch. If your pull request contains JavaScript patches or features, you should include relevant unit tests.
Please check the [Contributing Guidelines](https://github.com/mgcrea/angular-strap/blob/master/CONTRIBUTING.md) for more details.
Thanks!


## Authors

**Olivier Louvignes**

+ http://olouv.com
+ http://github.com/mgcrea


## Copyright and license

```
The MIT License

Copyright (c) 2012 – 2015 Olivier Louvignes

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.
```
