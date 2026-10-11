
const Product = require("../models/product");

exports.getProducts = async (req, res, next) => {
    try {
        const { search, inStock, minPrice, maxPrice, sort } = req.query;

        const page = Math.max(Number(req.query.page) || 1, 1);
        const limit = Math.min(
            Math.max(Number(req.query.limit) || 5, 1),
            50
        );

        const filter = {};

        // Search products by name
        if (search) {
            const safe = search.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

            filter.name = {
                $regex: safe,
                $options: "i"
            };
        }

        // Filter by stock availability
        if (inStock === "true" || inStock === "false") {
            filter.inStock = inStock === "true";
        }

        // Filter by price range
        if (minPrice !== undefined || maxPrice !== undefined) {
            filter.price = {};

            if (minPrice !== undefined && minPrice !== "") {
                filter.price.$gte = Number(minPrice);
            }

            if (maxPrice !== undefined && maxPrice !== "") {
                filter.price.$lte = Number(maxPrice);
            }
        }

        // Count matching products
        const total = await Product.countDocuments(filter);

        // Fetch, sort, and paginate products
        const products = await Product.find(filter)
            .sort(sort || "-createdAt")
            .skip((page - 1) * limit)
            .limit(limit);

        res.status(200).json({
            total,
            page,
            pages: Math.ceil(total / limit),
            results: products
        });

    } catch (err) {
        next(err);
    }
};


exports.getProduct = async (req, res, next) => {
    try {
        const id = req.params.id;

        const product = await Product.findById(id);

        if (!product) {
            return res.status(404).json({
                message: "Product not found"
            });
        }

        res.status(200).json(product);
    } catch (err) {
        next(err);
    }
};


exports.getMyProducts = async (req, res, next) => {
    try {
        const products = await Product.find({
            createdBy: req.user.id
        });

        res.status(200).json(products);
    } catch (err) {
        next(err);
    }
};


exports.createProduct = async (req, res, next) => {
    try {
        const { name, price } = req.body;

        if (!name) {
            return res.status(400).json({
                message: "Name not found"
            });
        }

        if (price === undefined || price === null || price === "") {
            return res.status(400).json({
                message: "Price not found"
            });
        }

        const product = await Product.create({
            ...req.body,
            createdBy: req.user.id
        });

        return res.status(201).json(product);
    } catch (err) {
        next(err);
    }
};


exports.updateProduct = async (req, res, next) => {
    try {
        const id = req.params.id;

        const product = await Product.findById(id);

        if (!product) {
            return res.status(404).json({
                message: "Product not found"
            });
        }

        if (String(product.createdBy) !== String(req.user.id)) {
            return res.status(403).json({
                message: "You can update only your own products"
            });
        }

        delete req.body.createdBy;

        const updatedProduct = await Product.findByIdAndUpdate(
            id,
            req.body,
            {
                returnDocument: "after",
                runValidators: true
            }
        );

        res.status(200).json(updatedProduct);
    } catch (err) {
        next(err);
    }
};


exports.deleteProduct = async (req, res, next) => {
    try {
        const id = req.params.id;

        const product = await Product.findById(id);

        if (!product) {
            return res.status(404).json({
                message: "Product not found"
            });
        }

        if (String(product.createdBy) !== String(req.user.id)) {
            return res.status(403).json({
                message: "You cannot delete other users' products"
            });
        }

        await product.deleteOne();

        res.status(200).json({
            message: "Product deleted successfully"
        });
    } catch (err) {
        next(err);
    }
};
