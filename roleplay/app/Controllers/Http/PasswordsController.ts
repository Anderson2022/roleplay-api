import Mail from '@ioc:Adonis/Addons/Mail';
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class PasswordsController {
  public async forgotPassword({ request, response }: HttpContextContract) {
    const { email } = request.only(['email'])

    await Mail.send((message) => {
      message
        .from("info@example.com")
        .to("virk@adonisjs.com")
        .subject("Welcome Onboard!")
        .text("Click no link abaixo para redefinir a senha");
    });

    return response.noContent()
  }
}
