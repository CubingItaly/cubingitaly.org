import { getCustomRepository } from "typeorm";
import { sendError } from "../../shared/error.utils";
import { Router } from "express";
//# we need this because otherwise passport doesn't work
import * as passport from "passport";
import { validationResult, Result, body } from "express-validator/check";
const sendmail = require('sendmail')();
import { isLoggedIn, getUser } from "../../shared/login.utils";
import { keys } from "../../secrets/keys";

const router: Router = Router();




router.post("/", [body('email').isEmail(), body('subject').isLength({ min: 5 }), body('message').isLength({ min: 3 }), body('sender').isLength({ min: 3 })], (req, res) => {
    const errors = validationResult(req);
    if (errors.isEmpty()) {
        try {
            const email: string = req.body.email;
            sendmail({
                from: keys.contact.from,
                to: keys.contact.to,
                subject: keys.contact.subject,
                html: composeHTML(req),
                replyTo: email
            }, function (err, reply) {
                sendError(res, 500, "There was an error while trying to process the request");
            });
            res.status(200).send({});
        } catch (e) {
            sendError(res, 500, "There was an error while trying to process the request");
        }
    } else {
        sendError(res, 400, "Error. Some parameter is missing or not valid");
    }
});

function composeHTML(req): string {
    let html: string = "";
    const email: string = req.sanitize(req.body.email);
    const subject: string = req.sanitize(req.body.subject);
    const message: string = req.sanitize(req.body.message);
    const sender: string = req.sanitize(req.body.sender);
    if (isLoggedIn(req)) {
        html = `<p>Messaggio inviato dall'utente riconosciuto come: ${getUser(req).name}</p>`;
    }
    html += `<p><strong>Inviato da</strong>: ${sender}</p>`;
    html += `<p><strong>Oggetto</strong>: ${subject}</p>`;
    html += `<p><strong>E-Mail</strong>: ${email}</p>`;
    html += `<p><strong>Messaggio</strong>:</p><p>${message}</p>`;
    return html;
}

export { router }