import { isSingleLineString, namespace } from "../../utils";
import { utils } from "stylelint";
import { isBoolean } from "lodash";

export const ruleName = namespace("at-if-no-null");

export const messages = utils.ruleMessages(ruleName, {
  equals_null: "Expected @if(statement) rather than @if(statement == null)",
  not_equals_null: "Expected @if(!statement) rather than @if(statement != null)"
});
