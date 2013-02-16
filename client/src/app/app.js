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
