 import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'


import Mail from "@ioc:Adonis/Addons/Mail";
import User from "App/Models/User";

export default class PasswordsController {
    public async forgot({ request, response }: HttpContextContract) {
        const { email, resetPasswordUrl } = request.only(['email', 'resetPasswordUrl'])
        
        const user = await User.findByOrFail('email', email)
        
        return user

        await Mail.send((message) => {         
            message
                .from('no-reply@rolopay.com')
                .to(email)
                .subject('Roleplay: recuperação da senhas ')
                .htmlView('views/forgotpassword', {
                    productName: 'Roleplay',
                        name: user.username,
                        resetPasswordUrl,
                })
        } )

        return response.noContent()
    }
}
