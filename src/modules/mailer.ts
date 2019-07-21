import path from 'path'
import nodemailer from 'nodemailer'
import hbs from 'nodemailer-express-handlebars'
import { host, port, user, pass } from '../config/mail.json'

const transport = nodemailer.createTransport({
  host,
  port,
  auth: { user, pass }
})

transport.use('compile', hbs({
  viewEngine: {
    extName: '.html',
    partialsDir: path.resolve('./src/resources/mail/'),
    layoutsDir: path.resolve('./src/resources/mail/auth/'),
    defaultLayout: 'forgot_password.html'
  },
  viewPath: path.resolve('./src/resources/mail/'),
  extName: '.html'
}))

export default transport
