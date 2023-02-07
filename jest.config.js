/* eslint-disable quotes */
/* eslint-disable @typescript-eslint/no-var-requires */
/** @type {import('ts-jest/dist/types').InitialOptionsTsJest} */

const { pathsToModuleNameMapper } = require('ts-jest/utils');
const { compilerOptions } = require('./tsconfig');
module.exports = {
  testTimeout: 7000,
  preset: 'ts-jest',
  testEnvironment: 'node',
  coverageReporters: ["json", "lcov", "text"],
  moduleNameMapper: pathsToModuleNameMapper(compilerOptions.paths),
  modulePathIgnorePatterns: [
    "<rootDir>/dist/", 
    "<rootDir>/config/", ],
  modulePaths: [
    '<rootDir>/'
  ],
  coveragePathIgnorePatterns: [
    "<rootDir>/config/",
  ],
  coverageDirectory: "./coverage",
  coverageThreshold: {
    global: {
      branches: 60,
      functions: 75,
      lines: 75,
      statements: 75
    }
  },
};