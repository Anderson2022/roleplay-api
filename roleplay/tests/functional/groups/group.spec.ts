import Database from '@ioc:Adonis/Lucid/Database'
import { test } from '@japa/runner'

import { UserFactory } from './../../../database/factories/index'

test.group('Group', (group) => {
  group.each.setup(async () => {
    await Database.beginGlobalTransaction()
    return () => Database.rollbackGlobalTransaction()
  })
  test('it should create a group ', async ({ client }) => {
    const user = await UserFactory.create()
    const groupPayload = {
      name: 'test',
      description: 'test',
      schedule: 'test',
      location: 'test',
      chronic: 'test',
      master: user.id,
    }

    const response = await client
      .post('/groups')
      .json({ groupPayload })

    response.assertStatus(401)
  })
  
  test('it should return 422 when required data is not provided ', async ({ client }) => {
    const response = await client
      .post('/groups')
      .json({})

    response.assertStatus(201)

  })
})










