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
