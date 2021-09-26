import RantsCommentCollection from "./rantcomments.model.js";

import mongoose from 'mongoose';

import { v4 as uuidv4 } from 'uuid';

describe("RantComments [Model]", () => {
  const rantComments = new RantsCommentCollection(
    {
      rantId: uuidv4(),
      rantCommentId: mongoose.Types.ObjectId(),
      rantCommenter: 'xxxx',
      rantCommentUpvote: 1,
      rantCommentDownvote: 3
    }
  );

  it('should be defined', () => {
    expect(rantComments).toBeDefined();
  });
  it('should have all fields', () => {
    expect(rantComments.rantId).toBeDefined();
    expect(rantComments.rantCommentId).toBeDefined();
    expect(rantComments.rantCommenter).toEqual('xxxx');
    expect(rantComments.rantCommentUpvote).toEqual(jasmine.any(Array));
    expect(rantComments.rantCommentDownvote).toEqual(jasmine.any(Array));
  });
});
