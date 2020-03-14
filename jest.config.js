module.exports = {
  testRegex: '.*\.test\.ts$',
  "rootDir": "./",
  testPathIgnorePatterns: [
    '<rootDir>/node_modules/'
  ],
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
  transform: {
    '^.+\\.tsx?$': 'ts-jest'
  },
  testEnvironment: 'node',
  collectCoverage: true,
  coverageReporters: ['json', 'html']
};
