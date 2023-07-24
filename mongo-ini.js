db.createUser({
    user: "giovanni",
    pwd: "123456",
    roles: [{ role: "readWrite", db: "test" }],
  });