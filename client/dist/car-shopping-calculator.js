/*! car-shopping-calculator - v0.0.1-SNAPSHOT - 2013-02-15
* Copyright (c) 2013 Brian "Butch" Peters;
 Licensed  */

angular.module('app', ['templates']);

angular.module('app').config(['$routeProvider', '$locationProvider', function ($routeProvider, $locationProvider) {
    $routeProvider.when('/mem/:memId', {
       templateUrl: 'calculator.tpl.html',
       controller: 'CalculatorCtrl'
    });
    $routeProvider.when('/reset/confirm', {
        templateUrl: 'reset.tpl.html'
    });
    $routeProvider.when('/reset/doit', {
        template: '<div></div>',
        controller: 'ResetCtrl'
    });
    $routeProvider.otherwise({redirectTo:'/mem/1'});
}]);

angular.module('app').factory('FixedAttributes', ['$window', function ($window) {
    var defaults, FixedAttributes;
    
    defaults = {
      salesTax: 0.07,
      regGasPrice: 3.5,
      premGasPrice: 3.9,
      pctCity: 0.55,
      milesPerYear: 12000
    };
    
    FixedAttributes = function(values) {
        values = values || {};
        angular.extend(this, defaults, values);
    };

    FixedAttributes.load = function () {
        var data = {}, stored = $window.localStorage.getItem('fixedAttributes');
        if (stored) {
            data = angular.fromJson(stored);
        }
        return new FixedAttributes(data);
    };
    
    FixedAttributes.prototype.save = function () {
        $window.localStorage.setItem('fixedAttributes', angular.toJson(this));
    };
    
    FixedAttributes.prototype.toJson = function () {
        return angular.toJson(this);
    };
    
    FixedAttributes.prototype.resetToDefaults = function () {
        angular.extend(this, defaults);
    };
    
    return FixedAttributes.load();
}]);

angular.module('app').factory('Scenarios', ['Scenario', '$window', function (Scenario, $window) {
    var Scenarios = [], i;
    
    Scenarios.save = function (memId) {
        $window.localStorage.setItem('mem' + memId, angular.toJson(this[memId]));
    };
    
    Scenarios.load = function (memId) {
        var data = {}, stored = $window.localStorage.getItem('mem' + memId);
        if (stored) {
            data = angular.fromJson(stored);
        }
        return new Scenario(data);
    };
    
    Scenarios.reload = function() {
        for (i = 0; i < 6; i++) {
            Scenarios[i] = Scenarios.load(i);
        }
    };

    Scenarios.reload();
    
    return Scenarios;
}]);

angular.module('app').factory('Scenario', ['FixedAttributes', function (fixed) {

  var defaults, Scenario;
  
  defaults = {
    basePrice: 20000,
    preTaxFees: 200,
    postTaxFees: 120,
    tradeIn: 1000,
    incentives: 1000,
    downPayment: 1000,
    loanTerm: 72,
    apr: 0.06,
    mpgCity: 20,
    mpgHwy: 30,
    usesPremium: false
  };
  
  Scenario = function(values) {
      values = values || {};
      angular.extend(this, defaults, values);
  };
  
  Scenario.prototype.taxablePrice = function () {
      return this.basePrice + this.preTaxFees - this.tradeIn;
  };
  
  Scenario.prototype.tax = function () {
      return this.taxablePrice() * fixed.salesTax;
  };
  
  Scenario.prototype.subTotal = function () {
      return this.taxablePrice() + this.tax() + this.postTaxFees;
  };
  
  Scenario.prototype.principal = function () {
      return this.subTotal() - this.incentives - this.downPayment;
  };
  
  Scenario.prototype.monthlyPayment = function() {
      var r = this.apr/12, pv = this.principal(), n = this.loanTerm;
      return (r * pv)/(1 - Math.pow(1 + r, -n));
  };
  
  Scenario.prototype.loanToValue = function () {
      return (this.principal() / this.basePrice) * 100;
  };
  
  Scenario.prototype.totalLoanAmount = function () {
      return this.monthlyPayment() * this.loanTerm;
  };
  
  Scenario.prototype.totalAmountPaid = function () {
      return this.totalLoanAmount() + this.downPayment;
  };
  
  Scenario.prototype.totalInterestPaid = function () {
      return this.totalLoanAmount() - this.principal();
  };
  
  Scenario.prototype.combinedMpg = function () {
      var pctCity = fixed.pctCity,
          pctHwy = 1 - pctCity;
      
      return 1/((fixed.pctCity/this.mpgCity)+(pctHwy/this.mpgHwy));
  };
  
  Scenario.prototype.fuelCost = function () {
      return this.usesPremium ? fixed.premGasPrice : fixed.regGasPrice;
  };
  
  Scenario.prototype.gasPricePerYear = function () {
      return (this.fuelCost() * fixed.milesPerYear)/this.combinedMpg();
  };
  
  return Scenario;
}]);

angular.module('app').controller('CalculatorCtrl', ['$scope', 'Scenarios', 'FixedAttributes', '$routeParams', function ($scope, Scenarios, fixed, $routeParams) {
    $scope.memId = Number($routeParams.memId) - 1;
	$scope.scenario = Scenarios[$scope.memId];
	$scope.tabs = ['','','','','',''];
	$scope.tabs[$scope.memId] = 'active';
	
	$scope.$watch('scenario.monthlyPayment()', function () {
        Scenarios.save($scope.memId);
	});
	
	$scope.fixed = fixed;
	$scope.$watch('fixed.toJson()', function () {
        fixed.save();
	});
}]);

angular.module('app').controller('ResetCtrl', ['$window', '$location', 'Scenarios', function($window, $location, Scenarios) {
    $window.localStorage.clear();
    Scenarios.reload();
    $location.path('/');
}]);

angular.module("calculator.tpl.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("calculator.tpl.html",
    "<div class=\"row-fluid\">" +
    "    <div class=\"span12\">" +
    "        <ul class=\"nav nav-tabs\">" +
    "            <li ng-class='tabClass' ng-repeat='tabClass in tabs'>" +
    "                <a href=\"#/mem/{{$index+1}}\" data-toggle=\"tab\">{{$index+1}}</a>" +
    "            </li>" +
    "            <li>" +
    "                <a href=\"#/reset/confirm\" data-toggle=\"tab\">Reset</a>" +
    "            </li>" +
    "        </ul>" +
    "    </div>" +
    "</div>" +
    "<form class=\"form-horizontal\">" +
    "  <div class=\"row-fluid\">" +
    "    <div class=\"span12\">" +
    "      <div class=\"accordion\" id=\"mainAccordion\">" +
    "        <div class=\"accordion-group\">" +
    "          <div class=\"accordion-heading\">" +
    "            <a class=\"accordion-toggle\" data-toggle=\"collapse\" data-parent=\"#mainAccordion\" href=\"#fixedAttributes\">" +
    "              Fixed attributes" +
    "            </a>" +
    "          </div>" +
    "          <div id=\"fixedAttributes\" class=\"accordion-body collapse\">" +
    "            <div class=\"accordion-inner\">" +
    "              <div class=\"row-fluid\">" +
    "                <div class=\"span6\">" +
    "                  <div class=\"control-group\">" +
    "                    <label class=\"control-label\">Sales tax</label>" +
    "                    <div class=\"controls\">" +
    "                      <input type=\"number\" ng-model=\"fixed.salesTax\">" +
    "                    </div>" +
    "                  </div>" +
    "                  <div class=\"control-group\">" +
    "                    <label class=\"control-label\">% City driving</label>" +
    "                    <div class=\"controls\">" +
    "                      <input type=\"number\" ng-model=\"fixed.pctCity\">" +
    "                    </div>" +
    "                  </div>" +
    "                  <div class=\"control-group\">" +
    "                    <label class=\"control-label\">Miles / Year</label>" +
    "                    <div class=\"controls\">" +
    "                      <input type=\"number\" ng-model=\"fixed.milesPerYear\">" +
    "                    </div>" +
    "                  </div>" +
    "                </div>" +
    "                <div class=\"span6\">" +
    "                  <div class=\"control-group\">" +
    "                    <label class=\"control-label\">Regular gas</label>" +
    "                    <div class=\"controls\">" +
    "                      <input type=\"number\" ng-model=\"fixed.regGasPrice\">" +
    "                    </div>" +
    "                  </div>" +
    "                  <div class=\"control-group\">" +
    "                    <label class=\"control-label\">Premium gas</label>" +
    "                    <div class=\"controls\">" +
    "                      <input type=\"number\" ng-model=\"fixed.premGasPrice\">" +
    "                    </div>" +
    "                  </div>" +
    "                </div>" +
    "              </div>" +
    "              <div class=\"row-fluid\">" +
    "                <div class=\"span12\">" +
    "                    <a href=\"javascript:void(0)\" ng-click=\"fixed.resetToDefaults()\" class=\"btn btn-danger\">Reset fixed attributes</a>" +
    "                </div>" +
    "              </div>" +
    "            </div>" +
    "          </div>" +
    "        </div>" +
    "      </div>" +
    "    </div>" +
    "</div>" +
    "  <div class=\"row-fluid\">" +
    "    <div class=\"span6\">" +
    "      <div class=\"control-group\">" +
    "        <label class=\"control-label\"><span class=\"label label-important\">Base price</span></label>" +
    "        <div class=\"controls\">" +
    "          <input type=\"number\" ng-model=\"scenario.basePrice\">" +
    "        </div>" +
    "      </div>" +
    "      <div class=\"control-group\">" +
    "        <label class=\"control-label\"><span class=\"label label-important\">Pre-Tax fees</span></label>" +
    "        <div class=\"controls\">" +
    "          <input type=\"number\" ng-model=\"scenario.preTaxFees\">" +
    "        </div>" +
    "      </div>" +
    "      <div class=\"control-group\">" +
    "        <label class=\"control-label\"><span class=\"label label-important\">Trade-in value</span></label>" +
    "        <div class=\"controls\">" +
    "          <input type=\"number\" ng-model=\"scenario.tradeIn\">" +
    "        </div>" +
    "      </div>" +
    "    </div>" +
    "    <div class=\"span6\">" +
    "      <div class=\"control-group\">" +
    "        <label class=\"control-label\"><span class=\"label label-important\">Taxable Amount</span></label>" +
    "        <div class=\"controls\">" +
    "          <span class=\"label label-important\">{{scenario.taxablePrice() | currency}}</span>" +
    "        </div>" +
    "      </div>" +
    "      <div class=\"control-group\">" +
    "        <label class=\"control-label\"><span class=\"label label-important\">Tax</span></label>" +
    "        <div class=\"controls\">" +
    "          <span class=\"label label-important\">{{scenario.tax() | currency}}</span>" +
    "        </div>" +
    "      </div>" +
    "      <div class=\"control-group\">" +
    "        <label class=\"control-label\"><span class=\"label label-important\">Sub-Total</span></label>" +
    "        <div class=\"controls\">" +
    "          <span class=\"label label-important\">{{scenario.subTotal() | currency}}</span>" +
    "        </div>" +
    "      </div>" +
    "    </div>" +
    "  </div>" +
    "  <div class=\"row-fluid\">" +
    "    <div class=\"span6\">" +
    "      <div class=\"control-group\">" +
    "        <label class=\"control-label\"><span class=\"label label-warning\">Incentives</span></label>" +
    "        <div class=\"controls\">" +
    "          <input type=\"number\" ng-model=\"scenario.incentives\">" +
    "        </div>" +
    "      </div>" +
    "      <div class=\"control-group\">" +
    "        <label class=\"control-label\"><span class=\"label label-warning\">Post-Tax fees</span></label>" +
    "        <div class=\"controls\">" +
    "          <input type=\"number\" ng-model=\"scenario.postTaxFees\">" +
    "        </div>" +
    "      </div>" +
    "      <div class=\"control-group\">" +
    "        <label class=\"control-label\"><span class=\"label label-warning\">Down payment</span></label>" +
    "        <div class=\"controls\">" +
    "          <input type=\"number\" ng-model=\"scenario.downPayment\">" +
    "        </div>" +
    "      </div>" +
    "    </div>" +
    "    <div class=\"span6\">" +
    "      <div class=\"control-group\">" +
    "        <label class=\"control-label\"><span class=\"label label-warning\">Loan principal</span></label>" +
    "        <div class=\"controls\">" +
    "          <span class=\"label label-warning\">{{scenario.principal() | currency}}</span>" +
    "        </div>" +
    "      </div>" +
    "      <div class=\"control-group\">" +
    "        <label class=\"control-label\"><span class=\"label label-warning\">Loan-to-Value</span></label>" +
    "        <div class=\"controls\">" +
    "          <span class=\"label label-warning\">{{scenario.loanToValue() | number:2}}</span>" +
    "        </div>" +
    "      </div>" +
    "    </div>" +
    "  </div>" +
    "  <div class=\"row-fluid\">" +
    "    <div class=\"span6\">" +
    "      <div class=\"control-group\">" +
    "        <label class=\"control-label\"><span class=\"label label-success\">Loan APR</span></label>" +
    "        <div class=\"controls\">" +
    "          <input type=\"number\" ng-model=\"scenario.apr\">" +
    "        </div>" +
    "      </div>" +
    "      <div class=\"control-group\">" +
    "        <label class=\"control-label\"><span class=\"label label-success\">Loan term</span></label>" +
    "        <div class=\"controls\">" +
    "          <input type=\"number\" ng-model=\"scenario.loanTerm\">" +
    "        </div>" +
    "      </div>" +
    "    </div>" +
    "    <div class=\"span6\">" +
    "      <div class=\"control-group\">" +
    "        <label class=\"control-label\"><span class=\"label label-success\">Monthly payment</span></label>" +
    "        <div class=\"controls\">" +
    "          <span class=\"label label-success\">{{scenario.monthlyPayment() | currency}}</span>" +
    "        </div>" +
    "      </div>" +
    "      <div class=\"control-group\">" +
    "        <label class=\"control-label\"><span class=\"label label-success\">Total Loan Amount</span></label>" +
    "        <div class=\"controls\">" +
    "          <span class=\"label label-success\">{{scenario.totalLoanAmount() | currency}}</span>" +
    "        </div>" +
    "      </div>" +
    "      <div class=\"control-group\">" +
    "        <label class=\"control-label\"><span class=\"label label-success\">Total Amount Paid</span></label>" +
    "        <div class=\"controls\">" +
    "          <span class=\"label label-success\">{{scenario.totalAmountPaid() | currency}}</span>" +
    "        </div>" +
    "      </div>" +
    "      <div class=\"control-group\">" +
    "        <label class=\"control-label\"><span class=\"label label-success\">Total Interest Paid</span></label>" +
    "        <div class=\"controls\">" +
    "          <span class=\"label label-success\">{{scenario.totalInterestPaid() | currency}}</span>" +
    "        </div>" +
    "      </div>" +
    "    </div>" +
    "  </div>" +
    "  <div class=\"row-fluid\">" +
    "    <div class=\"span6\">" +
    "      <div class=\"control-group\">" +
    "        <label class=\"control-label\"><span class=\"label label-inverse\">MPG City</span></label>" +
    "        <div class=\"controls\">" +
    "          <input type=\"number\" ng-model=\"scenario.mpgCity\">" +
    "        </div>" +
    "      </div>" +
    "      <div class=\"control-group\">" +
    "        <label class=\"control-label\"><span class=\"label label-inverse\">MPG Highway</span></label>" +
    "        <div class=\"controls\">" +
    "          <input type=\"number\" ng-model=\"scenario.mpgHwy\">" +
    "        </div>" +
    "      </div>" +
    "      <div class=\"control-group\">" +
    "        <label class=\"control-label\"><span class=\"label label-inverse\">Premium Gas?</span></label>" +
    "        <div class=\"controls\">" +
    "          <input type=\"checkbox\" ng-model=\"scenario.usesPremium\">" +
    "        </div>" +
    "      </div>" +
    "    </div>" +
    "    <div class=\"span6\">" +
    "      <div class=\"control-group\">" +
    "        <label class=\"control-label\"><span class=\"label label-inverse\">Combined MPG</span></label>" +
    "        <div class=\"controls\">" +
    "          <span class=\"label label-inverse\">{{scenario.combinedMpg() | number:0}}</span>" +
    "        </div>" +
    "      </div>" +
    "      <div class=\"control-group\">" +
    "        <label class=\"control-label\"><span class=\"label label-inverse\">Gas price / year</span></label>" +
    "        <div class=\"controls\">" +
    "          <span class=\"label label-inverse\">{{scenario.gasPricePerYear() | currency}}</span>" +
    "        </div>" +
    "      </div>" +
    "    </div>" +
    "  </div>" +
    "</form>");
}]);

angular.module("reset.tpl.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("reset.tpl.html",
    "<div class=\"row-fluid\">" +
    "    <div class=\"span12\">" +
    "        <h3>Are you sure you want to reset all presets?</h3>" +
    "        <a href=\"#/reset/doit\" class=\"btn btn-danger\">Yes</a>" +
    "        <a href=\"#/\" class=\"btn\">No</a>" +
    "    </div>" +
    "</div>");
}]);

angular.module('templates', ['calculator.tpl.html', 'reset.tpl.html']);