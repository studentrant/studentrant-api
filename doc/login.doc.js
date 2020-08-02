/**
 * @api { post } /login login user
 * @apiName login
 * @apiGroup Login
 * @apiVersion 1.0.0
 *
 *
 * @apiParam {string{5..}} [username] The username of the user who wants to login, if username is absent, email address should be used
 * @apiParam {string} [email] The email address of the user who wants to login, if email address is absent, username should be used
 * @apiParam {password{8..}} password Users Password
 *
 *
 *
 * @apiParamExample {json} Request-Example:
 *  {
 *     username: "foobar",
 *     password: "HelloWorld123455!!"
 *  }
 *
 *
 * @apiParamExample {json} Request-Example:
 *  {
 *     email: "foobar@example.com",
 *     password: "HelloWorld123455!!"
 *  }
 *
 * @apiSuccess {string} email     Email address of user
 * @apiSuccess {string} username  Username of user
 * @apiSuccess {string} avatar    Avatar of user
 * @apiSuccess {number} dateOfReg Timestamp of when user registered
 * @apiSuccess {boolean} verified Email verification status of user
 * @apiSuccess {boolean} completeReg Flag to determine if user has complete the registration process
 *
 * @apiSuccessExample {json} Success-Response:
 *         HTTP/1.1 200 OK
 *         {
 *             status: 200,
 *             message  : {
 *                email       : "foobar@example.com"
 *                username    : "foobar"
 *                completeReg : true,
 *                verified    : true,
 *                avatar      : "https://lbalbal/balbal"
 *             }
 *         }
 *
 *
 *
 * @apiError INVALID_LOGIN_USERNAME_EMAIL_NO_FIELD username/email field is undefined
 * @apiError INVALID_LOGIN_USERNAME_LENGTH         username length is less than 5
 * @apiError INVALID_LOGIN_PASSWORD_NO_FIELD       password field is undefined
 * @apiError INVALID_LOGIN_PASSWORD_LENGTH         password field is less than 8
 * @apiError INVALID_LOGIN_PASSWORD_NO_DIGIT       password does not contain any number
 * @apiError INVALID_LOGIN_PASSWORD_NO_CHARS       password does not contain any characters
 **/
