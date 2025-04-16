'use strict';
const axios = require('axios');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();

async function connect() {
    await mongoose.connect(process.env.MONGO_URI);
}
connect();

const IPSchema = new mongoose.Schema({
    ip: String,
    stock: String
});

const IP = mongoose.model('IP', IPSchema);

const likeSchema = new mongoose.Schema({
    stock: String,
    likes: { type: Number, default: 0 }
});

const Like = mongoose.model("Like", likeSchema);

module.exports = function (app) {

  app.route('/api/stock-prices')
    .get(async function (req, res){
        const stock = req.query.stock;

        if(Array.isArray(stock)) {
            const exists0 = await IP.find({ ip: req.ip, stock: stock[0] });
            const exists1 = await IP.find({ ip: req.ip, stock: stock[1]});
            if(!exists0) create(req.ip, stock[0], req.query.like);
            if(!exists1) create(req.ip, stock[1], req.query.like); 
            const like1 = await Like.findOne({ stock: stock });
            const like1Count = like1? like1.likes : 0;
            const like2 = await Like.findOne({ stock: stock });
            const like2Count = like2? like2.likes : 0;
            const relLikes = Math.abs(like1Count - like2Count);

            const response1 = await axios.get(`https://stock-price-checker-proxy.freecodecamp.rocks/v1/stock/${stock[0]}/quote`);
            const response2 = await axios.get(`https://stock-price-checker-proxy.freecodecamp.rocks/v1/stock/${stock[1]}/quote`);
            const price1 = response1.data.latestPrice;
            const price2 = response2.data.latestPrice;

            res.json({
                stockData: [
                    {
                        stock: stock[0],
                        price: price1,
                        rel_likes: relLikes
                    },
                    {
                        stock: stock[1],
                        price: price2,
                        rel_likes: relLikes
                    }
                ]
            });
        } else {
            const response = await axios.get(`https://stock-price-checker-proxy.freecodecamp.rocks/v1/stock/${stock}/quote`);
            const price = response.data.latestPrice;
            const likes = await Like.findOne({ stock: stock});
            const likesCount = likes? likes.likes : 0;
            
            res.json({
                stockData: {
                    stock: stock,
                    price: price,
                    likes: likesCount
                }
            });
        }
    });

    async function create(ip, stock, like) {
        await IP.create({ ip: ip, stock: stock });
        if(like) {
            await Like.updateOne(
                { stock: stock },
                { $inc: { likes: 1 } },
                { upsert: true }
            );
        }
    }

};
