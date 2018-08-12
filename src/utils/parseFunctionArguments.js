import valueParser from "postcss-value-parser";
import { first } from "lodash";

export function groupByKeyValue(nodes) {
  if (!nodes) {
    return [];
  }

  let i = 0;

  return nodes.reduce((acc, node) => {
    const isComma = node.type === "div" && node.value === ",";
    if (isComma) {
      i++;
    }
    acc[i] = acc[i] || [];
    if (!isComma) {
      acc[i].push(node);
    }
    return acc;
  }, []);
}

export function mapToKeyValue(nodes) {
  const keyVal = nodes.reduce((acc, curr, i) => {
    if (acc.length === 1) {
      return acc;
    }
    const nextNode = nodes[i + 1];
    const isNextNodeColon =
      nextNode && nextNode.type === "div" && nextNode.value === ":";
    if (isNextNodeColon) {
      acc.push({
        key: valueParser.stringify(nodes[i]),
        value: valueParser.stringify(nodes.slice(2))
      });
      return acc;
    }
    acc.push({
      value: valueParser.stringify(nodes)
    });
    return acc;
  }, []);
  return first(keyVal);
}

export function parseFunctionArguments(value) {
  const parsed = valueParser(value);

  if (!parsed.nodes[0] || parsed.nodes[0].type !== "function") {
    return [];
  }

  return first(
    parsed.nodes.map(node => groupByKeyValue(node.nodes).map(mapToKeyValue))
  );
}
