function simpleMixin(css) {
  var DEFINING_AT_RULE = 'simple-mixin-define';
  var INCLUDING_AT_RULE = 'simple-mixin-include';
  var availableMixins = {};

  css.eachAtRule(function(atRule) {
    if (atRule.name === DEFINING_AT_RULE) {
      processDefinition(atRule);
    }
  });

  css.eachRule(function(rule) {
    rule.eachAtRule(function(atRule) {
      if (atRule.name === INCLUDING_AT_RULE) {
        processInclusion(atRule, rule);
      }
    });
  });

  function processDefinition(atRule) {
    availableMixins[atRule.params] = atRule;
    atRule.removeSelf();
  }

  function processInclusion(atRule, rule) {
    var targetMixin = atRule.params;
    if (availableMixins[targetMixin]) {
      availableMixins[targetMixin].eachDecl(function(decl) {
        rule.insertBefore(atRule, decl);
      });
      atRule.removeSelf();
    }
  }

  return css;
}

module.exports = simpleMixin;
