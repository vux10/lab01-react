const express = require('express')
const router = express.Router()
const mongoose = require('mongoose');

const { Cart } = require('../models/cart')

// POST - add product to cart
router.post('/add', async(req, res) => {
    const { userId, productId, quantity } = req.body
    console.log(req.body)
    try {
        // Ensure that userId is converted to ObjectId
        const userObjectId = new mongoose.Types.ObjectId(userId);  // Convert string to ObjectId

        let cart = await Cart.findById(userObjectId)
        if (!cart) {
            cart = new Cart({ _id: userObjectId, products: [] })
        }
        const existingProductIndex = cart.products.findIndex(
            (item) => item.productId.toHexString() === productId
        )
        if (existingProductIndex !== -1) {
            cart.products[existingProductIndex].quantity += quantity
        } else {
            cart.products.push({
                productId,
                quantity
            })
        }
        await cart.save()
        return res.status(200).json(cart)
    } catch (error) {
        console.error('Error adding to cart:', error)
        return res.status(500).json({
            error: "Error adding to cart"
        })
    }
})

// GET - get cart
router.get('/:userId', async(req, res) => {
    const { userId } = req.params
    try {
        const cart = await Cart.findById(userId).populate({
            path: 'products.productId',
            model: 'Product'
        })
        console.log('cart', cart)
        return res.status(200).json(cart)
    } catch (error) {
        console.log(error)
        return res.status(500).json({
            error: "Error fetching cart"
        })
    }
})

// PUT - Update product quantity in the cart
router.put('/update', async (req, res) => {
    console.log('req.body: ', req.body)
    const { userId, productId, quantity } = req.body;

    // Validate input
    if (!userId || !productId || !quantity || quantity <= 0) {
        return res.status(400).json({
            error: "Invalid input: userId, productId, and quantity are required, and quantity must be greater than 0."
        });
    }

    try {
        // Convert userId to ObjectId
        const userObjectId = new mongoose.Types.ObjectId(userId);

        // Find the cart by userId
        let cart = await Cart.findById(userObjectId);
        if (!cart) {
            return res.status(404).json({
                error: "Cart not found for this user."
            });
        }

        // Find the index of the product to update
        const productIndex = cart.products.findIndex(
            (item) => item.productId.toHexString() === productId
        );

        if (productIndex === -1) {
            return res.status(404).json({
                error: "Product not found in the cart."
            });
        }

        // Update the quantity of the product
        cart.products[productIndex].quantity = quantity;

        // Save the updated cart
        await cart.save();

        return res.status(200).json(cart);
    } catch (error) {
        console.error('Error updating product quantity in cart:', error);
        return res.status(500).json({
            error: "Error updating product quantity in cart"
        });
    }
});

// DELETE - Remove product from cart
router.delete('/remove', async (req, res) => {
    console.log('req.body: ', req.body)
    const { userId, productId } = req.body;

    // Validate input
    if (!userId || !productId) {
        return res.status(400).json({
            error: "Invalid input: userId and productId are required."
        });
    }

    try {
        // Convert userId to ObjectId
        const userObjectId = new mongoose.Types.ObjectId(userId);

        // Find the cart by userId
        let cart = await Cart.findById(userObjectId);
        if (!cart) {
            return res.status(404).json({
                error: "Cart not found for this user."
            });
        }

        // Find the index of the product to remove
        const productIndex = cart.products.findIndex(
            (item) => item.productId.toHexString() === productId
        );

        if (productIndex === -1) {
            return res.status(404).json({
                error: "Product not found in the cart."
            });
        }

        // Remove the product from the cart
        cart.products.splice(productIndex, 1);

        // Save the updated cart
        await cart.save();

        return res.status(200).json(cart);
    } catch (error) {
        console.error('Error removing from cart:', error);
        return res.status(500).json({
            error: "Error removing product from cart"
        });
    }
});

module.exports = router
