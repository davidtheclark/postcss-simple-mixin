'use strict';

var fs = require('fs');
var postcss = require('postcss');
var test = require('tape');
var simpleMixin = require('..');

function fixturePath(name) {
  return 'test/fixtures/' + name + '.css';
}

function fixture(name) {
  return fs.readFileSync(fixturePath(name), 'utf8').trim();
}

function compareFixtures(t, name) {
  var actualCss = postcss(simpleMixin)
    .process(fixture(name), { from: fixturePath(name) })
    .css
    .trim();

  fs.writeFile(fixturePath(name + '.actual'), actualCss);

  var expectedCss = fixture(name + '.expected');

  return t.equal(
    actualCss,
    expectedCss,
    'processed fixture ' + name + ' should be equal to expected output'
  );
}

test('basically works', function(t) {
  compareFixtures(t, 'basic');
  compareFixtures(t, 'readmeexample');
  t.end();
});

test('works for multiline mixins stuck between declarations', function(t) {
  compareFixtures(t, 'multiline');
  t.end();
});

test('accepts but does not copy comments', function(t) {
  compareFixtures(t, 'comments');
  t.end();
});

function processCss(css) {
  return function() {
    return postcss(simpleMixin).process(css).css;
  };
}

test('throws location error', function(t) {

  var nonrootDefine = '.foo { @simple-mixin-define bar { background: pink; } }';
  t.throws(
    processCss(nonrootDefine),
    /must be at the root level/,
    'throws an error if definition is in non-root node'
  );

  var rootInclude = '@simple-mixin-include bar;';
  t.throws(
    processCss(rootInclude),
    /cannot be at the root level/,
    'throws an error if include is in the root node'
  );

  t.end();
});

test('throws illegal nesting error', function(t) {
  var defineWithRule = '@simple-mixin-define foo { .bar { background: pink; } }';
  t.throws(
    processCss(defineWithRule),
    /cannot contain rules/,
    'throws an error if definition contains a rule'
  );
  t.end();
});

test('throws include-without-definition error', function(t) {

  var includeUndefinedMixin = '.bar { @simple-mixin-include foo; }';
  t.throws(
    processCss(includeUndefinedMixin),
    /is not \(yet\) defined/,
    'throws an error if include refers to undefined mixin'
  );

  var includeNotYetDefinedMixin = (
    '.bar { @simple-mixin-include foo; }' +
    '@simple-mixin-define { background: pink; }'
  );
  t.throws(
    processCss(includeNotYetDefinedMixin),
    /is not \(yet\) defined/,
    'throws an error if include refers to not-yet-defined mixin'
  );

  t.end();
});
