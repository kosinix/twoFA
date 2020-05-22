//// Core modules

//// External modules
const express = require('express');

//// Modules

// Routes
let router = express.Router();
router.use(require('./routes/public'));
router.use(require('./routes/two-fa'));

// 404 Page
router.use((req, res) => {
    res.status(404).render('error.html', { error: "Page not found." });
});


module.exports = router;