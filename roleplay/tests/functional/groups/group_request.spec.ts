import Database from '@ioc:Adonis/Lucid/Database'
import { test } from '@japa/runner'
import { GroupFactory, UserFactory } from 'Database/factories'


test.group('Groups group request', (group) => {

  group.each.setup(async () => {
    await Database.beginGlobalTransaction()
    return () => Database.rollbackGlobalTransaction()
  })

  test('it should create a group request', async ({ client }) => {
    const { id } = await UserFactory.create()
    const group = await GroupFactory.merge({ master: id }).create()
    const response = await client
      .post(`/groups/${group.id}/requests`)
      .json({})
      .loginAs({id})

    response.assertStatus(201)

  })


})
