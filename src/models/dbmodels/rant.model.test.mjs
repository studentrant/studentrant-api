import RantsCollection from "./rant.model.js";

describe("Rant [Model]", () => {
  const when  = Date.now();
  const rant  = new RantsCollection({
    tags: [ 'test' ],
    when,
    rantId: 'unique_id',
    rant:  'hello rant',
    rantUpvote  : 12,
    rantDownvote: 5
  });
  it('should be defined', () => {
    expect(rant).toBeDefined();
  });
  it('properties should be defined', () => {
    expect(rant.tags).toEqual([ 'test' ]);
    expect(rant.when).toEqual(when);
    expect(rant.rantId).toEqual('unique_id');
    expect(rant.rant).toEqual('hello rant');
    expect(rant.rantUpvote).toEqual(12);
    expect(rant.rantDownvote).toEqual(5);
    expect(rant.deleted).toEqual(false);
  });
});
