import { Config } from '@stencil/core';

export const config: Config = {
  namespace: 'color-pickr',
  testing: {
    /**
     * CI's don't allow sandbox, therefore this parameters must be passed to your Headless Chrome
     * before it can run your tests
     */
    browserArgs: ['--no-sandbox', '--disable-setuid-sandbox'],
    setupFilesAfterEnv: [
      `<rootDir>/test-configs/setupTests.ts`
    ],
    testRegex: "(/__tests__/.*|\\.?(test|spec|e2e))\\.(tsx?|ts?)$"
  },
  outputTargets: [
    {
      type: 'dist',
      esmLoaderPath: '../loader',
    },
    {
      type: 'dist-custom-elements-bundle',
    },
    {
      type: 'docs-readme',
    },
    {
      type: 'www',
      serviceWorker: null, // disable service workers
    },
  ]
};
