
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import BadRequest from 'App/Exceptions/BadRequestException'
import User from 'App/Models/User'
import CreateUser from 'App/Validators/CreateUserValidator'


//======================Cadastro de usuarios ========================//
export default class UsersController {
    public async store({ response, request }: HttpContextContract) {
        const userPayload = await request.validate(CreateUser)
          
        
        const userByEmail = await User.findBy('email', userPayload.email) //controle de cadastro///

             if (userByEmail) throw new BadRequest('Email ja existe em nosso banco de dados', 409)

        const userByusername = await User.findBy('username', userPayload.username)

             if (userByusername) throw new BadRequest('Usuario ja existe em nosso banco de dados', 409)

        const user = await User.create(userPayload)
        return response.created({user})
    } 

    /**
     * async update
     */
    public async update({ request, response}: HttpContextContract) { 
        const { email, password, avatar} = request.only(['email', 'avatar', 'password'])        
        const id = request.param('id')
        const user = await User.findOrFail(id)
        
        user.email = email
        user.password = password
        if (avatar) user.avatar = avatar
        await user.save()

        return response.ok({user})
    }


}
