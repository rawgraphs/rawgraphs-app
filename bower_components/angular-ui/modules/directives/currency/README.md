# ui-currency directive

This directive gives greater control over your currency elements by allowing you to set CSS styles based on the number's sign. 
In angular, you are only able to specify what the currency symbol is (however, you might not want to change it for localization). 
						
## Usage

Apply the directive to your html elements:

	myAppModule.controller('MyController', function($scope) {
	    $scope.SomeNumber = 123;
	});

      <span ui-currency ng-model="SomeNumber"></span>

Default styles are in angular-ui.css and are pretty boring, you could just override these in your
stylesheet and make things most excellent (e.g. increasing size for negatives, doing a hover sorta thingy )

  .ui-currency-pos {
    color: green;
  }
  .ui-currency-neg {
    color: red;
  }
  .ui-currency-zero {
    color: blue;
  }
  .ui-currency-pos.ui-bignum, .ui-currency-neg.ui-smallnum {
    font-size: 110%;
  }

### Options

All the options can be controlled by ui.config (see Global Defaults) or passed in the ui-currency attribute on the declaration. 
The symbol attribute defaults to null and is then controlled by the default locale settings. 

    <span ui-currency="{ pos='pstyle' neg='nstyle' zero='zstyle' symbol='USD$' bignum='1000' smallnum='-1000'}" ng-model="SomeNumber" ></span>

If the model is greater than or equal to 1000 add ui-bignum to css class, if less than or equal to -1000 add ui-small num. If attr is-total attribute
is set the bignum/smallnum is not applied. This is useful if the options are global and you don't want totals to necessarily have these classes. 

### Notes

This directive wraps angular's currency filter. If that changes, you are on your own.
    
    