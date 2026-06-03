const { body, param, validationResult } = require("express-validator");
const mongoose = require("mongoose");

/**
 * Middleware to handle validation errors
 * Use this AFTER your validation chain
 */
const handleValidation = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: "Validation failed",
      errors: errors.array().map((e) => ({
        field: e.path,
        message: e.msg,
        value: e.value,
      })),
    });
  }
  next();
};

/**
 * Validate MongoDB ObjectId parameter
 */
const validateObjectId = (field = "id") => [
  param(field)
    .custom((value) => mongoose.Types.ObjectId.isValid(value))
    .withMessage(`Invalid ${field} format`),
  handleValidation,
];

/**
 * Email validation helper
 */
const emailChain = () =>
  body("email")
    .trim()
    .notEmpty()
    .withMessage("Email is required")
    .isEmail()
    .withMessage("Please provide a valid email")
    .normalizeEmail();

/**
 * Password validation helper
 */
const passwordChain = (minLength = 6) =>
  body("password")
    .notEmpty()
    .withMessage("Password is required")
    .isLength({ min: minLength })
    .withMessage(`Password must be at least ${minLength} characters`);

// ─────────────────────────────────────────────
// Specific validation schemas
// ─────────────────────────────────────────────

const loginValidation = [
  emailChain(),
  passwordChain(1), // Allow any password length for login (already registered)
  handleValidation,
];

const signupValidation = [
  body("firstName")
    .trim()
    .notEmpty()
    .withMessage("First name is required")
    .isLength({ max: 50 })
    .withMessage("First name must be under 50 characters")
    .escape(),
  body("lastName")
    .trim()
    .notEmpty()
    .withMessage("Last name is required")
    .isLength({ max: 50 })
    .withMessage("Last name must be under 50 characters")
    .escape(),
  emailChain(),
  passwordChain(6),
  body("phone").optional().trim().isMobilePhone().withMessage("Invalid phone number"),
  body("departement").optional().trim().escape(),
  body("experience").optional().isInt({ min: 0 }).withMessage("Experience must be a positive number"),
  handleValidation,
];

const forgotPasswordValidation = [
  emailChain(),
  handleValidation,
];

const validateCodeValidation = [
  emailChain(),
  body("code")
    .notEmpty()
    .withMessage("Code is required")
    .isInt()
    .withMessage("Code must be a number"),
  handleValidation,
];

const changePasswordValidation = [
  param("id")
    .custom((value) => mongoose.Types.ObjectId.isValid(value))
    .withMessage("Invalid ID format"),
  emailChain(),
  passwordChain(6),
  handleValidation,
];

const updatePasswordValidation = [
  param("id")
    .custom((value) => mongoose.Types.ObjectId.isValid(value))
    .withMessage("Invalid ID format"),
  passwordChain(6),
  handleValidation,
];

const updateUserValidation = [
  param("id")
    .custom((value) => mongoose.Types.ObjectId.isValid(value))
    .withMessage("Invalid ID format"),
  body("firstName").optional().trim().notEmpty().withMessage("First name cannot be empty").escape(),
  body("lastName").optional().trim().notEmpty().withMessage("Last name cannot be empty").escape(),
  body("phone").optional().trim().isMobilePhone().withMessage("Invalid phone number"),
  body("email").optional().trim().isEmail().withMessage("Invalid email").normalizeEmail(),
  body("departement").optional().trim().escape(),
  body("experience").optional().isInt({ min: 0 }).withMessage("Experience must be a positive number"),
  handleValidation,
];

const updateRolesValidation = [
  param("id")
    .custom((value) => mongoose.Types.ObjectId.isValid(value))
    .withMessage("Invalid ID format"),
  body("roles")
    .isArray({ min: 1 })
    .withMessage("At least one role is required"),
  body("roles.*")
    .isIn(["ADMIN", "ASSISTANT", "LAB-MANAGER", "ENGINEER"])
    .withMessage("Invalid role"),
  handleValidation,
];

const checkPasswordValidation = [
  body("id")
    .custom((value) => mongoose.Types.ObjectId.isValid(value))
    .withMessage("Invalid user ID format"),
  body("password").notEmpty().withMessage("Password is required"),
  handleValidation,
];

module.exports = {
  handleValidation,
  validateObjectId,
  emailChain,
  passwordChain,
  loginValidation,
  signupValidation,
  forgotPasswordValidation,
  validateCodeValidation,
  changePasswordValidation,
  updatePasswordValidation,
  updateUserValidation,
  updateRolesValidation,
  checkPasswordValidation,
};
