module.exports = {
  moduleFileExtensions: ['js', 'json', 'ts'],
  rootDir: 'src',
  testRegex: '.*\\.(spec|test)\\.ts$',
  transform: {
    '^.+\\.(t|j)s$': 'ts-jest',
  },

  collectCoverageFrom: ['<rootDir>/module/**/*.{ts,js}'],
  coverageDirectory: '../coverage',
  coverageThreshold: {
    global: {
      branches: 90,
      functions: 90,
      lines: 90,
      statements: 90,
    },
  },
  coveragePathIgnorePatterns: [
    '<rootDir>/module/iam/authentication/infrastructure/cognito/cognito.service.ts',
    '<rootDir>/module/aws/',
    '<rootDir>/module/queue/',
    '<rootDir>/module/app/',
    // temporarily to avoid conflicts with coverage
    '<rootDir>/module/author/',
    '<rootDir>/module/book/',
    '<rootDir>/module/genre/',
  ],
  testEnvironment: 'node',
  testPathIgnorePatterns: [
    '<rootDir>/module/aws/',
    '<rootDir>/module/queue/',
    '<rootDir>/module/app/',
    // temporarily to avoid conflicts with coverage
    '<rootDir>/module/author/',
    '<rootDir>/module/book/',
    '<rootDir>/module/genre/',
  ],
  // Keep these mappings synchronized with the ones in tsconfig.json as you add new modules
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/../src/$1',
    '^@root/(.*)$': '<rootDir>/../$1',
    '^@data/(.*)$': '<rootDir>/../data/$1',
    '^@common/(.*)$': '<rootDir>/common/$1',
    '^@config/(.*)$': '<rootDir>/config/$1',
    '^@module/(.*)$': '<rootDir>/module/$1',
    '^@test/(.*)$': '<rootDir>/test/$1',
  },
};
