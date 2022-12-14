import Database from "@ioc:Adonis/Lucid/Database";

import { test } from "@japa/runner";
import { UserFactory } from "Database/factories";



  test.group("User", (group) => {

  test("it should create an user ", async ({ client, assert }) => {
    const userPayload = {
      email: "teste@teste.com",
      username: "test",
      password: "test",
      avatar: "http",
    }
    const response = await client.post("/users").json(userPayload);

    const { password, avatar, ...expected } = userPayload

    response.assertStatus(201);
    response.assertBodyContains({ user: expected });
    assert.notExists(response.body().user.avatar, "Password defined");
  });

  test("it should return 409 when email is already in use", async ({client}) => {
      const { email } = await UserFactory.create();
      const response = await client.post("/users")
        .json({
          email,
          username: "test",
          password: "test",
        })
      response.assertStatus(409)
    });


    test("it should return 409 when username is already in use", async ({client}) => {
      const { username } = await UserFactory.create();
      const response = await client.post("/users")
  .json({
          username,
          email: "test@teste.com",
          password: "test",
        })
        response.assertStatus(409);


    test("it should return 422 when required data is not provided", async ({client}) => {
      const response = await client.post("/users")
        .json({})
      response.assertStatus(422);


    });

    test("it should return 422 when providing an invalid email", async ({client}) => {
      const response = await client.post("/users")
        .json({
          email: "teste@",
          password: "test",
          username: "test",
        })
        response.assertStatus(422);

    });

    test("it should return 422 when providing an invalid password", async ({client}) => {
      const response = await client.post("/users")
        .json({
          email: "test@test.com",
          password: "tes",
          username: "test",
        })
        response.assertStatus(422);

    });

    test("it should update an user", async ({ client }) => {
     const user = await UserFactory.create()
      const email = 'test@test.com'
      const avatar = "http://github.com/giuliana-bezerra.png";

      const response = await client
        .put(`/users/${user.id}`)
        .json({
          email,
          avatar,
          password: user.password
        })
        .loginAs(user)
      response.assertStatus(200)
      response.assertBodyContains({
        user: {
          email,
          avatar,
          id: user.id
        }
      })
    });

    test("it should update an user password", async ({ client }) => {
      const user = await UserFactory.create();
      const password = "teste"
      const response = await client
        .put(`/users/${user.id}`)
        .json({
          email: user.email,
          password,
          avatar: user.avatar
        })
      .loginAs(user)
        response.assertStatus(200)
 response.assertBodyContains({
        user: {
          email,
          avatar,
          id: user.id
        }
      })

    });

  //   //==========================teste de erros=============/
  //   test("it should return 422 when required data is not provided", async ({ assert }) => {
  //   const { id } = await UserFactory.create();
  //   const { body } = await supertest(BASE_URL)
  //     .put(`/users/${id}`)
  //     .send({})
  //     .expect(422);
  //   assert.equal(body.code, "BAD_REQUEST");
  //   assert.equal(body.status, 422);
  // });

  //   test("it should return 422 when providing an invalid email", async ({ assert }) => {
  //   const { id, password, avatar } = await UserFactory.create();
  //   const { body } = await supertest(BASE_URL)
  //     .put(`/users/${id}`)
  //     .send({
  //       password,
  //       avatar,
  //       email: "test@",
  //     })
  //     .expect(422);
  //   assert.equal(body.code, "BAD_REQUEST");
  //   assert.equal(body.status, 422);
  // });

  //   test("it should return 422 when providing an invalid password", async ({ assert }) => {
  //   const { id, email, avatar } = await UserFactory.create();
  //   const { body } = await supertest(BASE_URL)
  //     .put(`/users/${id}`)
  //     .send({
  //       email,
  //       avatar,
  //       password: "tes",
  //     })
  //     .expect(422);
  //   assert.equal(body.code, "BAD_REQUEST");
  //   assert.equal(body.status, 422);
  // });

  //   test("it should return 422 when providing an invalid avatar", async ({ assert }) => {
  //   const { id, email, password } = await UserFactory.create();
  //   const { body } = await supertest(BASE_URL)
  //     .put(`/users/${id}`)
  //     .send({
  //       email,
  //       password,
  //       avatar: "test",
  //     })
  //     .expect(422);
  //   assert.equal(body.code, "BAD_REQUEST");
  //     assert.equal(body.status, 422);
  //   });

  //   group.setup(async () => {
  //     await Database.beginGlobalTransaction();
  //   });
  //   group.setup(async () => {
  //     await Database.rollbackGlobalTransaction();
  //   });

});
