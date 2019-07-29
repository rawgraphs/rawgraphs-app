# ui-template directives

#### NOTE: This template is going to be replaced in very near future ###

These directives are boilerplates for creating your own directives. 

## Usage

Add the template module as a dependency to your application module:

    var myAppModule = angular.module('MyApp', ['ui.directives.template'])

Apply the directive to your html elements:

    <span ui-template num="SomeNumber"></span>

Default styles are in angular-ui.css and are pretty boring, you could just override these in your
stylesheet and make things more interesting

### Options

All the options can be passed through the directive or set on the html element. 
NOTE: attributes override controller options

	myAppModule.controller('MyController', function($scope) {
	    $scope.SomeNumber = 123;
		$scope.uiTemplateOptions = {

		};
	});

    // two-way binding with default for scoped.options uiTemplateOptions
    <span ui-template ng-model="SomeNumber"></span> 
    
    // one way binding with your own name for scoped options
    <span ui-template options="myOptions" num="SomeNumber"></span>
    

### Notes

ui-template
    - one-way binding unless you have in an ng-repeat
    - does not currently work with ng-model. 
    - is supported only for attribute style elements
    
### Todo
    - support ng-model
    