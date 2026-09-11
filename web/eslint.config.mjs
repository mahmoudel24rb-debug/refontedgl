import coreWebVitals from 'eslint-config-next/core-web-vitals'
import typescriptConfig from 'eslint-config-next/typescript'

/** Configuration plate ESLint : regles Next et TypeScript. */
const eslintConfig = [
  ...coreWebVitals,
  ...typescriptConfig,
  {
    rules: {
      '@typescript-eslint/ban-ts-comment': 'warn',
      '@typescript-eslint/no-empty-object-type': 'warn',
      '@typescript-eslint/no-explicit-any': 'error',
      '@typescript-eslint/no-unused-vars': [
        'warn',
        {
          vars: 'all',
          args: 'after-used',
          ignoreRestSiblings: false,
          argsIgnorePattern: '^_',
          varsIgnorePattern: '^_',
          destructuredArrayIgnorePattern: '^_',
          caughtErrorsIgnorePattern: '^(_|ignore)',
        },
      ],
    },
  },
  {
    ignores: [
      // Toutes les sorties de build, y compris les dossiers paralleles
      // pilotes par NEXT_DIST_DIR (.next-lot2, .next-lot3, etc.).
      '.next*/',
      'public/',
      'src/payload-types.ts',
      'src/migrations/',
      'src/app/(payload)/admin/importMap.js',
    ],
  },
]

export default eslintConfig
