import Database from "@ioc:Adonis/Lucid/Database";
import { test } from "@japa/runner";
import { UserFactory } from "Database/factories";
import supertest from "supertest";



test.group("Session", (group) => {
  group.each.setup(async () => {
    await Database.beginGlobalTransaction()
    return () => Database.rollbackGlobalTransaction()
  })

  test("it should authenticate an user", async ({ client }) => {
    const plainPassword = "test";
    const { email } = await UserFactory.merge({
      password: plainPassword,
    }).create();
    const response = await client
      .post("/sessions")
      .json({ email, password: plainPassword })

    response.assertStatus(201);

  });

  test("it should return an api token when session is created", async ({ client }) => {
    const plainPassword = "test";
    const { email } = await UserFactory.merge({
      password: plainPassword,
    }).create();
    const response = await client
      .post("/sessions")
      .json({ email, password: plainPassword })
    response.assertStatus(201);
  });

  //   //==========================Cenarios de erros=======================//

    test("it should return 400 when credentials are not provided", async ({client}) => {
      const response = await client
        .post("/sessions")
        .json({})        
        response.assertStatus(400);
     });

    test("it should return 400 when credentials are invalid", async ({client}) => {
      const { email } = await UserFactory.create();
      const response = await client
        .post("/sessions")
        .json({
          email,
          password: "test",
        })
      response.assertStatus(400);
      
   
    });

    //===================== Cenario de logout =============//

    test("it should return 200 when user signs out ", async ({client}) => {
      const plainPassword = "test";
      const { email } = await UserFactory.merge({
        password: plainPassword,
      }).create();
      const { body } = await client
        .post("/sessions")
        .send({ email, password: plainPassword })
        .expect(201);

      const apiToken = body.token;

      await supertest(BASE_URL)
        .delete("/sessions")
        .set("Authorization", `Bearer ${apiToken.token}`)
        .expect(200);
    });

    test("it should revoke token when user signs out ", async ({ assert, client }) => {
      const plainPassword = "test";
      const { email } = await UserFactory.merge({
        password: plainPassword,
      }).create();
      const { body } = await supertest(BASE_URL)
        .post("/sessions")
        .send({ email, password: plainPassword })
        .expect(201);

      const apiToken = body.token;

      await supertest(BASE_URL)
        .delete("/sessions")
        .set("Authorization", `Bearer ${apiToken.token}`)
        .expect(200);

      const token = await Database.query()
        .select("*")
        .from("api_tokens")
        .where("token", apiToken.token);
    });


  //   group.setup(async () => {
  //     await Database.beginGlobalTransaction();
  //   });
  //   group.setup(async () => {
  //     await Database.rollbackGlobalTransaction;
  //   });
});
