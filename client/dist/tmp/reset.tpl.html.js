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
