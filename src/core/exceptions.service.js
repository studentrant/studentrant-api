class Exceptions extends Error {
  constructor(message, errorName, errorDetails) {
    super(message);
    this.name = errorName;
    this.errorDetails = errorDetails;
  }
}

export const ExistsException = (message) => new Exceptions(
  message,
  'ExistsException',
  {
    status: 409,
    message,
  },
);

export const UnAuthorizedAccessException = (message) => new Exceptions(
  message,
  'UnAuthorizedAccessException',
  {
    status: 401,
    message,
  },
);

export const BadValueException = (message) => new Exceptions(
  message,
  'BadValueException',
  {
    status: 412,
    message,
  },
);

export const NotFoundException = (message) => new Exceptions(
  message,
  'NotFoundException',
  {
    status: 404,
    message,
  },
);

// thrown when trying to access a deleted resource
export const GoneException = (message) => {
  throw new Exceptions(
    message,
    'GoneException',
    {
      status: 410,
      message,
    },
  );
};
