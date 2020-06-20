import { rants } from "../../models/dbmodels/index.js";

export default class RantDbUtils {
    static async SaveRant(data) {
        await (new rants(data).save());
        return await rants.findOne({ rantId: data.rantId }, {
	    _id: false,
	    __v: false
        }).lean();
    }
}
