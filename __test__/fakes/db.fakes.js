export const usersCollection = {
    findOne: (value) => Promise.resolve(value),
};

export const rantsCollection = {  
};

export class RegisterDbUtils {
    constructor()          {}
    updateNewUserDetails() {}
    checkEmail()           {}
    checkUserName()        {}
    saveNewUser()          {}
}

export class RantDbUtils {
    constructor() {}
    saveRant()    {}
}
