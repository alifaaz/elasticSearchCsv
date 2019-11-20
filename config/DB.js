// const mongoose = "mongoose";
// import { mongo, env } from './config';
const mongoose = require('mongoose');

// if (env === 'development') {
    // }
    
        mongoose.set('debug', true);
// exit with error
// mongoose.connection.on('error', (err) => {
//     log(`mongodb error ${err}`, 'err');
// });


/**
 * connect to db
 *
 * @return {object} - connection object
 * @public
 */


module.exports =  () => {
    mongoose.connect("mongodb://music:123456@localhost:27017/music?authSource=admin", {
		/**
	 * @keepAlive - to send packet every 120ms to checkk conectivity
	 * @poolSize - number of socket to run operation on dbs
	 * @reconntTries - number of tried connection after its drop
	 * @reconnctInterval - time by ms of try to connect when its drop
	 */
     useUnifiedTopology: true ,
        useNewUrlParser: true,
        keepAlive: 120,
        poolSize: 10,
        reconnectTries: Number.MAX_VALUE,
        reconnectInterval: 500,
        useFindAndModify: false,

    });
    return mongoose.connection;
};
