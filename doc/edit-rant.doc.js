/**
 * @api { patch } /rant/post/edit/:rantId Edit Rant
 * @apiName  editRant
 * @apiGroup Post Rant
 * @apiVersion 1.0.0
 *
 *
 * @apiParam {string} rantId This rant id should be used as a param which will be represented as req.params, it's the unique identifier for the rant the user wants to edit
 *
 * @apiParam {string[]} tags Just like in the creating of rants, it represents new values to add in the rant tags
 * @apiParam {string} rant The edited rant
 * @apiParam {number} when The timestamp of when the edition was made
 *
 *
 * @apiSuccess {number} status HTTP status code
 * @apiSuccess {object} message Success response object
 * @apiSuccess {string[]} message.tags Array of tags for this rant
 * @apiSuccess {number} message.when This property is different from the when property sent when editing a rant, this property represents the time the rant was initially created
 * @apiSuccess {string} message.rantId Unique Identifier of rant
 * @apiSuccess {string} message.rantPoser Username of rant creator
 * @apiSuccess {string} message.rant Edited Rant
 * @apiSuccess {object[]} message.rantComments comments related to this rant
 * @apiSuccess {deleted=false} message.deleted This property represents if a rant has been deleted or not
 * @apiSuccess {object} message.edit The edit property holds information about the edition history of this rant
 * @apiSuccess {boolean=true} message.edit.isEdited Identifies if a rant has been deleted or not. Whenever a rant is edited this property is always true
 * @apiSuccess {object[]} message.edit.editHistory An array of object that represents the edit history of this rant. Whenever an edit is made on a rant, `message.edit.editHistory` holds the history of the edit(s) that has been made
 * @apiSuccess {number} message.edit.editHistory.when Timestamp of when this edit was made
 * @apiSuccess {object[]} message.edit.editHistory.diff Array of object representing text changes and if that text was added or removed, see https://www.npmjs.com/package/diff#examples
 * @apiSuccess {string} message.edit.editHistory.diff.value The text that was added or removed
 * @apiSuccess {boolean=true,false} message.edit.editHistory.diff.added This property can either be true or false depending on `message.edit.editHistory.diff.value`. If `message.edit.editHistory.diff.value` is an added text `message.edit.editHistory.diff.added` will be true but false if `message.edit.editHistory.diff.value` was removed
 * @apiSuccess {boolean=true,false} message.edit.editHistory.diff.removed This property can either be true or false depending on `message.edit.editHistory.diff.value`. If `message.edit.editHistory.diff.value` is a removed text `message.edit.editHistory.diff.removed` will be true but false if `message.edit.editHistory.diff.value` was added
 *  @apiSuccess {string} message.edit.editHistory.diffAgainst The rant that an edit was made on. This value keeps track of what the rant was, before an edition was made on it
 *
 * @apiSuccess {number} message.rantUpVote Upvote count of the rant
 * @apiSuccess {number} message.rantDownVote Downvote count of the rant
 *
 * @apiParamExample {json} Request-Example:
 *        /rant/post/edit/eeee-ffff-0000-9999-gggg
 *  {
 *     rant: "L O dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat."
 *     tags: [ "foo", "bar"],
 *     when: 1596978723642
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
 *                rantUpVote   : 532,
 *                rantDownVote : 7
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
 * @apiError RANT_ID_IS_UNDEFINED           There is no id specified for the rant to modify
 * @apiError RANT_DOES_NOT_EXISTS           The requested rant to modify does not exist
 * @apiError RANT_HAS_ALREADY_BEEN_DELETED  Rant has already been deleted
 * @apiError RANT_NOT_USER                  You are not allowed to modify this rant at this time
 *

 **/
