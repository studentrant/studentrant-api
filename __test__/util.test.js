// eslint-disable no-undef
export const login = (agent,cb) => {
    agent
        .post("/login")
        .send({ username: "testaccount", password: "12345689234abcd" })
        .expect(200).end((err,res) => {
	    expect(err).toBeNull();
	    cb(res.headers["set-cookie"]);
        });
};

export const createRant = (agent,cookie,cb) => { 
    agent
        .post("/rant/post/")
        .set("cookie", cookie)
        .send({
	    rant: "This is a rant about abuse in a school and how it has affected students",
	    tags: []
        })
        .expect(201).end((err,res) => {
	    expect(err).toBeNull();
	    cb(res.body.message.rantId);
        });  
};

export const createUser = (agent,cb) => {
    agent
        .post("/register/reg-first-step")
        .send({
	    username: "testrant",
	    password: "12345689234abcd",
	    email: "testrant@example.com"
        }).expect(201).end((err,res) => {
	    expect(err).toBeNull();
	    cb(res.headers["set-cookie"]);
        });
};
