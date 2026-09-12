import { Link } from "react-router-dom";
import { Box, Text, Tree, getTreeExpandedState, useTree } from "../../../../app/components/Basic";
import type { TreeNodeData, RenderTreeNodePayload } from "../../../../app/components/Basic";
import style from "./index.module.scss";

const data: TreeNodeData[] = [
  {
    value: "src",
    label: "src",
    children: [
      {
        value: "app",
        label: "app",
        nodeProps: { note: "the core — shell, router, providers", to: "/app" },
        children: [
          { value: "app/components", label: "components", nodeProps: { note: "shared chrome + Basic/ primitives" } },
          { value: "app/hooks", label: "hooks", nodeProps: { note: "app-wide custom hooks" } },
          { value: "app/locales", label: "locales", nodeProps: { note: "translation engine" } },
          { value: "app/providers", label: "providers", nodeProps: { note: "cross-cutting context" } },
          { value: "app/router", label: "router", nodeProps: { note: "← the ONLY seam to modules" } },
        ],
      },
      {
        value: "modules",
        label: "modules",
        nodeProps: { note: "one folder per page", to: "/modules" },
        children: [
          { value: "modules/home", label: "home", nodeProps: { note: "this page" } },
          { value: "modules/appDocs", label: "appDocs", nodeProps: { note: "the /app docs" } },
          { value: "modules/modulesDocs", label: "modulesDocs", nodeProps: { note: "the /modules docs" } },
          { value: "modules/servicesDocs", label: "servicesDocs", nodeProps: { note: "the /services docs" } },
          { value: "modules/dogDemo", label: "dogDemo", nodeProps: { note: "live API demo", to: "/demo" } },
        ],
      },
      {
        value: "services",
        label: "services",
        nodeProps: { note: "all backend & external calls", to: "/services" },
        children: [
          { value: "services/api", label: "api", nodeProps: { note: "one folder per resource" } },
        ],
      },
    ],
  },
];

/** One row: the folder name (linked where it has a docs page) and its note. */
const renderNode = ({ node, expanded, hasChildren, elementProps }: RenderTreeNodePayload) => {
  const note = node.nodeProps?.note as string | undefined;
  const to = node.nodeProps?.to as string | undefined;

  return (
    <Box {...elementProps} className={`${elementProps.className} ${style.row}`}>
      <span className={style.chevron}>{hasChildren ? (expanded ? "▾" : "▸") : ""}</span>

      {to ? (
        <Link to={to} className={style.name} onClick={(event) => event.stopPropagation()}>
          {node.label}/
        </Link>
      ) : (
        <span className={style.name}>{node.label}/</span>
      )}

      {note && <span className={style.note}>{note}</span>}
    </Box>
  );
};

export const StructureTree = () => {
  const tree = useTree({ initialExpandedState: getTreeExpandedState(data, "*") });

  return (
    <Box className={style.wrap}>
      <Text component="div" className={style.root}>
        modularised_react_template/
      </Text>
      <Tree data={data} tree={tree} levelOffset={26} withLines renderNode={renderNode} />
    </Box>
  );
};
