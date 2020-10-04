/* eslint-disable no-restricted-syntax */
/* eslint-disable no-await-in-loop */
export default class DbUtils {
  static async ResourceExists(coll = [], resource) {
    const collections = Array.isArray(coll) ? coll : [coll];
    const [[key, value]] = Object.entries(resource);
    for (const col of collections) {
      const val = await col.findOne({ [key]: value });
      if (val) {
        return {
          collection: col, exists: true, data: val,
        };
      }
    }
    return { exist: false };
  }
}
