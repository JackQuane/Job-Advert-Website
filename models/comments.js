var mongoose = require('mongoose');
var Schema = mongoose.Schema;
require('./util');

var commentSchema = new Schema({
	userName: {type: String},
	comment: {type: String},
    title: {type: String},
    price: {type: Number, default : 0},
    location: {type: String},
    category: {type: String},
	date_created: {type: Date, default: new Date()},
	up_votes: {type: Number, default : 0},
	down_votes: {type: Number, default : 0}
});

module.exports = mongoose.model('Comment', commentSchema);	

