// Customer logos for the "Used by sellers at" strip (files in public/home-v8/logos).
// Single source of truth: the home page and the BF26 sales page both render this list.
// `h` tunes optical size.
export type Logo = { name: string; src: string; h?: number };

export const LOGOS: Logo[] = [
  { name: 'BlackRock', src: '/home-v8/logos/blackrock.svg', h: 22 },
  { name: 'Workday', src: '/home-v8/logos/workday.svg', h: 30 },
  { name: 'Snowflake', src: '/home-v8/logos/snowflake.svg', h: 28 },
  { name: 'Okta', src: '/home-v8/logos/okta.svg', h: 28 },
  { name: 'DocuSign', src: '/home-v8/logos/docusign.svg', h: 22 },
  { name: 'Check Point', src: '/home-v8/logos/checkpoint.svg', h: 28 },
  { name: 'SAS', src: '/home-v8/logos/sas.svg', h: 28 },
  { name: 'Wiz', src: '/home-v8/logos/wiz.svg', h: 28 },
  { name: 'UiPath', src: '/home-v8/logos/uipath.svg', h: 30 },
  { name: 'Confluent', src: '/home-v8/logos/confluent.svg', h: 24 },
  { name: 'Infor', src: '/home-v8/logos/infor.svg', h: 28 },
  { name: 'Rubrik', src: '/home-v8/logos/rubrik.svg', h: 28 },
  { name: 'LexisNexis', src: '/home-v8/logos/lexisnexis.svg', h: 28 },
  { name: 'Dayforce', src: '/home-v8/logos/dayforce.svg', h: 28 },
  { name: 'New Relic', src: '/home-v8/logos/newrelic.svg', h: 26 },
  { name: 'Grammarly', src: '/home-v8/logos/grammarly.svg', h: 26 },
  { name: 'Airtable', src: '/home-v8/logos/airtable.svg', h: 28 },
  { name: 'Cloudera', src: '/home-v8/logos/cloudera.webp', h: 22 },
  { name: 'Astronomer', src: '/home-v8/logos/astronomer.svg', h: 18 },
  { name: 'Sanity', src: '/home-v8/logos/sanity.svg', h: 24 },
  { name: 'Zywave', src: '/home-v8/logos/zywave.svg', h: 20 },
];

