import { head } from "lodash";
import valueParser from "postcss-value-parser";

export function groupByKeyValue(nodes) {
  if (!nodes) {
    return [];
  }

  let groupIndex = 0;

  return nodes.reduce((acc, node, nodeIndex) => {
    const isComma = node.type === "div" && node.value === ",";
    const skipTrailingComma = isComma && nodeIndex === nodes.length - 1;

    if (skipTrailingComma) {
      return acc;
    }

    if (isComma) {
      groupIndex++;
    }
    acc[groupIndex] = acc[groupIndex] || [];
    if (!isComma) {
      acc[groupIndex].push(node);
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
  return head(keyVal);
}

export function parseFunctionArguments(value) {
  const parsed = valueParser(value);

  if (!parsed.nodes[0] || parsed.nodes[0].type !== "function") {
    return [];
  }

  return head(
    parsed.nodes.map(node => groupByKeyValue(node.nodes).map(mapToKeyValue))
  );
}
