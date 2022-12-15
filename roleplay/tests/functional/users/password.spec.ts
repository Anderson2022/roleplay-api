import Mail from "@ioc:Adonis/Addons/Mail";
import Database from "@ioc:Adonis/Lucid/Database";
import { test } from "@japa/runner";
import { UserFactory } from "Database/factories";

import Hash from "@ioc:Adonis/Core/Hash";
import { DateTime, Duration } from "luxon";

test.group("Password", (group) => {
  group.each.setup(async () => {
    await Database.beginGlobalTransaction()
    return () => Database.rollbackGlobalTransaction()
  })

  test("it should send and email with forgot password instructions", async ({ assert, client }) => {
    const user = await UserFactory.create();
    const mailer = Mail.fake()
    await client
      .post("/forgot-password")
      .json({
        email: user.email,
        resetPasswordUrl: "url",
      })

    assert.isTrue(mailer.exists({ to: [{ address: user.email }] }))
    assert.isTrue(mailer.exists({ from: { address: 'no-reply@roleplay.com' } }))
    assert.isTrue(mailer.exists({ subject: "Roleplay: Recuperação de senha" }))
    assert.isTrue(mailer.exists((mail) => mail.html!.includes(user.username)))

    Mail.restore()
  });

  test("it shout create a reset password token", async ({ client, assert }) => {
    const user = await UserFactory.create();

    const response = await client
      .post("/forgot-password")
      .json({
        email: user.email,
        resetPasswordUrl: "url",
      })

    response.assertStatus(204);

    const tokens = await user.related("tokens").query();

    assert.isNotEmpty(tokens);
  });

  test('it should return 422 when required data is not provided or data is invalid', async ({ client }) => {
    const response = await client
      .post('/forgot-password')
      .json({})

    response.assertStatus(422)
  })

    test('it should de able to reset password', async ({ client, assert }) => {
      const user = await UserFactory.create()
      const { token } = await user.related('tokens').create({token: 'token'})

      const response = await client
        .post('/reset-password')
        .json({ token, password: '123456' })
        response.assertStatus(204)

      await user.refresh()
      const checkPassword = await Hash.verify(user.password, '123456')
      assert.isTrue(checkPassword)

    })
  //   //============================testes de erros==========//

    test('it should return 422 when required data is not provided or data is invalid', async ({ client }) => {
      const response = await client
        .post('/reset-password')
        .json({})
      
      response.assertStatus(422)
      

    })

    test('it should return 404 when using the same token twice', async ({ client }) => {
      const user = await UserFactory.create();
     const { token} = await user.related('tokens').create({ token: 'token'})
      await client
        .post('/reset-password')
        .json({ token, password: '123456' })
       

      const response = await client
        .post('/reset-password')
        .json({ token, password: '123456' })
        response.assertStatus(404)
    })

    test('it cannot reset password when token is expired after 2 hours', async ({ client }) => {
      const user = await UserFactory.create()
      const date = DateTime.now().minus(Duration.fromISOTime('02:01'))
      const { token } = await user
        .related('tokens')
        .create({ token: 'token', createdAt: date })
      
      const response = await client
        .post('/reset-password')
        .json({ token, password: '123456' })
      
        response.assertStatus(410)

    
    
    })


});
