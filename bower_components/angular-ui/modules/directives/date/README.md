# ui-date directive

This directive allows you to add a date-picker to your form elements.

# Requirements

- JQuery
- JQueryUI
- [Date.toISOString()](https://developer.mozilla.org/en-US/docs/JavaScript/Reference/Global_Objects/Date/toISOString) (requires [polyfill](https://github.com/kriskowal/es5-shim/) for &le;IE8)

# Usage

Load the script file in your application:

    <script type="text/javascript" src="angular-ui.js"></script>

Add the date module as a dependency to your application module:

    var myAppModule = angular.module('MyApp', ['ui.directives'])

Apply the directive to your form elements:

    <input ui-date name="DateOfBirth"></input>

## Options

All the jQueryUI DatePicker options can be passed through the directive.

	myAppModule.controller('MyController', function($scope) {
		$scope.dateOptions = {
			changeYear: true,
			changeMonth: true,
			yearRange: '1900:-0'
		};
	});

    <input ui-date="dateOptions" name="DateOfBirth"></input>

## Static Inline Picker

If you want a static picker then simply apply the directive to a div rather than an input element.

    <div ui-date="dateOptions" name="DateOfBirth"></div>

# Working with ng-model

The ui-date directive plays nicely with ng-model and validation directives such as ng-required.

If you add the ng-model directive to same the element as ui-date then the picked date is automatically synchronized with the model value.

_The ui-date directive stores and expects the model value to be a standard javascript Date object._

## ui-date-format directive
The ui-date directive only works with Date objects.
If you want to pass date strings to and from the date directive via ng-model then you must use the ui-date-format directive.
This directive specifies the format of the date string that will be expected in the ng-model.
The format string syntax is that defined by the JQueryUI Date picker. For example

    <input ui-date ui-date-format="DD, d MM, yy" ng-model="myDate"></input>

Now you can set myDate in the controller.

    $scope.myDate = "Thursday, 11 October, 2012";

## ng-required directive

If you apply the required directive to element then the form element is invalid until a date is picked.

Note: Remember that the ng-required directive must be explictly set, i.e. to "true".  This is especially true on divs:

    <div ui-date="dateOptions" name="DateOfBirth" ng-required="true"></div>


