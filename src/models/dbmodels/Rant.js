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
    rantUpvote   : Number,
    rantDownvote : Number,
});

export const rantsCollection = mongoose.model("Rants", RantSchema);
