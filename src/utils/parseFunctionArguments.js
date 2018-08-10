import valueParser from "postcss-value-parser";
import { first } from "lodash";

export function groupByKeyVal(nodes) {
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

function mapToKeyValue(nodes) {
  const mapped = nodes.map((_, i) => {
    const nextNode = nodes[i + 1];
    const isNextNodeColon =
      nextNode && nextNode.type === "div" && nextNode.value === ":";
    if (isNextNodeColon) {
      return {
        key: valueParser.stringify(nodes[i]),
        value: valueParser.stringify(nodes.slice(2))
      };
    }
    return {
      value: valueParser.stringify(nodes)
    };
  });
  return first(mapped);
}

export function parseFunctionArguments(value) {
  const parsed = valueParser(value);

  if (!parsed.nodes[0] || parsed.nodes[0].type !== "function") {
    return [];
  }

  return first(
    parsed.nodes.map(node => groupByKeyVal(node.nodes).map(mapToKeyValue))
  );
}
