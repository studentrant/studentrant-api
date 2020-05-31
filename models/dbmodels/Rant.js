import mongoose from "mongoose";

const RantSchema = new mongoose.Schema({
    tag: {
        type    : Array,
        default : [ "general" ]
    },
    rantId: {
        type   : String,
        unique : true
    },
    rantPoster: {
        type  : String,
        index : true
    },
    rantComments: [{
        rantcommentId      : String,
        parentCommentId    : String,
        childrenCommentId  : [{type: String}]
    }],
    rantUpvote   : Number,
    rantDownvote : Number,
});

export const rants = mongoose.model("Rants", RantSchema);
