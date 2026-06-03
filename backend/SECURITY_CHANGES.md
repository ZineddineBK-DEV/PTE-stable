# 🔒 PTE Backend — Security Hardening Changes

## Summary of Changes

### New Files Created

| File | Purpose |
|------|---------|
| `src/config/env.js` | Centralized environment variable config with validation |
| `src/config/logger.js` | Winston logger (console + file logs for errors & combined) |
| `src/config/rateLimiter.js` | Rate limiting configs (general + strict auth limiter) |
| `src/config/validation.js` | Express-validator rules for all endpoints + reusable helpers |
| `src/middlewares/errorHandler.js` | Global error handler (Mongoose errors, JWT errors, Multer, etc.) |
| `src/middlewares/notFound.js` | 404 handler for unknown routes |

### Files Modified

| File | Changes |
|------|---------|
| `.env` | Added `JWT_SECRET`, `JWT_EXPIRES_IN`, rate limit config vars |
| `.gitignore` | Added `src/cert`, `.env`, `logs/` to prevent committing secrets |
| `app.js` | Replaced manual CORS with `cors` package, added `helmet`, `morgan` logging, rate limiting, global error handler |
| `server.js` | Added Winston logger, graceful shutdown handlers, uncaught exception handlers |
| `src/middlewares/authMiddleware.js` | JWT secret now reads from `.env` via config, improved error messages, logging |
| `src/middlewares/checkAdminMiddleware.js` | Rewritten as a `requireRole()` factory function — **replaces all 4 role middlewares** with one |
| `src/middlewares/checkAssistantMiddleware.js` | Now re-exported from `checkAdminMiddleware.js` for backward compatibility |
| `src/middlewares/checkLabManagerMiddleware.js` | Now re-exported from `checkAdminMiddleware.js` for backward compatibility |
| `src/middlewares/checkAssistantAndAdminMiddleware.js` | Now re-exported from `checkAdminMiddleware.js` for backward compatibility |
| `src/controllers/userController.js` | Fixed hardcoded JWT secret → reads from `process.env.JWT_SECRET` |
| `src/routes/user.js` | Added validation middleware to all endpoints |
| `src/routes/login.js` | Added `loginValidation` middleware |

---

## What's Now Protected

### ✅ JWT Secret
- **Before:** Hardcoded `"secret_this_should_be_longer"` in both `authMiddleware.js` and `userController.js`
- **After:** Reads `JWT_SECRET` from `.env` file (not committed to git)

### ✅ Rate Limiting
- **All API routes:** 100 requests / 15 min per IP
- **Auth routes (login, forgot password, validate code):** 5 requests / 15 min per IP
- Returns proper 429 status with JSON message

### ✅ Input Validation
All user endpoints now validate:
- **Login:** email format + password required
- **Signup:** firstName, lastName, email format, password min 6 chars, phone format
- **Update user:** email format, phone format, ObjectId validation
- **Update password:** password min 6 chars, ObjectId validation
- **Update roles:** must be array with valid roles (ADMIN, ASSISTANT, LAB-MANAGER, ENGINEER)
- **Forgot password:** valid email required
- **Validate code:** email + numeric code required
- **All `:id` params:** Valid MongoDB ObjectId required

Returns 400 with detailed field-level error messages:
```json
{
  "success": false,
  "message": "Validation failed",
  "errors": [
    { "field": "email", "message": "Please provide a valid email", "value": "notanemail" }
  ]
}
```

### ✅ Security Headers (Helmet)
- XSS Protection
- Content-Type sniffing prevention
- Frame protection (clickjacking)
- Strict Transport Security
- And more...

### ✅ Proper CORS
- Uses the `cors` package instead of manual headers
- Configurable origin, methods, and headers
- Credentials support

### ✅ Request Logging (Morgan → Winston)
- All HTTP requests logged via Morgan → Winston
- Error logs: `logs/error.log`
- All logs: `logs/combined.log`
- Exceptions: `logs/exceptions.log`
- Rejections: `logs/rejections.log`
- Log rotation: 5MB max, 5 files retained

### ✅ Global Error Handler
Catches and formats:
- Mongoose validation errors (400)
- Duplicate key errors (409)
- Cast errors / invalid ObjectId (400)
- JWT errors (401)
- Multer file size errors (413)
- All 500 errors with stack traces in development mode

### ✅ Graceful Shutdown
- Handles SIGTERM and SIGINT
- Closes server connections before exiting
- Catches unhandled promise rejections and uncaught exceptions

### ✅ Backward Compatibility
- All existing routes and controllers work unchanged
- Role middlewares still export with same names
- No frontend changes required

---

## ⚠️ Important: Before Deploying

1. **Generate a strong JWT secret:**
   ```bash
   node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
   ```
   Copy the output and paste it as `JWT_SECRET` in your `.env`

2. **Remove SSL certs from git history:**
   ```bash
   git rm -r --cached src/cert/
   git commit -m "Remove SSL certs from repo"
   ```

3. **Never commit `.env` to git** (now in `.gitignore`)

4. **Create a `logs/` directory** in production

5. **Set `NODE_ENV=production`** in production for optimized logging
