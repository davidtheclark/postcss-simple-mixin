'use strict';

var messageHelpers = require('postcss-message-helpers');

function simpleMixin(css) {
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
    var targetMixin = atRule.params;
    if (availableMixins[targetMixin]) {
      availableMixins[targetMixin].eachDecl(function(decl) {
        atRule.parent.insertBefore(atRule, decl);
      });
      atRule.removeSelf();
    } else {
      throw new Error(messageHelpers.message(
        'Attempted to @' + INCLUDING_AT_RULE + ' `' + targetMixin + '`, ' +
        'which is not (yet) defined',
        atRule.source
      ));
    }
  }

  function checkDefinitionLocation(atRule) {
    if (atRule.parent.type !== 'root') {
      throw new Error(messageHelpers.message(
        '@' + DEFINING_AT_RULE + ' must be at the root level',
        atRule.source
      ));
    }
  }

  function checkIncludeLocation(atRule) {
    if (atRule.parent.type === 'root') {
      throw new Error(messageHelpers.message(
        '@' + INCLUDING_AT_RULE + ' cannot be at the root level',
        atRule.source
      ));
    }
  }

  function checkDefinitionNodes(atRule) {
    atRule.nodes.forEach(function(node) {
      if (node.type === 'rule' || node.type === 'atRule') {
        throw new Error(messageHelpers.message(
          '@' + DEFINING_AT_RULE + ' cannot contain rules'
        ));
      }
    });
  }

  return css;
}

module.exports = simpleMixin;
