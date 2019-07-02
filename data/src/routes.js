//// Core modules

//// External modules
const express = require('express');

//// Modules

// Routes
let router = express.Router();
router.use(include('data/src/routes/default'));

// 404 Page
router.use((req, res) => {
    res.status(404).render('error.html', { error: "Page not found." });
});


module.exports = router;