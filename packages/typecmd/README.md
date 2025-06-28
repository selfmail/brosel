# typecmd

[![npm version](https://badge.fury.io/js/typecmd.svg)](https://badge.fury.io/js/typecmd)
[![Downloads](https://img.shields.io/npm/dm/typecmd.svg)](https://www.npmjs.com/package/typecmd)
[![License](https://img.shields.io/npm/l/typecmd.svg)](https://github.com/selfmail/brosel/blob/main/packages/typecmd/LICENSE)

A TypeScript command line argument parser, completely typesafe and written in under 300 lines of code.

## Installation

```bash
# npm
npm install typecmd

# bun  
bun add typecmd

# yarn
yarn add typecmd

# pnpm
pnpm add typecmd
```

## Quick Start

```typescript
import { createCli } from 'typecmd';

await createCli({
  name: "my-cli",
  description: "A CLI tool for my application",
  help: {
    command: "--help",
    answer: "This is a CLI tool for my application",
  },
  commands: {
    start: {
      action: (args) => {
        console.log("Starting with args:", args);
        // args.port is typed as number
        // args.host is typed as string | undefined
      },
      options: {
        port: {
          type: "number",
          required: true,
          name: "port",
        },
        host: {
          type: "string", 
          required: false,
          name: "host",
        },
      },
    },
  },
});
```

Run with: `bun run cli.ts start --port 3000 --host localhost`

## Documentation

Learn more: [Documentation](./docs/index.md)