import { test } from '@japa/runner'
import supertest from 'supertest'

/*
{
"users": {
    "id": "number"
    "email": string,
    "username": string,
    "password": string,
    "avatat" : strin
}

}


*/



const BASE_URL = `http://${process.env.HOST}: ${process.env.PORT}`

test.group('User', () => {
    test.only('it shoud create an user', async(assert) => {
        const userPayload = { email: 'teste@teste.com', username: 'teste', password: 'teste' }
        const {body} =  await supertest(BASE_URL).post('/users').send(userPayload).expect(201)
        assert.exists(body.user, 'User indefined')
        assert.exists(body.user.id, 'Id indefined')
        assert.equal(body.user.email, 'userPayload.email')
        assert.equal(body.user.username, 'userPayload.username')
        assert.equal(body.user.avatar, 'userPayload.avatar')
        assert.equal(body.user.password, 'userPayload.password')        
        
    })
})