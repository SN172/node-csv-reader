require("./models/cases.model")
const casesRoutes = require("./controllers/casesController")
const express = require("express");
const request = require("supertest");

const app = express();


app.use("/cases" , casesRoutes)

describe("server.js", () => {
    it("Get /cases - success", async() => {
   const { body } = await request(app).get("/cases")
   expect(body).toEqual
    });
});

const {MongoClient} = require('mongodb');

describe('insert', () => {
  let connection;
  let db;

  beforeAll(async () => {
    connection = await MongoClient.connect('mongodb://localhost:27017/covidDB', {
      useNewUrlParser: true,
    });
    db = await connection.db("covidDB");
  });

  afterAll(async () => {
    await connection.close();
    await db.close();
  });

  it('should insert a doc into collection', async () => {
    const users = db.collection('cases');

    const mockUser = {_id: 'some-user-id', name: 'John'};
    await users.insertOne(mockUser);

    const insertedUser = await users.findOne({_id: 'some-user-id'});
    expect(insertedUser).toEqual(mockUser);
  });
});