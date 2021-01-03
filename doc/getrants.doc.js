/**
 * @api { get } /rant/post/rants/?numRquest=0 GetMore Rant
 * @apiName  getRants
 * @apiGroup Post Rant
 * @apiVersion 1.0.0
 *
 *
 *
 * @apiParam {number{0..}} numRequest  Query param representing pages
 *
 *
 *
 * @apiSuccess {number} status               HTTP status code
 * @apiSuccess {object} message              Success response object
 * @apiSuccess {object} message.rant         This object contains the
 * @apiSuccess {object[]} message.rant.rants An array of the rants <a href="#api-Post_Rant-getRant">getRant documentation</a>
 * @apiSuccess {boolean} message.rant.hasMore            Indicates if there is rants to load
 * @apiSuccess {object}  message.rant.page               Pagination information
 * @apiSuccess {number}  message.rant.page.totalRant     Total number of rants in the database
 * @apiSuccess {number}  message.rant.page.remainingRant Remaining rants to load
 *
 *
 * @apiParamExample {json} Request-Example:
 *       /rant/post/rants/?numRequest=0
 *
 * @apiSuccessExample {json} Success-Example:
 *        HTTP/1.1 200 OK
 *        {
 *            status: 200
 *            message:  {
 *                rant : {
 *                    rants   : see GetOne Rant documentation
 *                    hasMore : true
 *                    page    : { totalRant: 50, remainingRant: 15 }
 *                }
 *            }
 *        }
 *
 *
 *
 * @apiError RANT_NOT_VALID_LOAD_NUM_REQUEST  When numRequest is not a number
 * @apiError RANT_READ_EXHAUSTED              No more rant to read
 *
 * 
 **/
