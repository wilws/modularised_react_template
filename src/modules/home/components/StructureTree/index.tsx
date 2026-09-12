import { Link } from "react-router-dom";
import { Box, Text } from "../../../../app/components/Basic";
import style from "./index.module.scss";

interface TreeNode {
  name: string;
  note: string;
  /** Links the row to its docs page. */
  to?: string;
  children?: TreeNode[];
}

const tree: TreeNode[] = [
  {
    name: "app",
    note: "the core — shell, router, providers",
    to: "/app",
    children: [
      { name: "components", note: "shared chrome + Basic/ primitives" },
      { name: "locales", note: "translation engine" },
      { name: "providers", note: "language context" },
      { name: "router", note: "← the ONLY seam to modules" },
    ],
  },
  {
    name: "modules",
    note: "one folder per page",
    to: "/modules",
    children: [
      { name: "home", note: "this page" },
      { name: "appDocs", note: "the /app docs" },
      { name: "modulesDocs", note: "the /modules docs" },
      { name: "servicesDocs", note: "the /services docs" },
    ],
  },
  {
    name: "services",
    note: "all backend & external calls",
    to: "/services",
    children: [{ name: "api", note: "one folder per resource" }],
  },
];

/** One row: connector glyph, name, and a short note. */
const Row = ({
  node,
  depth,
  isLast,
  parentLast,
}: {
  node: TreeNode;
  depth: number;
  isLast: boolean;
  parentLast?: boolean;
}) => {
  // Everything sits under `src/`, which is itself the last child of the root.
  const indent = depth === 0 ? "    " : parentLast ? "        " : "    │   ";
  const branch = isLast ? "└── " : "├── ";

  return (
    <Box className={style.row}>
      <span className={style.glyph}>
        {indent}
        {branch}
      </span>
      {node.to ? (
        <Link to={node.to} className={style.name}>
          {node.name}/
        </Link>
      ) : (
        <span className={style.name}>{node.name}/</span>
      )}
      <span className={style.note}>{node.note}</span>
    </Box>
  );
};

export const StructureTree = () => (
  <Box className={style.tree}>
    <Text component="div" className={style.root}>
      modularised_react_template/
    </Text>
    <Box className={style.row}>
      <span className={style.glyph}>└── </span>
      <span className={style.name}>src/</span>
    </Box>

    {tree.map((node, index) => {
      const isLastTop = index === tree.length - 1;
      return (
        <Box key={node.name}>
          <Row node={node} depth={0} isLast={isLastTop} />
          {node.children?.map((child, childIndex) => (
            <Row
              key={child.name}
              node={child}
              depth={1}
              isLast={childIndex === node.children!.length - 1}
              parentLast={isLastTop}
            />
          ))}
        </Box>
      );
    })}
  </Box>
);
