const rantConstants = {
  RANT_LENGTH_NOT_MORE_THAN_TWENTY: 'Rant cannot be created because it is less than 20',

  RANT_BODY_UNDEFINED: 'Rant body data is not defined',
  RANT_TAGS_NOT_AN_ARRAY: 'Expect an array as rant tags but got ',
  RANT_TAGS_UNDEFINED: 'Tag body data is not defined',
  RANT_ID_IS_UNDEFINED: 'There is no id specified for the rant to modify',
  RANT_DOES_NOT_EXISTS: 'The requested rant to modify does not exist',
  RANT_NOT_USER: 'You are not allowed to modify this rant at this time',
  RANT_SUCCESSFULLY_DELETED: 'Rant has been deleted succefully',
  RANT_WHEN_NO_EXISTS: 'A when field is required, it carries the timestamp of when the edit request was made',
  RANT_NOT_NUMBER: 'when property must be a number',
  RANT_NOT_VALID_TIMESTAMP: 'Invalid timestamp information passed as value to the when property',
  RANT_HAS_ALREADY_BEEN_DELETED: 'Rant has already been deleted',
};

export default rantConstants;
