import { test } from '@japa/runner'

import supertest from 'supertest'
const BASE_URL = `http://${process.env.Host}:${process.env.PORT}`

test.group('User', () => {
  test("get a paginated list of users", async ({ assert}) => {
    const userPayload = { email: 'teste@teste.com', username: 'test', password: 'test', avatar:'http' }
    const { body } = await supertest(BASE_URL).post('/users').send(userPayload).expect(201);
    assert.exists(body.user, 'User undefined')
    assert.exists(body.user.id, "User undefined");
    assert.equal(body.user.email, userPayload.email);
    assert.equal(body.user.username, userPayload.username);
    assert.equal(body.user.password, userPayload.password);
    assert.equal(body.user.avatar, userPayload.avatar);
  });
});
