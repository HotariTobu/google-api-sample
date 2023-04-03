import * as base64 from './base64'

export default async function () {
    const response00 = await gapi.client.gmail.users.getProfile({
        userId: 'me',
    })

    console.log(response00)

    const email = response00.result.emailAddress

    const response01 = await gapi.client.gmail.users.labels.list({
        userId: 'me',
    })

    console.log(response01.result.labels)

    const response02 = await gapi.client.gmail.users.drafts.create({
        userId: 'me',
    }, {
        message: {
            // snippet: 'This ia a snippet.',
            // payload: {
            //     mimeType: 'text/plain',
            //     headers: [
            //         {
            //             name: 'Subject',
            //             value: 'This is a subject.'
            //         }
            //     ],
            //     body: {
            //         size: 15,
            //         data: 'VGhpcyBpcyBhIGJvZHku'
            //     }
            // }
            raw: base64.encode(`To: you@example.com
Subject: subject

body`),
        }
    })

    console.log(response02)

    const response03 = await gapi.client.gmail.users.messages.insert({
        userId: 'me',
    }, {
        raw: base64.encode(`To: you@example.com
Subject: subject

body`),
    })

    console.log(response03)

    const now = new Date()
    const nextDay = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1, 8)

    const response04 = await gapi.client.gmail.users.messages.send({
        userId: 'me',
    }, {
        internalDate: nextDay.getTime().toString(),
        raw: base64.encode(`To: ${email}
Subject: subject

body`),
    })

    console.log(response04)
}