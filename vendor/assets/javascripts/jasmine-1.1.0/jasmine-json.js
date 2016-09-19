jasmine.JSONReporter = function(doc) {
  this.document = doc || document;
  this.suiteDivs = {};
  this.logRunningSpecs = false;
};

//Counter of succes and failures
var runnerResult = [];
jasmine.JSONReporter.prototype.reportRunnerResults = function(runner) {
  var results = runner.results();
  var status = (results.failedCount > 0) ? false : true;
  var specs = runner.specs();
  var specCount = 0;
  for (var i = 0; i < specs.length; i++) {
    if (this.specFilter(specs[i])) {
      specCount++;
    }
  }
  // With specs
  //runnerResult = {passed:status,failed:results.failedCount, total:specCount, specs: specs };
  runnerResult = {passed:status,failed:results.failedCount, total:specCount};
};

//report of passed  and failed unit test
var UTResults = new Array();
jasmine.JSONReporter.prototype.reportSpecResults = function(spec) {
  var results = spec.results();
  var obj = {title:spec.getFullName(),description:spec.description, passed:results.passed() };
  UTResults.push(obj);
};

jasmine.JSONReporter.prototype.getLocation = function() {
  return this.document.location;
};

jasmine.JSONReporter.prototype.specFilter = function(spec) {
  var paramMap = {};
  var params = this.getLocation().search.substring(1).split('&');
  for (var i = 0; i < params.length; i++) {
    var p = params[i].split('=');
    paramMap[decodeURIComponent(p[0])] = decodeURIComponent(p[1]);
  }

  if (!paramMap.spec) {
    return true;
  }
  return spec.getFullName().indexOf(paramMap.spec) === 0;
};

setTimeout(function() {
  console.log(UTResults)
}, 2000);
setTimeout(function() {
  console.log(runnerResult)
}, 2000);
