const express = require("express");
const router = express.Router();
const userCtr = require("../controllers/userController");
const userEventCtr = require("../controllers/technical_team/userEventCtr");
const userPlanCtr = require("../controllers/technical_team/userPlanCtr");
const multer = require("multer");

const { authMiddleware } = require("../middlewares/authMiddleware");
const { checkAdminMiddleware, checkAssistantAndAdminMiddleware } = require("../middlewares/checkAdminMiddleware");
const { fileStorageEngine, external_cv, signature, external_docs } = require("../tools/FileStorageEngine");

const upload = multer({ storage: fileStorageEngine });
const upload_external_cv = multer({ storage: external_cv });
const signature_upload = multer({ storage: signature });
const external_doc = multer({ storage: external_docs });

// Validation schemas
const {
  signupValidation,
  updateUserValidation,
  updatePasswordValidation,
  updateRolesValidation,
  checkPasswordValidation,
  forgotPasswordValidation,
  validateCodeValidation,
  changePasswordValidation,
  validateObjectId,
} = require("../config/validation");

// Rate limiter for auth-sensitive routes
const { authLimiter } = require("../config/rateLimiter");

// ─── Authentication routes ────────────────────────────────────────────
router.post("/signup", upload.single("image"), signupValidation, userCtr.signUp);
router.get("/signup/requests", authMiddleware, checkAdminMiddleware, userCtr.getSignUpRequests);
router.post("/confirm-signup/:id", authMiddleware, checkAdminMiddleware, validateObjectId("id"), userCtr.confirmSignUp);

// ─── User profile routes ──────────────────────────────────────────────
router.put("/update/:id", authMiddleware, upload.single("image"), updateUserValidation, userCtr.UpdateUser);
router.patch("/updatePass/:id", authMiddleware, updatePasswordValidation, userCtr.updatePass);
router.patch("/update-roles/:id", authMiddleware, checkAdminMiddleware, updateRolesValidation, userCtr.updateUserRoles);
router.patch("/uploadSignature/:id", authMiddleware, signature_upload.single("signature"), validateObjectId("id"), userCtr.uploadSignature);

// ─── Password reset routes (rate-limited) ─────────────────────────────
router.post("/forgotPassword", authLimiter, forgotPasswordValidation, userCtr.forgotPassword);
router.post("/checkpass", authLimiter, checkPasswordValidation, userCtr.checkPassword);
router.post("/validateCode", authLimiter, validateCodeValidation, userCtr.validateCode);
router.post("/changePswdAutorisation/:id", authLimiter, changePasswordValidation, userCtr.changePswdAutorisation);
router.patch("/change-psw/:id", authLimiter, changePasswordValidation, userCtr.changePswd);

// ─── External users ───────────────────────────────────────────────────
router.post("/addExternal", authMiddleware, checkAssistantAndAdminMiddleware, external_doc.array("external_docs"), userCtr.AddExternal);
router.get("/getExternals", authMiddleware, userCtr.getExternal);
router.patch("/switchToExternal/:id", authMiddleware, checkAdminMiddleware, validateObjectId("id"), userCtr.switchToExternal);

// ─── User queries ─────────────────────────────────────────────────────
router.get("/getall", authMiddleware, userCtr.getAllUsers);
router.get("/getAllUsersForCommAPP", userCtr.getAllUsersForCommAPP);
router.get("/getAllTeamLeaders", authMiddleware, userCtr.getAllTeamLeaders);
router.get("/sousTraitant", userCtr.getAllUsers);
router.delete("/delete/:id", authMiddleware, checkAdminMiddleware, validateObjectId("id"), userCtr.deleteUser);
router.get("/drivers", authMiddleware, userCtr.getDrivers);
router.get("/getUserByID/:id", authMiddleware, validateObjectId("id"), userCtr.getUserById);
router.post("/getUserByEmail", userCtr.getUserByEmail);
router.get("/getAdmin", authMiddleware, userCtr.getAdmin);

// ─── Event Management ─────────────────────────────────────────────────
router.get("/events", authMiddleware, userEventCtr.getUserEvents);
router.get("/allUserEvents", authMiddleware, userEventCtr.getAllUsersEvents);
router.post("/setevent", authMiddleware, userEventCtr.createEvent);
router.put("/updateEvent/:id", authMiddleware, validateObjectId("id"), userEventCtr.updateEvent);
router.delete("/deleteEvent/:id", authMiddleware, validateObjectId("id"), userEventCtr.deleteEvent);
router.get("/:id", authMiddleware, validateObjectId("id"), userCtr.getUserById);
router.get("/getPlanById/:id", validateObjectId("id"), userPlanCtr.getPlanById);
router.post("/upload", upload.single("pdf"), userPlanCtr.uploadPlan);
router.get("/getTechEvents/:id", authMiddleware, validateObjectId("id"), userCtr.techEventsById);
router.get("/getEventById/:id", authMiddleware, validateObjectId("id"), userCtr.getEventById);
router.post("/getEventsByDate", authMiddleware, userCtr.getEventsByDate);

// ─── Missions KPIs ────────────────────────────────────────────────────
router.get("/missions/stats", authMiddleware, userEventCtr.getMissionStats);
router.get("/missions/my-stats", authMiddleware, userEventCtr.getMyMissionStats);
router.get("/missions/getDepartments", authMiddleware, userEventCtr.getDepartments);

module.exports = router;
