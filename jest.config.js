module.exports = {
    preset: 'ts-jest',
    testEnvironment: 'node',
    setupFiles: ['<rootDir>/tests/setup.ts'],
    clearMocks: true,
    coveragePathIgnorePatterns: ['dist'],
    coverageReporters: ['text', ['json', { file: 'integration-final.json' }]],
    coverageDirectory: './coverage/',
};