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
