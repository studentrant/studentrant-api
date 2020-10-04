/**
 * @api { post } /rant/post/create Create Rant
 * @apiName createRant
 * @apiGroup Post Rant
 * @apiVersion 1.0.0
 *
 * @apiParam {string{20..}} rant This is the content the user is posting (the actual rant)
 * @apiParam {string[]} tags Array of tags this rant should be associated with
 * @apiParam {number} when Timestamp that represents the creation time
 *
 *
 * @apiSuccess {number} status http status code
 * @apiSuccess {object} message success message response
 * @apiSuccess {string[]} message.tags Array of tags the rant is associated with
 * @apiSuccess {number} message.when Timestamp that represents the creation time
 * @apiSuccess {string} message.rantId Unique Identifier for the rant
 * @apiSuccess {string} message.rantPoster Username of rant poster
 * @apiSuccess {string{20..}} message.rant This is the content the user is posting (the actual rant)
 * @apiSuccess {object[]} message.rantComments All comments associated with this rant (but this will be an empty array since this rant has just been created)
 * @apiSuccess {boolean=false} message.deleted This property will be false, but it's used to mark if a rant is deleted or not, since this rant has just been created, this property will default to false
 * @apiSuccess {object={}} message.edit This will be an empty object, but the properties of this object keeps track of edition history of the posted rant
 * @apiSuccess {number=0} message.rantUpVote Upvote count of the rant
 * @apiSuccess {number=0} message.rantDownVote Downvote count of the rant
 *
 * @apiParamExample {json} Request-Example:
 *  {
 *     rant: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat."
 *     tags: [ "foo", "bar"],
 *     when: 1596948381262
 *  }
 *
 * @apiSuccessExample {json} Success-Response:
 *         HTTP/1.1 201 Created
 *         {
 *             status: 201,
 *             message  : {
 *                tags        : [ "foo", "bar" ]
 *                when        : 1596948381262
 *                rantId      : "eee-ffff-00000-1111-22222",
 *                rantPoster  : "username",
 *                rant        : "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
 *                rantComments : [{}],
 *                deleted      : false,
 *                edit         : {},
 *                rantUpVote   : 0,
 *                rantDownVote : 0
 *             }
 *         }
 *
 * @apiError RANT_BODY_UNDEFINED                  Rant body data is not defined
 * @apiError RANT_LENGTH_NOT_MORE_THAN_TWENTY     Rant cannot be created because it is less than 20
 * @apiError RANT_TAGS_UNDEFINED                  Tag body data is not defined
 * @apiError RANT_TAGS_NOT_AN_ARRAY               Expect an array as rant tags but got
 * @apiError RANT_WHEN_NO_EXISTS                  A when field is required, it carries the timestamp of when the edit request was made
 * @apiError RANT_NOT_NUMBER                      when property must be a number
 * @apiError RANT_NOT_VALID_TIMESTAMP             Invalid timestamp information passed as value to the when property
 * */
