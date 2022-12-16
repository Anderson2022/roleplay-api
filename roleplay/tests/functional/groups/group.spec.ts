import Database from '@ioc:Adonis/Lucid/Database'
import { test } from '@japa/runner'

test.group('Groups group', (group) => {
  group.each.setup(async () => {
  await Database.beginGlobalTransaction()
    return () => Database.rollbackGlobalTransaction()
  })


  test('it should create a group ', async ({ client }) => {
   const response = await client
      .post('/groups')
      .json({})

    response.assertStatus(201)
  })












})
