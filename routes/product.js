const express = require('express');
const productRouter =  express.Router();
const auth = require('../middlewares/auth')
const {Product} = require('../models/product')


// /api/products?category=Essentials - to access, req.query.category
// /api/products:category=Essentials - to access, req.params.category

//category filter
productRouter.get('/api/products',auth,async (req,res)=>{
    try {
        const products = await Product.find({category: req.query.category});
        res.json(products);
    } catch (e) {
        res.send(500).json({error: e.message});
    }
})

// search api
productRouter.get('/api/products/search/:name',auth,async (req,res)=>{
    try {
        // const products = await Product.find({name: req.params.name}); // we could have used this, but this will return data only when the param is specific

        const products = await Product.find({
            name: { $regex: req.params.name, $options: "i"} // it will also show the related product using patterns
        });
        res.json(products); 
    } catch (e) {
        res.send(500).json({error: e.message});
    }
});

// ratings
productRouter.post('/api/rate-product',auth,async (req,res)=>{
    try {
        const {id,rating} = req.body;  // this id is product id
        let product = await Product.findById(id);

        for (let i = 0; i < product.ratings.length; i++) {
            if (product.ratings[i].userId == req.user) { //req.user means userId from auth middleware
                product.ratings.splice(i, 1); // this will delete existing object if found. Here i is the index to be deleted and 1 is the number of objs to delete after this index
            }
        }

        const ratingSchema =  {
            userId: req.user,
            rating:rating,
        }

        product.ratings.push(ratingSchema);
        product = await product.save();
        res.json(product);

    } catch (e) {
        res.send(500).json({error: e.message});
    }
})

// deals of the day
productRouter.get('/api/deal-of-day',auth,async (req, res) => {
    try {
        let products = await Product.find({});
        products.sort((productX, productY) =>{
            let xSum =0, ySum = 0;
            for(let i=0; i<productX.ratings.length; i++){
                xSum += productX.ratings[i].rating;
            }
            for(let i=0; i<productY.ratings.length; i++){
                ySum += productY.ratings[i].rating;
            }
            return xSum > ySum ? 1:-1;
        });
        res.json(products[0]);
       
    } catch (e) {
        res.send(500).json({error: e.message});        
    }
})

module.exports = productRouter;