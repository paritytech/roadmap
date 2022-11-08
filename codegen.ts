
import type { CodegenConfig } from '@graphql-codegen/cli';

const config: CodegenConfig = {
  overwrite: true,
  schema: "./schema.docs.graphql",
  documents: "*.graphql",
  generates: {
    "src/generated/graphql-operations.ts": {
      plugins: ['typescript', 'typescript-operations', "typed-document-node"]
    },
    "./graphql.schema.json": {
      plugins: ["introspection"]
    }
  }
};

export default config;
