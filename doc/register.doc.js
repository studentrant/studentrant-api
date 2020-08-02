    /**
     * @api { post } /register/reg-first-step First registration step of user
     * @apiName firstRegStep
     * @apiGroup Register
     * @apiVersion 1.0.0
     *
     *
     * @apiParam {string}         email email address of user
     * @apiParam {string{5..}}    username username of user
     * @apiParam {password{8..}}  password password of user
     *
     * @apiParamExample {json} Request-Example:
     *  {
     *     email   : "foobar@example.com",
     *     username: "foobar",
     *     password: "HelloWorld123455!!"
     *  }
     *
     * @apiSuccess {number} status         http status code response
     * @apiSuccess {object} message        response message to be consumed by the client
     * @apiSuccess {string} message.email email address of the user
     * @apiSuccess {string} message.username username of the suer
     * @apiSuccess {boolean=false} message.completeReg This value is set to false because the user has not completed the second registration step, if user decides to logout and login back, this property should be check first to know if the user should be taken to the dashboard or the second registration step
     * @apiSuccess {boolean=false} message.verified This value is set to false until the user has verified their email address, if the user has not verified the email address, they should always see a message on their dashboard telling them to verify their email address
     *
     *
     * @apiSuccessExample {json} Success-Response:
     *         HTTP/1.1 201 Created
     *         {
     *             status: 201,
     *             message  : {
     *                email       : "foobar@example.com"
     *                username    : "foobar"
     *                completeReg : false,
     *                verified    : false
     *             }
     *         }
     *
     *
     * @apiError INVALID_LOGIN_USERNAME_EMAIL_NO_FIELD username/email field is undefined
     * @apiError INVALID_LOGIN_USERNAME_LENGTH         username length is less than 5
     * @apiError INVALID_LOGIN_PASSWORD_NO_FIELD       password field is undefined
     * @apiError INVALID_LOGIN_PASSWORD_LENGTH         password field is less than 8
     * @apiError INVALID_LOGIN_PASSWORD_NO_DIGIT       password does not contain any number
     * @apiError INVALID_LOGIN_PASSWORD_NO_CHARS       password does not contain any characters
     **/






    /**
     * @api { patch } /register/reg-last-step Last registration step of user
     * @apiName lastRegStep
     * @apiGroup Register
     * @apiVersion 1.0.0
     *
     * @apiParam {string}   country   country of the user
     * @apiParam {array}    interests what the user is interested in (we would use their interest to show them rants)
     *
     * @apiParamExample {json} Request-Example:
     *
     * {
     *    country: "Nigeria",
     *    interests: [ "teaching", "rant", "gossip" ]
     *  }
     *
     * @apiSuccess {number} status http status code response
     * @apiSuccess {object} message response message to be consumed by the client
     * @apiSuccess {string} message.email email address of the user
     * @apiSuccess {string} message.username username of the suer
     * @apiSuccess {boolean=true} message.completeReg This value is set to true because the user has completed the registration step
     * @apiSuccess {boolean=false} message.verified This value is set to false until the user has verified their email address, if the user has not verified the email address, they should always see a message on their dashboard telling them to verify their email address
     *
     *
     *
     *
     * @apiSuccessExample {json} Success-Response:
     *         HTTP/1.1 201 Created
     *         {
     *             status: 201,
     *             message  : {
     *                email       : "foobar@example.com"
     *                username    : "foobar"
     *                completeReg : false,
     *                verified    : false
     *
     *             }
     *         }
     *
     *
     * @apiError COUNTRY_PROPERTY_UNDEFINED      country is undefined
     * @apiError INVALID_COUNTRY_LENGTH          country length is less than 1
     * @apiError NO_INTEREST_FIELD               interests is undefined
     * @apiError NO_ARRAY_INTEREST               interests is not an array field
     * @apiError NO_INTEREST_LENGTH              interest array length is 0
     **/






    /**
     * @api { patch } /register/verification/:token Verify user token
     * @apiName tokenVerification
     * @apiGroup Register
     * @apiVersion 1.0.0
     *
     *
     * @apiParam {string}   token verification token
     *
     *
     * @apiSuccess {number} status http status code response
     * @apiSuccess {object} message response message to be consumed by the client
     * @apiSuccess {string} message.email email address of the user
     * @apiSuccess {string} message.username username of the suer
     * @apiSuccess {boolean=true} message.completeReg This value is set to true because the user has completed the registration step
     * @apiSuccess {boolean=true} message.verified This value is set to false until the user has verified their email address, if the user has not verified the email address, they should always see a message on their dashboard telling them to verify their email address
     *
     *
     * @apiSuccessExample {json} Success-Response:
     *         HTTP/1.1 200 OK
     *         {
     *             status: 200,
     *             message  : {
     *                email       : "foobar@example.com"
     *                username    : "foobar"
     *                completeReg : false,
     *                verified    : false
     *             }
     *         }
     *
     *
     * @apiError INVALID_VERIFICATION_TOKEN
     **/
