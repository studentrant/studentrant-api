/**
 * @api { post } /rant/post/upvote/:rantId Upvote Rant
 * @apiName     upvoteRant
 * @apiGroup    Post Rant
 * @apiVersion  1.0.0
 *
 *
 * @apiParam {string} rantId The rant id should be used as a param which will be represented as req.param.s, it's the unqiue identifier for teh rant the user wants to upvote
 *
 * @apiSuccess {number} status HTTP status code 
 * @apiSuccess {object} message Success response object
 * @apiSuccess {number} message.rantUpvoteCount Number of upvote
 * @apiSuccess {number} message.rantDownvoteCount Number of downvotes
 *
 *
 * @apiParamExample {json} Request-Example:
 *   /rant/post/vote/upvote/eeee-ffff-0000-9999-gggg
 *
 *
 * @apiSuccessExample {json} Success-Response:
 *        HTTP/1.1 200 OK
 *        {
 *           status  : 200,
 *           message : {
 *              rantUpvoteCount: 12,
 *              rantDownvoteCount: 5
 *           }
 *        }
 *
 *
 *
 * @apiError RANT_ID_IS_UNDEFINED          There is no id specified for the rant to modify
 * @apiError RANT_DOES_NOT_EXISTS          Rant to upvote does not exists
 * @apiError RANT_HAS_ALREADY_BEEN_DELETED Rant to upvote has been deleted
 *
 *
 **/
