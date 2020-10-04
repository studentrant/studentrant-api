/**
 * @api { delete } /rant/post/delete/:rantId Delete Rant
 * @apiName deleteRant
 * @apiGroup Post Rant
 * @apiVersion 1.0.0
 *
 * @apiParam {string} rantId The rant unique identifier to delete
 *
 * @apiSuccess {number} status http status code
 * @apiSuccess {string} message success message response
 *
 *
 * @apiParamExample {json} Request-Example:
 *     /rant/post/delete/eeee-0000-ffff-9999
 *
 *
 *
 * @apiSuccessExample {json} Success-Response:
 *         HTTP/1.1 200 OK
 *
 *         {
 *            status  : 200,
 *            message : Rant has been deleted succefully
 *         }
 *
 *
 * @apiError RANT_ID_IS_UNDEFINED           There is no id specified for the rant to modify
 * @apiError RANT_DOES_NOT_EXISTS           The requested rant to modify does not exist
 * @apiError RANT_HAS_ALREADY_BEEN_DELETED  Rant has already been deleted
 * @apiError RANT_NOT_USER                  You are not allowed to modify this rant at this time
 *
 * */
