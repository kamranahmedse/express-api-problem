module.exports = {
  testRegex: '.*\.test\.ts$',
  testPathIgnorePatterns: [
    '<rootDir>/node_modules/'
  ],
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
  transform: {
    '^.+\\.tsx?$': 'ts-jest'
  },
  testEnvironment: 'node',
  collectCoverage: false,
  coverageReporters: ['json', 'html']
};
