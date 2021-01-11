/**
 * @api { get } /rant/post/rants/tag/:tag?numRequest=0 GetRants By Tag
 * @apiName getRantsByTag
 * @apiGroup Post Rant
 * @apiVersion 1.0.0
 *
 *
 *
 * @apiParam {string} tag Request param representing the tag to get rantsfor
 * @apiParam {number{0..}} numRequest Query param to represent pages
 *
 *
 * @apiSuccess {number} status    HTTP(s) status code
 * @apiSuccess {object} message   <a href="#api-Post_Rant-getRants">getRant documentation</a>
 *
 *
 * @apiParamExample {json} Request-Example:
 *       /rant/post/rants/tag/student?numRequest=0
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
 *
 * @apiError RANT_NOT_VALID_LOAD_NUM_REQUEST  When numRequest is not a number
 * @apiError RANT_READ_EXHAUSTED              No more rant to read
 * @apiError RANT_READ_TAG_NOT_ALLOWED        This tag has been muted by you, please update your settings and come back to this page
 *
 **/
