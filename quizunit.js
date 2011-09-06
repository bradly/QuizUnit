// QuizUnit.js
// Copyright 2011 Bradly Feeley

var TestRuner = {
  'number_of_tests' : 0,
  'number_of_tests_passed' : 0,
  'number_of_tests_failed' : 0,
  'start_time' : null,
  'end_time' : null,
  'run_time' : null,
  'targets' : null,
  
  'ensure_test_target_has_tests' : function (test_target) {
    if (!test_target.hasOwnProperty('test_suite')) {
      throw('TestSuiteNotFoundException');
    }
  },
  
  'logger' : function (message) {
    // document.write(message + '<br />');
    // print(message);
    // $stdin(message);
    console.log(message);
  },
  
  'all_passed' : function () {
    this.logger('Good to go!');
  },
  
  'all_failed' : function () {
    this.logger('Oh noes!');
  },
  
  'test_passed' : function (test_name) {
    this.logger('.');
  },
  
  'test_failed' : function (test_name, expected, result) {
    this.logger('`' + test_name + '` failed: expected `' + expected + '`, but got `' + result + '`');
  },
  
  'complete' : function () {
    this.logger(this.number_of_tests + ' tests run in ' + this.run_time + ' seconds.');
    this.logger(this.number_of_tests_passed + ' passed, ' + this.number_of_tests_failed + ' failed.');
  },
  
  'start' : function () {
    this.logger('Running ' + this.number_of_tests + ' tests...');
  },
  
  'run_test' : function (test_name, test_case) {
    var error = null;
    var result = null;
    var expected = test_case[1];

    try {
      result = test_case[0]();
    } catch (exception) {
      error = exception;
    }

    if (result === expected) {
      this.test_passed();
      this.number_of_tests_passed += 1;
    } else {
      this.number_of_tests_failed += 1;
      this.test_failed(test_name, expected, (error || result));
    }
  },
  
  'run_tests' : function (test_target) {
    this.ensure_test_target_has_tests(test_target);
    this.number_of_tests_failed = 0;
    this.start_time = (new Date()).getTime();
    this.number_of_tests = Object.keys(test_target.test_suite).length;
    
    var test_suite = test_target.test_suite;
    var test_case = null;
  
    for (test_name in test_suite) {
      if (test_suite.hasOwnProperty(test_name) && test_name.match(/^should/)) {
        this.run_test( test_name, test_target.test_suite[test_name] );
      }
    }
    
    this.end_time = (new Date()).getTime();
    this.run_time = (this.end_time - this.start_time) / 1000.0;
    this.number_of_tests = this.number_of_tests_passed + this.number_of_tests_failed;
    
    if ( this.number_of_failed == 0 ) {
      this.all_passed();
    } else if ( this.number_of_tests_passed == 0 ) {
      this.all_failed();
    }
    
    this.complete();
  }
};