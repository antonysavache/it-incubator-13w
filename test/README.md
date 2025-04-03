# End-to-End Tests

This directory contains end-to-end tests for the NestJS Blog API.

## Running the Tests

To run the tests, use the following command:

```bash
npm run test:e2e
```

## Test Structure

The tests are organized by feature modules:

- `blogs.e2e-spec.ts`: Tests for the blogs API endpoints

## Test Database

Tests use a separate MongoDB database (`bloggers-test-db`) to avoid affecting the development or production data.

## Test Coverage

The tests cover the following scenarios for blogs:

- Creating a blog
- Getting all blogs with pagination and filtering
- Getting a single blog by ID
- Updating a blog
- Deleting a blog
- Error handling for invalid requests

## Maintenance

When adding new features to the API, make sure to add corresponding e2e tests to verify the functionality.
