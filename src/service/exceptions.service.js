class Exceptions extends Error {
    constructor(message,errorName,errorDetails) {
        super(message);
        this.name = errorName;
        this.errorDetails = errorDetails;
    }
}



export const ExistsException = message => {
    return new Exceptions(
        message,
        "ExistsException",
        {
	    status: 409,
	    message
        }
    );
};

export const UnAuthorizedAccessException = message => {
    return new Exceptions(
	message,
	"UnAuthorizedAccessException",
	{
	    status: 401,
	    message
	}
    );
};

export const BadValueException = message => {
    return new Exceptions(
	message,
	"BadValueException",
	{
	    status: 412,
	    message
	}
    );
};

export const NotFoundException = message => {
    return new Exceptions(
	message,
	"NotFoundException",
	{
	    status: 404,
	    message
	}
    );
};
