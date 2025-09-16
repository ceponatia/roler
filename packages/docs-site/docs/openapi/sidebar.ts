import type { SidebarsConfig } from "@docusaurus/plugin-content-docs";

const sidebar: SidebarsConfig = {
  apisidebar: [
    {
      type: "doc",
      id: "docs/openapi/roler-api-prototype",
    },
    {
      type: "category",
      label: "UNTAGGED",
      items: [
        {
          type: "doc",
          id: "docs/openapi/list-text-chunks",
          label: "List text chunks",
          className: "api-method get",
        },
        {
          type: "doc",
          id: "docs/openapi/get-a-text-chunk-by-id",
          label: "Get a text chunk by id",
          className: "api-method get",
        },
      ],
    },
  ],
};

export default sidebar.apisidebar;
