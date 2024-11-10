const { Cart } = require('../models/cart')
const express = require('express')
const router = express.Router()

// POST - add product to cart
router.post('/add', async(req, res) => {
    const { userId, productId, quantity } = req.body
    try {
        let cart = await Cart.findById(userId)
        if (!cart) {
            cart = new Cart({ _id: userId, products: [] })
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
        return res.status(200).json(cart)
    } catch (error) {
        return res.status(500).json({
            error: "Error fetching cart"
        })
    }
})

module.exports = router
