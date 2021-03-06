"use strict";

var assert = require('assert').strict || require('assert');
var fs = require('fs');
var File = require('vinyl');
var inline = require('../index');
var join = require('path').join;
var viewFunction = function (path) {
  return path;
};


describe('gulp-inline-ng2-template', function () {
  it('should work with default config', function (done) {
    var paths = {
      TEST_FILE      : './test/fixtures/templates.js',
      RESULT_EXPECTED: './test/fixtures/result_expected.js',
      RESULT_ACTUAL  : './test/fixtures/result_actual.js'
    };

    runTest(paths, { base: 'test/fixtures' }, done);
  });

  it('should work with relative paths', function (done) {
    var paths = {
      TEST_FILE      : './test/fixtures/templates_relative.js',
      RESULT_EXPECTED: './test/fixtures/result_expected_relative.js',
      RESULT_ACTUAL  : './test/fixtures/result_actual_relative.js'
    };

    runTest(paths, { pug: true, useRelativePaths: true }, done);
  });

  it('should work with default config and one line options', function (done) {
    var paths = {
      TEST_FILE      : './test/fixtures/templates.js',
      RESULT_EXPECTED: './test/fixtures/result_expected_one_line.js',
      RESULT_ACTUAL  : './test/fixtures/result_actual_one_line.js'
    };

    runTest(paths, { base: 'test/fixtures', removeLineBreaks: true }, done);
  });

  it('should work with default config and templateUrl as a function', function (done) {
    var paths = {
      TEST_FILE      : './test/fixtures/templates_function.js',
      RESULT_EXPECTED: './test/fixtures/result_expected_function.js',
      RESULT_ACTUAL  : './test/fixtures/result_actual_function.js'
    };

    var OPTIONS = {
      base: 'test/fixtures',
      templateFunction: viewFunction
    };

    runTest(paths, OPTIONS, done);
  });

  it('should work with default config and remove the module id', function (done) {
    var paths = {
      TEST_FILE      :'./test/fixtures/templates_remove_module_id.js',
      RESULT_EXPECTED: './test/fixtures/result_expected_remove_module_id.js',
      RESULT_ACTUAL  : './test/fixtures/result_actual_remove_module_id.js'
    };

    var OPTIONS = {
      base: 'test/fixtures',
      removeModuleId: true
    };

    debugger;
    runTest(paths, OPTIONS, done);
  });

  it('should work with templates and styles processors', function (done) {
    var paths = {
      TEST_FILE      : './test/fixtures/templates_processors.js',
      RESULT_EXPECTED: './test/fixtures/result_expected_processors.js',
      RESULT_ACTUAL  : './test/fixtures/result_actual_processors.js'
    };

    var OPTIONS = {
      base: 'test/fixtures',
      useRelative: true,
      templateExtension: 'pug',
      templateProcessor: function (path, ext, file, cb) {
        return cb(null, require('pug').render(file));
      },
      styleProcessor: function (path, ext, file, cb) {
        return cb(null, require('stylus').render(file));
      }
    };

    runTest(paths, OPTIONS, done);
  });

  it('should work with templates and styles with backticks in them', function(done) {
    var paths = {
      TEST_FILE      : './test/fixtures/templates_unescaped.js',
      RESULT_EXPECTED: './test/fixtures/result_expected_unescaped.js',
      RESULT_ACTUAL  : './test/fixtures/result_actual_unescaped.js'
    };

    runTest(paths, { base: 'test/fixtures' }, done);
  });

  it('should work when templateUrl and styleUrl files do not exist', function(done) {
    var paths = {
      TEST_FILE      : './test/fixtures/templates_nonexistent_files.js',
      RESULT_EXPECTED: './test/fixtures/result_expected_nonexistent_files.js',
      RESULT_ACTUAL  : './test/fixtures/result_actual_nonexistent_files.js'
    };

    runTest(paths, { supportNonExistentFiles: true }, done);
  });

  it('should work with different quote marks', function (done) {
    var paths = {
      TEST_FILE      : './test/fixtures/templates_quotemark.js',
      RESULT_EXPECTED: './test/fixtures/result_expected_quotemark.js',
      RESULT_ACTUAL  : './test/fixtures/result_actual_quotemark.js'
    };

    runTest(paths, { base: 'test/fixtures' }, done);
  });

  it('should work with backticks', function (done) {
    var paths = {
      TEST_FILE      : './test/fixtures/templates_backtick.js',
      RESULT_EXPECTED: './test/fixtures/result_expected_backtick.js',
      RESULT_ACTUAL  : './test/fixtures/result_actual_backtick.js'
    };

    runTest(paths, { base: 'test/fixtures' }, done);
  });

  it('should work with template function and different quote marks', function (done) {
    var paths = {
      TEST_FILE      : './test/fixtures/templates_quotemark_function.js',
      RESULT_EXPECTED: './test/fixtures/result_expected_quotemark_function.js',
      RESULT_ACTUAL  : './test/fixtures/result_actual_quotemark_function.js'
    };

    var OPTIONS = {
      base: 'test/fixtures',
      templateFunction: viewFunction
    };

    runTest(paths, OPTIONS, done);
  });

  it('in ES6 mode, should escape JS string literal chars from html/css templates that would cause a problem in the final output', function( done ) {
    var paths = {
      TEST_FILE      : './test/fixtures/templates_bad_string_literal_chars.js',
      RESULT_EXPECTED: './test/fixtures/result_expected_bad_string_literal_chars_es6.js',
      RESULT_ACTUAL  : './test/fixtures/result_actual_bad_string_literal_chars_es6.js'
    };

    var OPTIONS = {
      base: 'test/fixtures'
    };

    runTest(paths, OPTIONS, done);
  });

  it('in ES5 mode, should escape JS string literal chars from html/css templates that would cause a problem in the final output', function( done ) {
    var paths = {
      TEST_FILE      : './test/fixtures/templates_bad_string_literal_chars.js',
      RESULT_EXPECTED: './test/fixtures/result_expected_bad_string_literal_chars_es5.js',
      RESULT_ACTUAL  : './test/fixtures/result_actual_bad_string_literal_chars_es5.js'
    };

    var OPTIONS = {
      base: 'test/fixtures',
      target: 'es5'
    };

    runTest(paths, OPTIONS, done);
  });



  it('should emit the "error" event to the stream if a templateProcessor calls the callback with an error', function( done ) {
    var jsFile = createFile('./test/fixtures/templates.js');

    var stream = inline({
      base: 'test/fixtures',
      templateProcessor: function(path, ext, file, callback) {
        callback('test-error');
      }
    });
    stream.on('error', function(errorReceived) {
      assert.strictEqual(errorReceived.message, 'test-error');
      done();
    });

    stream.write(jsFile);
  });

  it('should emit the "error" event to the stream if a styleProcessor calls the callback with an error', function( done ) {
    var jsFile = createFile('./test/fixtures/templates.js');

    var stream = inline({
      base: 'test/fixtures',
      styleProcessor: function(path, ext, file, callback) {
        callback('test-error');
      }
    });
    stream.on('error', function(errorReceived) {
      assert.strictEqual(errorReceived.message, 'test-error');
      done();
    });

    stream.write(jsFile);
  });

  describe('source maps', function() {
    var asserts;
    beforeEach(function() {
      var jsFile = createFile('./test/fixtures/templates.js');
      var originalFileContents = jsFile.contents.toString();
      var stream = inline({
        base: 'test/fixtures'
      });
      stream.once('data', function(file) { 
        asserts(file, originalFileContents);
      });  
      stream.write(jsFile);
    })
    it('should create a source map', function(done) {
      asserts = function(file) {
        assert.notEqual(file.sourceMap, null);
        assert.notEqual(file.sourceMap, undefined);
        assert.notEqual(file.sourceMap, "");
        done();
      }
    }),
    it('should create a source map with the correct sources', function(done){
      asserts = function(file) {
        assert.equal(file.sourceMap.sources.length, 1);
        assert.equal(file.sourceMap.sources[0], 'test/fixtures/someSrcFile');
        done();
      }
    }),
    it('should create a source map with the correct generated file name', function(done){
      asserts = function(file) {
        assert.equal(file.sourceMap.file, file.basename);
        done();
      }
    }),
    it('should create a source map with the correct source contents', function(done){
      asserts = function(file, originalFileContents){
        assert.equal(file.sourceMap.sourcesContent.length, 1);
        assert.equal(file.sourceMap.sourcesContent[0], originalFileContents);
        done();
      }
    })
  });
});



function runTest(paths, pluginOptions, done) {
  var jsFile = createFile(paths.TEST_FILE);

  var stream = inline(pluginOptions);
  stream.write(jsFile);

  stream.once('data', function(file) {
    var result = file.contents.toString();
    // Save the result in a file.
    fs.writeFileSync(paths.RESULT_ACTUAL, result, 'utf8');

    assert.strictEqual(
      result,
      fs.readFileSync(paths.RESULT_EXPECTED).toString()
    );
    done();
  });
}

function createFile(filePath) {
  return new File({
    contents: new Buffer(fs.readFileSync(filePath).toString()),
    path: join(process.cwd(), 'test/fixtures/someSrcFile')
  });
}
