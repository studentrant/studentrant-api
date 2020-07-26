import { v4 as uuidv4 } from "uuid";
export class PostRantService {
    constructor(rantDbUtils) {
        this.rantDbUtils = rantDbUtils;
    }
    async createRant(data) {
        const rantId = uuidv4();
        return await this.rantDbUtils.saveRant({ ...data , rantId });
    }
}
