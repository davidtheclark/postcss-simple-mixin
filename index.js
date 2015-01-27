'use strict';

function simpleMixin() {

  return function(css) {
    var DEFINING_AT_RULE = 'simple-mixin-define';
    var INCLUDING_AT_RULE = 'simple-mixin-include';
    var availableMixins = {};

    css.eachAtRule(function(atRule) {
      if (atRule.name === DEFINING_AT_RULE) {
        checkDefinitionLocation(atRule);
        processDefinition(atRule);
      } else if (atRule.name === INCLUDING_AT_RULE) {
        checkIncludeLocation(atRule);
        processInclusion(atRule);
      }
    });

    function processDefinition(atRule) {
      checkDefinitionNodes(atRule);
      availableMixins[atRule.params] = atRule;
      atRule.removeSelf();
    }

    function processInclusion(atRule) {
      var targetMixin = getMixin(atRule.params, atRule);
      targetMixin.eachDecl(function(decl) {
        atRule.parent.insertBefore(atRule, decl.clone());
      });
      atRule.removeSelf();
    }

    function getMixin(mixinIdent, node) {
      var targetMixin = availableMixins[mixinIdent];
      if (!targetMixin) {
        throw node.error(
          'Attempted to @' + INCLUDING_AT_RULE + ' `' + mixinIdent + '`, ' +
          'which is not (yet) defined'
        );
      }
      return targetMixin;
    }

    function checkDefinitionLocation(atRule) {
      if (atRule.parent.type !== 'root') {
        throw atRule.error(
          '@' + DEFINING_AT_RULE + ' must occur at the root level'
        );
      }
    }

    function checkIncludeLocation(atRule) {
      if (atRule.parent.type === 'root') {
        throw atRule.error(
          '@' + INCLUDING_AT_RULE + ' cannot occur at the root level'
        );
      }
    }

    function checkDefinitionNodes(atRule) {
      atRule.nodes.forEach(function(node) {
        if (node.type === 'rule' || node.type === 'atrule') {
          throw atRule.error(
            '@' + DEFINING_AT_RULE + ' cannot contain statements'
          );
        }
      });
    }

    return css;
  };
}

simpleMixin.postcss = simpleMixin();

module.exports = simpleMixin;
