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
                /** when signifies when the did edit was made**/
                when : Number,

                /** diff contains things the difference between
		 *  the edits made on the rant and what was initial the rant
		 *  the values here should be used to do a color change
		 **/

                diff : [
		    {
                        value   : String,
                        added   : Boolean,
                        removed : Boolean
		    }
                ],
                /** diffAgainst is the rant before it was edited **/
                diffAgainst : String
	    }
        ]
    },
    rantUpvote   : Number,
    rantDownvote : Number,
});

export const rantsCollection = mongoose.model("Rants", RantSchema);
