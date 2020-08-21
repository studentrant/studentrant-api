export class Collection {
    constructor()             {}
    save()                    {}
    static findOne(value)          { return { lean() { return Promise.resolve(value); } }; }
    static updateOne(value)        { return { lean() { return Promise.resolve(value); } }; }
    static findOneAndUpdate(value) { return { lean() { return Promise.resolve(value); } }; }
}


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
