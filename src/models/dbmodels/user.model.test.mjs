import UsersCollection from "./user.model.js";

describe('User [Model]', () => {
  const user = new UsersCollection({
    username : 'user',
    email    : 'user@example.com',
    password : 'some_hash',
  });

  it('should be defined', () => {
    expect(user).toBeDefined();
  });

  it('all properties should be defined', () => {
    expect(user.username).toEqual('user');
    expect(user.email).toEqual('user@example.com');
    expect(user.password).toEqual('some_hash');
    expect(user.dateOfReg).toEqual(jasmine.any(Number));
    expect(user.verified).toBeFalsy();
  });
});
