[![Build Status](https://travis-ci.org/davidtheclark/postcss-simple-mixin.svg?branch=master)](https://travis-ci.org/davidtheclark/postcss-simple-mixin)

# postcss-simple-mixin

A [PostCSS](https://github.com/postcss/postcss) plugin to enable *simple* mixins in CSS.

(simple = no arguments, no nesting, no monkey business)

With these mixins at your disposal, you can **clone declarations from an abstract definition into any rule set that follows**.

*This plugin is compatible with PostCSS v4+.*

> **A Note on mixins & extends**: Mixins copy declarations from an abstract definition into a concrete rule set. Extends clone a concrete rule set's selector(s) and add them an extendable rule set that you have defined. *This* plugin enables simple mixins. If you would like to use extends, as well --- or instead --- have a look at [`postcss-simple-extend`](https://github.com/davidtheclark/postcss-simple-extend).

## Example Input-Output

Input:
```css
@simple-mixin-define pinkify {
  background: pink;
}

body {
  @simple-mixin-include pinkify;
}

.outer-thing {
  background: orange;
}

.inner-thing {
  @simple-mixin-include pinkify;
}
```

Output:
```css
body {
  background: pink;
}

.outer-thing {
  background: orange;
}

.inner-thing {
  background: pink;
}
```

## Usage

### Define a Mixin

Use the at-rule `@simple-mixin-define` to define your mixin. For example:

```css
@simple-mixin-define foo {
  background: black;
  color: white;
}
```

`@simple-mixin-define` statements will be removed entirely from the generated CSS.

Some defining guidelines to obey (violations should throw errors):
- Definitions must occur at the root level (i.e. not inside statements, such as rule sets or `@media` statements).
- Definitions should only contain declarations (and comments): no statements.
- Comments are ok in definitions but are not copied: only declarations are copied.

### Include a Mixin

Use the at-rule `@simple-mixin-include` to include your mixin in a rule set. For example:

```css
.bar {
  @simple-mixin-include foo;
  font-size: 40em;
}
```

Some including guidelines to obey (violations should throw errors):
- Includes must *not* occur at the root level. They must occur inside a rule set.
- Mixins must be defined *before* they are included.

### Plug it in to PostCSS

Plug it in just like any other PostCSS plugin. There are no frills and no options, so integration should be straightforward. For example (as a node script):

```js
var fs = require('fs');
var postcss = require('postcss');
var simpleMixin = require('postcss-simple-mixin');

var inputCss = fs.readFileSync('input.css', 'utf8');

var outputCss = postcss()
  .use(simpleMixin)
  // or .use(simpleMixin())
  .process(inputCss)
  .css;

console.log(outputCss);
```

Or take advantage of [any of the myriad other ways to consume PostCSS](https://github.com/postcss/postcss#usage), and follow the plugin instructions they provide.

## Disclaimer

This is a *simple* mixin plugin. It does not reproduce the mixin functionality available in Sass or Less: it is *intentionally* limited. Please do not file issues asking for parameters, nested includes, or other fancier features. This simple plugin simply clones declarations from a definition into a rule set.
