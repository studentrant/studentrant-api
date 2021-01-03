/**
 * @api { get } /rant/post/rant/:rantId Get one rant
 * @apiName    getRant
 * @apiGroup   Post Rant
 * @apiVersion 1.0.0
 *
 *
 * @apiParam {string} rantId  The rant id should be pass as request paramter, this represents the rant the user wants to get
 *
 *
 * @apiSuccess {number} status HTTP status code
 * @apiSuccess {object} message Success response object
 * @apiSuccess {string[]} message.tags Array of tags for this rant
 * @apiSuccess {number} message.when This property is different from the when property sent when editing a rant, this property represents the time the rant was initially created
 * @apiSuccess {string} message.rantId Unique Identifier of rant
 * @apiSuccess {string} message.rantPoser Username of rant creator
 * @apiSuccess {string} message.rant  Rant content
 * @apiSuccess {object[]} message.rantComments comments related to this rant
 * @apiSuccess {deleted=false} message.deleted This property represents if a rant has been deleted or not
 * @apiSuccess {object} message.edit The edit property holds information about the edition history of this rant
 * @apiSuccess {boolean=true} message.edit.isEdited Identifies if a rant has been deleted or not. Whenever a rant is edited this property is always true
 * @apiSuccess {object[]} message.edit.editHistory An array of object that represents the edit history of this rant. Whenever an edit is made on a rant, `message.edit.editHistory` holds the history of the edit(s) that has been made
 * @apiSuccess {number} message.edit.editHistory.when Timestamp of when an edit was made
 * @apiSuccess {object[]} message.edit.editHistory.diff Array of object representing text changes and if that text was added or removed, see https://www.npmjs.com/package/diff#examples
 * @apiSuccess {string} message.edit.editHistory.diff.value The text that was added or removed
 * @apiSuccess {boolean=true,false} message.edit.editHistory.diff.added This property can either be true or false depending on `message.edit.editHistory.diff.value`. If `message.edit.editHistory.diff.value` is an added text `message.edit.editHistory.diff.added` will be true but false if `message.edit.editHistory.diff.value` was removed
 * @apiSuccess {boolean=true,false} message.edit.editHistory.diff.removed This property can either be true or false depending on `message.edit.editHistory.diff.value`. If `message.edit.editHistory.diff.value` is a removed text `message.edit.editHistory.diff.removed` will be true but false if `message.edit.editHistory.diff.value` was added
 *  @apiSuccess {string} message.edit.editHistory.diffAgainst The rant that an edit was made on. This value keeps track of what the rant was, before an edition was made on it
 *
 * @apiSuccess {number} message.rantUpvoteCount   Upvote count of the rant
 * @apiSuccess {number} message.rantDownvoteCount Downvote count of the rant
 *
 * @apiParamExample {json} Request-Example:
 *  /rant/post/rant/eeee-ffff-0000-9999-gggg
 *
 * @apiSuccessExample {json} Success-Response:
 *         HTTP/1.1 200 OK
 *         {
 *             status: 200,
 *             message  : {
 *                tags        : [ "foo", "bar" ]
 *                when        : 1596948381262
 *                rantId      : "eee-ffff-00000-1111-22222",
 *                rantPoster  : "username",
 *                rant        : "L O dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
 *                rantComments : [{}],
 *                deleted      : false,
 *                edit         : {
 *                   isEdited    : true,
 *                   editHistory : [
 *                         { when: 1596978723642 , diff: { value: "Lorem ipsum", removed: true, added: false} },
 *                         { when: 1596978723642 , diff: { value: "L O", removed: added: true } }
 *                    ]
 *                 diffAgainst: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat."
 *                },
 *                rantUpvoteCount   : 532,
 *                rantDownvoteCount : 7
 *             }
 *         }
 *
 *
 *
 *
 * @apiError RANT_ID_IS_UNDEFINED   RantId parameter is not specified
 * @apiError RANT_DOES_NOT_EXISTS   RantId does not exists
 * @apiError RANT_HAS_ALREADY_BEEN_DELETED  Rant has been deleted
 *
 **/
