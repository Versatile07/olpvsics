import { body, validationResult } from 'express-validator';

/**
 * Middleware to check validation results.
 * Run after express-validator chain.
 */
export function handleValidationErrors(req, res, next) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
}

// --- Validation rules for critical endpoints ---

export const registerRules = [
  body('name').trim().notEmpty().withMessage('Name is required'),
  body('email').isEmail().withMessage('Valid email is required'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
];

export const loginRules = [
  body('email').isEmail().withMessage('Valid email is required'),
  body('password').notEmpty().withMessage('Password is required'),
];

export const markAttendanceRules = [
  body('subject_id').isInt().withMessage('subject_id must be an integer'),
  body('date').isDate().withMessage('date must be a valid date (YYYY-MM-DD)'),
  body('records').isArray({ min: 1 }).withMessage('records must be a non-empty array'),
  body('records.*.student_id').isInt().withMessage('Each record must have an integer student_id'),
  body('records.*.status').isIn(['present', 'absent']).withMessage('Status must be present or absent'),
];

export const createAssignmentRules = [
  body('title').trim().notEmpty().withMessage('Title is required'),
  body('subject_id').isInt().withMessage('subject_id must be an integer'),
];

export const createResourceRules = [
  body('title').trim().notEmpty().withMessage('Title is required'),
];
