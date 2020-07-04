const fetch = require("node-fetch");
const config = require("../config.js");
class LoomAi {
    constructor() {
        this.fetch = fetch;
        this.client_id = config.get("externalApis.loomai.client_id");
        this.client_secret = config.get("externalApis.loomai.client_secret");
    }

    static async HTTPRequest(url,options) {
        return await (await fetch( url, options )).json();
    }

    async getAccessToken() {
        return this.access_token = await LoomAi.HTTPRequest(
	    "https://auth.loomai.com/oauth/token",
	    {
                method: "POST",
                headers: { "Content-Type": "application/x-www-form-urlencoded" },
                body: `audience=https://api.loomai.com/&grant_type=client_credentials&client_id=${this.client_id}&client_secret=${this.client_secret}`
	    }
        ).access_token;
    }

    async createAvatar() {
	
    }


}
module.exports = LoomAi;
