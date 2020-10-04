const loginConstants = {
  INVALID_LOGIN_CREDENTIALS: 'The provided username/email and/or password is incorrect',
  INVALID_LOGIN_PASSWORD_NO_FIELD: 'The password field cannot be emtpy',
  INVALID_LOGIN_PASSWORD_LENGTH: 'The password field must not be less than 8',
  INVALID_LOGIN_PASSWORD_NO_UPPER_CASE: 'The password field must contain upper case characters',
  INVALID_LOGIN_PASSWORD_NO_LOWER_CASE: 'The password field must contain lower case characters',
  INVALID_LOGIN_PASSWORD_NO_SPECIAL_CHARACTER: 'The password field must contain one of !@#$%^&*(),.?":{}|<>',
  INVALID_LOGIN_PASSWORD_NO_DIGIT: 'The password field must contain digits',
  INVALID_LOGIN_USERNAME_EMAIL_NO_FIELD: 'The username field cannot be empty',
  INVALID_LOGIN_USERNAME_LENGTH: 'The username field must not be more than five characters',
  INVALID_EMAIL: 'The email address provided is not valid',
};

export default loginConstants;
