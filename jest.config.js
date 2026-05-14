module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  roots: ['<rootDir>/src', '<rootDir>/__tests__'],
  testMatch: ['**/__tests__/**/*.test.ts'],
  collectCoverageFrom: [
    'src/**/*.ts',
    '!src/**/*.d.ts',
    '!src/index.ts',
    '!src/swagger.ts',
    '!src/config/**',
    '!src/middleware/corsErrorHandler.ts',
    '!src/routes/cors-test.ts'
  ],
  coverageDirectory: 'coverage',
  coverageReporters: ['text', 'lcov', 'html'],
  coverageThreshold: {
    global: {
      branches: 15,
      functions: 30,
      lines: 35,
      statements: 35
    }
  },
  setupFilesAfterEnv: ['<rootDir>/__tests__/setup.ts'],
  verbose: true,
  bail: 1,
  forceExit: true,
  detectOpenHandles: true
};
