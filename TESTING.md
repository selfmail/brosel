# Testing Documentation

This document explains the testing setup for the Brosel CLI and related components.

## Overview

The project uses comprehensive testing with GitHub Actions for continuous integration.

## Test Structure

### CLI Tests (`packages/brosel/tests/cli.test.ts`)

Our CLI tests are comprehensive and cover:

- ✅ **Basic CLI Configuration**: Command creation and validation
- ✅ **Command Parsing**: All option types (string, number, boolean, array)
- ✅ **Error Handling**: Invalid commands, missing options, type validation
- ✅ **Help System**: Help command functionality
- ✅ **Development Mode**: Debug logging verification
- ✅ **Edge Cases**: Boundary conditions and special scenarios

**24 test cases** with **59 assertions** providing complete coverage.

## GitHub Actions Workflows

### 1. Main Test Suite (`.github/workflows/test.yml`)
- Runs on: `push` to main/develop, `pull_request`
- Tests on: Ubuntu, Windows, macOS
- Bun versions: 1.2.15, latest
- Includes: Linting, type checking, all tests, CLI integration

### 2. CLI-Specific Tests (`.github/workflows/cli-tests.yml`)
- Runs on: Changes to CLI-related files
- Focused CLI testing with integration tests
- Performance testing
- Real CLI execution validation

### 3. Test Status (`.github/workflows/test-status.yml`)
- Runs on: `push` to main, daily schedule
- Monitors overall test health

## Available Scripts

### Root Package
```bash
# Run all tests across packages
bun run test

# Run CLI tests specifically
bun run test:cli
```

### Brosel Package (`packages/brosel/`)
```bash
# Run all tests
bun test

# Run CLI tests only
bun test:cli
# or
bun test tests/cli.test.ts

# Watch mode
bun test:watch
bun test:cli:watch

# Run CLI directly
bun run cli --help
```

## Running Tests Locally

1. Install dependencies:
   ```bash
   bun install
   ```

2. Run CLI tests:
   ```bash
   cd packages/brosel
   bun test tests/cli.test.ts
   ```

3. Run all tests:
   ```bash
   bun run test
   ```

## Test Features

### Mocking System
- Complete isolation using mocked `process.argv`, `console.log/error`, `process.exit`
- Captures outputs and exit codes for validation
- Safe testing without actual process termination

### Comprehensive Coverage
- **All option types**: string, number, boolean, array
- **Error scenarios**: Invalid commands, missing options, type errors
- **Edge cases**: Empty args, negative numbers, option-like values
- **Integration**: Real CLI behavior testing

### Multi-Platform Support
- Tests run on Ubuntu, Windows, and macOS
- Multiple Bun versions for compatibility
- Cross-platform CLI behavior validation

## CI/CD Integration

The GitHub Actions automatically:
1. Install dependencies with Bun
2. Run linting and type checking
3. Execute all test suites
4. Test CLI integration scenarios
5. Validate cross-platform compatibility
6. Report results and status

## Adding New Tests

When adding new CLI functionality:

1. Add unit tests to `tests/cli.test.ts`
2. Follow the existing test structure
3. Include both success and failure scenarios
4. Test all option types and edge cases
5. Update this documentation if needed

The tests will automatically run on GitHub when you push changes to CLI-related files.
