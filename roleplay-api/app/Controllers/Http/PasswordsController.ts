import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Mail from '@ioc:Adonis/Addons/Mail'
import User from 'App/Models/User'
import { randomBytes } from 'crypto'
import {promisify}from 'util'
import ForgortPasswordValidator from 'App/Validators/ForgortPasswordValidator'
import Query from 'mysql2/typings/mysql/lib/protocol/sequences/Query'
import TokenExpiredException from 'App/Exceptions/TokenExpiredException'

export default class PasswordsController {
  public async forgotpassword ({ request, response }: HttpContextContract) {
    const { email, resetPasswordUrl } = await request.validate(ForgortPasswordValidator)

    const user = await User.findByOrFail('email', email)


    const random = await promisify(randomBytes)(24)
    const token = random.toString('hex')
    await user.related('tokens').updateOrCreate(
      { userId: user.id },
      {token,}

    )
      const resetPasswordUrlWithToken = `${resetPasswordUrl}?token=${token}`
    await Mail.send((message) => {
      message
        .from('no-reply@rolopay.com')
        .to(email)
        .subject('DomPixel: recuperação da senhas ')
        .htmlView('forgotpassword', {
          productName: 'DomPixel',
          name: user.username,
          resetPasswordUrl:resetPasswordUrlWithToken,
        })
    })

    return response.noContent()
  }
  public async resetPassword({ request, response }: HttpContextContract) {
    const { token, password } = request.only(['token', 'password'])

    const userByToken = await User.query()
      .whereHas('tokens', (query) => {
        query.where('token', token)
      })
      .preload('tokens')
      .firstOrFail()

    const tokenAge = userByToken.tokens[0].createdAt.diffNow('hours').hours
    if (tokenAge > 2) throw new TokenExpiredException()

    userByToken.password = password
    await userByToken.save()
    await userByToken.tokens[0].delete()

    return response.noContent()
  }
}
