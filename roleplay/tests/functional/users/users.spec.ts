import Database from "@ioc:Adonis/Lucid/Database";
import { test } from "@japa/runner";
import User from "App/Models/User";
import { UserFactory } from "Database/factories";


let token = ''
let user = {} as User

test.group("User", (group) => {
  // group.setup(async ({ client }) => {
  //   const plainPassword = 'test'
  //   const newUser = await UserFactory.merge({ password: plainPassword }).create()
  //   const response = await client
  //     .post('/sessions')
  //     .json({ email: newUser.email, password: plainPassword })

  //   response.assertStatus()

  //   token = response.token.token
  //   user =
  // })

  group.each.setup(async () => {
    await Database.beginGlobalTransaction()
    return () => Database.rollbackGlobalTransaction()
  })

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

  test("it should return 409 when email is already in use", async ({ client }) => {
    const { email } = await UserFactory.create();
    const response = await client.post("/users")
      .json({
        email,
        username: "test",
        password: "test",
      })
    response.assertStatus(409)
  });

  test("it should return 409 when username is already in use", async ({ client }) => {
    const { username } = await UserFactory.create();
    const response = await client.post("/users")
      .json({
        username,
        email: "test@teste.com",
        password: "test",
      })
    response.assertStatus(409);

  })

  test("it should return 422 when required data is not provided", async ({ client }) => {
    const response = await client.post("/users")
      .json({})
    response.assertStatus(422);


  });

  test("it should return 422 when providing an invalid email", async ({ client }) => {
    const response = await client.post("/users")
      .json({
        email: "teste@",
        password: "test",
        username: "test",
      })
    response.assertStatus(422);

  });

  test("it should return 422 when providing an invalid password", async ({ client }) => {
    const response = await client.post("/users")
      .json({
        email: "test@test.com",
        password: "tes",
        username: "test",
      })
    response.assertStatus(422);

  });

  test("it should update an user", async ({ client }) => {
    const plainPassword = 'test'
    const newUser = await UserFactory.merge({ password: plainPassword }).create()
    let response = await client
      .post('/sessions')
      .json({ email: newUser.email, password: plainPassword })

    response.assertStatus(201)

 

    // token = response.body
    // user = newUser

    user = await UserFactory.create()
    const email = 'test@test.com'
    const avatar = "http://github.com/giuliana-bezerra.png";

    response = await client
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
    const password = "teste"
    const response = await client
      .put(`/users/${user.id}`)
      .json({
        email: user.email,
        password,
        avatar: user.avatar
      })

    response.assertStatus(200)

  });

  //==========================teste de erros=============/
  test("it should return 422 when required data is not provided", async ({ client }) => {
    const id = await UserFactory.create();
    const response = await client
      .put(`/users/${id}`)
      .json({})

    response.assertStatus(422)

  });

  test("it should return 422 when providing an invalid email", async ({ client }) => {
    const { id, password, avatar } = await UserFactory.create();
    const response = await client
      .put(`/users/${id}`)
      .json({
        password,
        avatar,
        email: "test@",
      })
    response.assertStatus(422);

  });

  test("it should return 422 when providing an invalid password", async ({ client, }) => {
    const { id, email, avatar } = await UserFactory.create();
    const response = await client
      .put(`/users/${id}`)
      .json({
        email,
        avatar,
        password: "tes",
      })
    response.assertStatus(422);


  });

  test("it should return 422 when providing an invalid avatar", async ({ client }) => {

    const response = await client
      .put(`/users/${user.id}`)
      .json({
        email: user.email,
        password: user.avatar,
        avatar: "test",
      })
    response.assertStatus(422);


  });
});
