import Database from '@ioc:Adonis/Lucid/Database'
import { test } from '@japa/runner'
import User from 'App/Models/User'
import { GroupFactory, UserFactory } from 'Database/factories'

let token = ''

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

    response.assertStatus(401)


  })

  test('it should return 409 when group request already exists', async ({ client, assert }) => {

    const user = await UserFactory.create()
    const { id } = await UserFactory.create()
    const group = await GroupFactory.merge({ master: id }).create()

    await client
      .post(`/groups/${group.id}/requests`)
      .json({})

    const response = await client
      .post(`/groups/${group.id}/requests`)
      .json({})
      .loginAs(user)

    response.status(409)

  })

})
