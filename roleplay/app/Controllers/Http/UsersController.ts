import type { HttpContextContract } from "@ioc:Adonis/Core/HttpContext";
import User from "App/Models/User";
import BadRequest from "App/Exceptions/BadRequestException";
import CreateUserValidator from "App/Validators/CreateUserValidator";
import UpdateUserValidator from "App/Validators/UpdateUserValidator";

//======================== Criação de usuarios==============//
export default class UsersController {
  public async store({ request, response }: HttpContextContract) {
    const userPayload = await request.validate(CreateUserValidator);

    const userByEmail = await User.findBy("email", userPayload.email);
    const userByUsername = await User.findBy("username", userPayload.username);

    if (userByEmail) throw new BadRequest("email aleready in users", 409);
    if (userByUsername)
      throw new BadRequest("username aleready in username", 409);
    const user = await User.create(userPayload);
    return response.created({ user });
  }

//==============================Update de usuarios============//
  public async update({ request, response }: HttpContextContract) {
    const {email, password, avatar} = await request.validate(UpdateUserValidator)
    const id = request.param('id')
    const user = await User.findOrFail(id)

    user.email = email
    user.password = password
    if (avatar) user.avatar = avatar
    await user.save()
    
    return response.ok({user});
  }
}
