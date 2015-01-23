# postcss-simple-mixin

A [PostCSS](https://github.com/postcss/postcss) plugin to enable *simple* mixins in CSS (no arguments, no nesting).

With these mixins at your disposal, you can **clone declarations from an abstract definition into any rule set that follows**.

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

Some guidelines to obey (violations should throw errors):
- Definitions must be at the root level.
- Definitions can only contain declarations (and comments): no `Rule` nodes.
- Comments are ok in definitions but are not copied: only declarations are copied.

### Use a Mixin

Use the at-rule `@simple-mixin-include` to include you mixin with in a rule set. For example:

```css
.bar {
  @simple-mixin-include foo;
  font-size: 40em;
}
```

Some guidelines to obey (violations should throw errors):
- Includes must *not* be at the root level.
- Mixins must be defined *before* they are included.

### Plug it in to PostCSS

Just like any other PostCSS. There are no frills and no options, so it should be straightforward. For example:

```js
var fs = require('fs');
var postcss = require('postcss');
var simpleMixin = require('postcss-simple-mixin');

var inputCss = fs.readFileSync('input.css', 'utf8');

var outputCss = postcss()
  .use(simpleMixin())
  .process(inputCss)
  .css;

console.log(outputCss);
```

Or take advantage of [any of the myriad other ways to consume PostCSS](https://github.com/postcss/postcss#usage).

## Disclaimer

This is a *simple* mixin plugin. It does not reproduce the mixin functionality available in Sass or Less: it is *intentionally* limited. Please do not file issues asking for parameters, nested includes, or other fancier features. This simple plugin simply clones declarations from a definition into a rule set.
