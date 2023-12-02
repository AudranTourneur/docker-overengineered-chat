import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Logger from '@ioc:Adonis/Core/Logger'
import { schema } from '@ioc:Adonis/Core/Validator'

export default class MessagesController {
  public async send({ request, response }: HttpContextContract) {
    const sendMessageScema = schema.create({
      message: schema.string(),
    })

    const payload = await request.validate({ schema: sendMessageScema })

    Logger.info('Sending message: ' + payload.message)
    return response.status(200).send('ok')
  }
}
