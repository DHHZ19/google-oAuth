const express = require("express");
const router = express.Router();
const passport = require("passport");
// @desc Auth with google
// @route GET /auth/google
router.get("/google", passport.authenticate("google", { scope: ["profile"] }));

// @desc  Google auth callback
// @route GET /auth/google/callback

router.get(
  "/google/callback",
  passport.authenticate("google", { faliureRedirect: "/" }),
  (req, res) => {
    res.redirect("/dashboard");
  }
);

// @desc Logout user
// @route /auth/logout
router.get("/logout", (req, res) => {
  req.logout((err) => {
    if (err) {
      console.log(err);
    }
  });
  res.redirect("/");
});

module.exports = router;
