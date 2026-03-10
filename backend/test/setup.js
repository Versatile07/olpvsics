/**
 * Test setup: shared helpers for backend tests.
 * Tests use supertest against the app (no live DB needed for unit tests).
 */
import { jest } from '@jest/globals';

// Set test environment variables
process.env.JWT_SECRET = 'test-secret-key';
process.env.PORT = '5001';
process.env.UPLOAD_DIR = './test-uploads';
