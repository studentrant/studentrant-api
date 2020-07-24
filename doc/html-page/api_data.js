define({ "api": [
  {
    "type": " post ",
    "url": "/register/reg-first-step",
    "title": "First registration step of user",
    "name": "firstRegStep",
    "group": "Register",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "object",
            "optional": false,
            "field": "req.body",
            "description": "<p>body data</p>"
          },
          {
            "group": "Parameter",
            "type": "string",
            "optional": false,
            "field": "req.body[email]",
            "description": "<p>email address of user</p>"
          },
          {
            "group": "Parameter",
            "type": "string",
            "size": "5..",
            "optional": false,
            "field": "req.body[username]",
            "description": "<p>username of user</p>"
          },
          {
            "group": "Parameter",
            "type": "password",
            "size": "8..",
            "optional": false,
            "field": "req.body[password]",
            "description": "<p>password of user</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "Object",
            "optional": false,
            "field": "res.body",
            "description": "<p>response body</p>"
          },
          {
            "group": "Success 200",
            "type": "Number",
            "optional": false,
            "field": "res.body[status]",
            "description": "<p>http status code response</p>"
          },
          {
            "group": "Success 200",
            "type": "Object",
            "optional": false,
            "field": "res.body[message]",
            "description": "<p>response message to be consumed by the client</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "res.body.message[email]",
            "description": "<p>email address of the user</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "res.body.message[username]",
            "description": "<p>username of the suer</p>"
          },
          {
            "group": "Success 200",
            "type": "Boolean",
            "allowedValues": [
              "false"
            ],
            "optional": false,
            "field": "res.body.message[completeReg]",
            "description": "<p>This value is set to false because the user has not completed the second registration step, if user decides to logout and login back, this property should be check first to know if the user should be taken to the dashboard or the second registration step</p>"
          },
          {
            "group": "Success 200",
            "type": "Boolean",
            "allowedValues": [
              "false"
            ],
            "optional": false,
            "field": "res.body.message[verified]",
            "description": "<p>This value is set to false until the user has verified their email address, if the user has not verified the email address, they should always see a message on their dashboard telling them to verify their email address</p>"
          }
        ]
      }
    },
    "error": {
      "fields": {
        "Error 4xx": [
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "INVALID_LOGIN_USERNAME_EMAIL_NO_FIELD",
            "description": "<p>username/email field is undefined</p>"
          },
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "INVALID_LOGIN_USERNAME_LENGTH",
            "description": "<p>username length is less than 5</p>"
          },
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "INVALID_LOGIN_PASSWORD_NO_FIELD",
            "description": "<p>password field is undefined</p>"
          },
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "INVALID_LOGIN_PASSWORD_LENGTH",
            "description": "<p>password field is less than 8</p>"
          },
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "INVALID_LOGIN_PASSWORD_NO_DIGIT",
            "description": "<p>password does not contain any number</p>"
          },
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "INVALID_LOGIN_PASSWORD_NO_CHARS",
            "description": "<p>password does not contain any characters</p>"
          }
        ]
      }
    },
    "version": "0.0.0",
    "filename": "src/controllers/register.js",
    "groupTitle": "Register"
  },
  {
    "type": " patch ",
    "url": "/register/reg-last-step",
    "title": "Last registration step of user",
    "name": "lastRegStep",
    "group": "Register",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "object",
            "optional": false,
            "field": "req.body",
            "description": "<p>body data</p>"
          },
          {
            "group": "Parameter",
            "type": "string",
            "optional": false,
            "field": "req.body[country]",
            "description": "<p>country of the user</p>"
          },
          {
            "group": "Parameter",
            "type": "array",
            "optional": false,
            "field": "req.body[interests]",
            "description": "<p>what the user is interested in (we would use their interest to show them rants)</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "Object",
            "optional": false,
            "field": "res.body",
            "description": "<p>response body</p>"
          },
          {
            "group": "Success 200",
            "type": "Number",
            "optional": false,
            "field": "res.body[status]",
            "description": "<p>http status code response</p>"
          },
          {
            "group": "Success 200",
            "type": "Object",
            "optional": false,
            "field": "res.body[message]",
            "description": "<p>response message to be consumed by the client</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "res.body.message[email]",
            "description": "<p>email address of the user</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "res.body.message[username]",
            "description": "<p>username of the suer</p>"
          },
          {
            "group": "Success 200",
            "type": "Boolean",
            "allowedValues": [
              "true"
            ],
            "optional": false,
            "field": "res.body.message[completeReg]",
            "description": "<p>This value is set to true because the user has completed the registration step</p>"
          },
          {
            "group": "Success 200",
            "type": "Boolean",
            "allowedValues": [
              "false"
            ],
            "optional": false,
            "field": "res.body.message[verified]",
            "description": "<p>This value is set to false until the user has verified their email address, if the user has not verified the email address, they should always see a message on their dashboard telling them to verify their email address</p>"
          }
        ]
      }
    },
    "error": {
      "fields": {
        "Error 4xx": [
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "COUNTRY_PROPERTY_UNDEFINED",
            "description": "<p>country is undefined</p>"
          },
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "INVALID_COUNTRY_LENGTH",
            "description": "<p>country length is less than 1</p>"
          },
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "NO_INTEREST_FIELD",
            "description": "<p>interests is undefined</p>"
          },
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "NO_ARRAY_INTEREST",
            "description": "<p>interests is not an array field</p>"
          },
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "NO_INTEREST_LENGTH",
            "description": "<p>interest array length is 0</p>"
          }
        ]
      }
    },
    "version": "0.0.0",
    "filename": "src/controllers/register.js",
    "groupTitle": "Register"
  },
  {
    "type": " patch ",
    "url": "/register/verification/:token",
    "title": "Verify user token",
    "name": "tokenVerification",
    "group": "Register",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "object",
            "optional": false,
            "field": "req.params",
            "description": "<p>params data</p>"
          },
          {
            "group": "Parameter",
            "type": "string",
            "optional": false,
            "field": "req.body[token]",
            "description": "<p>verification token</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "Object",
            "optional": false,
            "field": "res.body",
            "description": "<p>response body</p>"
          },
          {
            "group": "Success 200",
            "type": "Number",
            "optional": false,
            "field": "res.body[status]",
            "description": "<p>http status code response</p>"
          },
          {
            "group": "Success 200",
            "type": "Object",
            "optional": false,
            "field": "res.body[message]",
            "description": "<p>response message to be consumed by the client</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "res.body.message[email]",
            "description": "<p>email address of the user</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "res.body.message[username]",
            "description": "<p>username of the suer</p>"
          },
          {
            "group": "Success 200",
            "type": "Boolean",
            "allowedValues": [
              "true"
            ],
            "optional": false,
            "field": "res.body.message[completeReg]",
            "description": "<p>This value is set to true because the user has completed the registration step</p>"
          },
          {
            "group": "Success 200",
            "type": "Boolean",
            "allowedValues": [
              "true"
            ],
            "optional": false,
            "field": "res.body.message[verified]",
            "description": "<p>This value is set to false until the user has verified their email address, if the user has not verified the email address, they should always see a message on their dashboard telling them to verify their email address</p>"
          }
        ]
      }
    },
    "error": {
      "fields": {
        "Error 4xx": [
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "INVALID_VERIFICATION_TOKEN",
            "description": ""
          }
        ]
      }
    },
    "version": "0.0.0",
    "filename": "src/controllers/register.js",
    "groupTitle": "Register"
  }
] });
