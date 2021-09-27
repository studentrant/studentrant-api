const registerConstants = {
  EMAIL_ALREADY_EXISTS: 'The provided email address is not available',
  // eslint-disable-next-line
EMAIL_REGEXP: /^(?:[a-z0-9!#$%&"*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&"*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])$/i,
  USERNAME_ALREADY_EXISTS: 'The provided username already exists',
  INVALID_VERIFICATION_TOKEN: 'The verification link you followed is invalid',
  INCOMPLETE_REGISTRATION: 'Registration is not complete yet',
  UNVERIFIED_EMAIL: 'Email address is not verified yet, check your mail box for a verification link, or click the below button to get a verification link',
  NO_EMAIL_FIELD: 'Email field is required',
  COUNTRY_PROPERTY_UNDEFINED: 'country value is required',
  INVALID_COUNTRY_LENGTH: 'specified country does not exists',
  NO_INTEREST_FIELD: 'interest field is empty',
  NO_ARRAY_INTERESTS: 'interest field is empty',
  NO_INTERESTS_LENGTH: 'interest field is empty',
  NO_AVATAR_FIELD: 'kindly set an avatar',
};

export default registerConstants;
