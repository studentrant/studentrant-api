import mongoose from "mongoose";

const RantSchema = new mongoose.Schema({
    tags: {
        type   : Array,
    },
    rantId: {
        type   : String,
        unique : true
    },
    rantPoster: {
        type  : String,
        ref   : "Users",
        index : true
    },
    rant: {
        type : String
    },
    rantComments: [{
        rantcommentId      : String,
        parentCommentId    : String,
        childrenCommentId  : [{type: String}]
    }],
    deleted      : {
        type     : Boolean,
        default  : false
    },
    edit: {
	isEdited    : {
	    type    : Boolean,
	    default : false
	},
	editHistory : [
	    {
		when : Number,
		diff : [
		    {
			value   : String,
			added   : Boolean,
			removed : Boolean
		    }
		],
		diffAgainst : String
	    }
	]
    },
    rantUpvote   : Number,
    rantDownvote : Number,
});

export const rantsCollection = mongoose.model("Rants", RantSchema);
