const express = require("express");
const c = require("../controllers/productController")
const router = express.Router();

const {protect} = require("../middleware/auth")


router.get("", c.getProducts);
router.get("/mine", protect, c.getMyProducts);
router.get("/:id", c.getProduct)

router.post("", protect, c.createProduct);

router.put("/:id", protect, c.updateProduct);

router.delete("/:id", protect, c.deleteProduct) 

module.exports = router;