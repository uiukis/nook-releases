import { PHASE_DEVELOPMENT_SERVER } from 'next/constants.js';

const basePath = process.env.NEXT_PUBLIC_BASE_PATH || '';

export default (phase) => ({
  basePath,
  trailingSlash: true,
  // Static hosts serve index.html for a directory; Next dev needs an explicit rewrite.
  ...(phase === PHASE_DEVELOPMENT_SERVER ? {
    async rewrites() {
      return [{ source: '/preview/', destination: '/preview/index.html' }];
    },
  } : { output: 'export' }),
});
