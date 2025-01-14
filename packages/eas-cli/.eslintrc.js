const rootEslintrc = require('../../.eslintrc.js');

module.exports = {
  rules: {
    'no-restricted-imports': [
      'error',
      {
        paths: [
          ...rootEslintrc.rules['no-restricted-imports'][1].paths,
          {
            name: 'ora',
            message: 'Import ora from src/ora.ts instead.',
          },
        ],
      },
    ],
    'graphql/template-strings': [
      'error',
      {
        env: 'apollo',
        schemaJson: require('./graphql.schema.json'),
      },
    ],
    'graphql/named-operations': [
      'error',
      {
        schemaJson: require('./graphql.schema.json'),
      },
    ],
    'graphql/required-fields': [
      'error',
      {
        env: 'apollo',
        schemaJson: require('./graphql.schema.json'),
        requiredFields: ['id'],
      },
    ],
    'graphql/capitalized-type-name': [
      'error',
      {
        schemaJson: require('./graphql.schema.json'),
      },
    ],
  },
  plugins: ['graphql'],
};
