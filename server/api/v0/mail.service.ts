import * as nodemailer from 'nodemailer';
import * as mailgunTransport from 'nodemailer-mailgun-transport';
import { keys } from '../../secrets/keys';

export class EmailService {

    emailClient;
    transport;

    constructor() {
        this.transport = mailgunTransport({ auth: keys.mail.auth })
        this.emailClient = nodemailer.createTransport(this.transport)
    }
    public sendText(replyTo, html) {
        return new Promise((resolve, reject) => {
            this.emailClient.sendMail({
                from: keys.mail.from,
                to: keys.mail.to,
                subject: keys.mail.subject,
                replyTo: replyTo,
                html: html
            }, (err, info) => {
                if (err) {
                    reject(err)
                } else {
                    resolve(info)
                }
            })
        })
    }
}
