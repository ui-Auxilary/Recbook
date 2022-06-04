const mongoose = require('mongoose');
const { db } = require('./models/book');

module.exports = {
        connect: DB_HOST => {
                mongoose.connect(process.env.DB_HOST);
                mongoose.connection.on('error', err=> {
                        console.log(err);
                        console.log('Mongo connection error')
                        process.exit();
                });
        },

        close: () => {
                mongoose.connection.close();
        }
}
