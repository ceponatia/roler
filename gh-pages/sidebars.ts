import type {SidebarsConfig} from '@docusaurus/plugin-content-docs';

// This runs in Node.js - Don't use client-side code here (browser APIs, JSX...)

/**
 * Creating a sidebar enables you to:
 - create an ordered group of docs
 - render a sidebar for each doc of that group
 - provide next/previous navigation

 The sidebars can be generated from the filesystem, or explicitly defined here.

 Create as many sidebars as you want.
 */
const sidebars: SidebarsConfig = {
  docs: [
    'overview',
    'getting-started',
    'status',
    {
      type: 'category',
      label: 'Concepts',
      collapsed: false,
      items: [
        'concepts/architecture',
        'concepts/data-model',
        'concepts/validation-and-errors',
        'concepts/retrieval',
        'concepts/security-and-access',
      ],
    },
    {
      type: 'category',
      label: 'Extensions',
      collapsed: false,
      items: [
        'extensions/manifest',
        'extensions/registration-config',
        'extensions/loader-and-discovery',
        'extensions/state-transactions',
        'extensions/reference-extensions',
      ],
    },
    {
      type: 'category',
      label: 'Retrieval',
      collapsed: false,
      items: [
        'retrieval/orchestrator',
        'retrieval/adaptive-k',
        'retrieval/retriever',
        'retrieval/postprocessing-and-scoring',
        'retrieval/config',
        'retrieval/caching',
        'retrieval/metrics',
        'retrieval/errors-and-deadlines',
      ],
    },
    {
      type: 'category',
      label: 'Data',
      collapsed: false,
      items: [
        'data/text-chunks',
      ],
    },
    {
      type: 'category',
      label: 'Observability',
      collapsed: false,
      items: [
        'observability/README',
      ],
    },
    'faq',
    'glossary',
  ],
};

export default sidebars;
