
import Database from '@ioc:Adonis/Lucid/Database'
import test from 'japa'
import supertest from 'supertest'
import { UserFactory } from 'Database/factories'

const BASE_URL = `http://${process.env.HOST}:${process.env.PORT}`

test.group('Session', (group) => {
  test("it sould autenticate an user", async (assert) => {
    const plainPassoword = "teste";
    const { id, email } = await UserFactory.merge({
      password: plainPassoword,
    }).create();
    const { body } = await supertest(BASE_URL)
      .post("/sessions")
      .send({})
      .expect(201);
    assert.isDefined(body.user, "User undefined");
    assert.equal(body.user.id, id);
  });
  group.beforeEach(async () => {
    await Database.beginGlobalTransaction()
  })
  group.afterEach(async () => {
    await Database.rollbackGlobalTransaction

  })
})
