/**
* Print the summary and start datetime/date of the next ten events in
* the authorized user's calendar. If no events are found an
* appropriate message is printed.
*/
const listUpcomingEvents = async function (from?: Date, to?: Date) {
    if (typeof from === 'undefined') {
        from = new Date()
    }

    let response
    try {
        response = await gapi.client.calendar.events.list({
            'calendarId': 'primary',
            'timeMin': from.toISOString(),
            'timeMax': to?.toISOString(),
            'showDeleted': false,
            'singleEvents': true,
            'maxResults': 10,
            'orderBy': 'startTime',
        })
    } catch (err) {
        const e = err as { message: unknown }
        console.log(e.message)
        return
    }

    const events = response.result.items
    if (!events || events.length == 0) {
        console.log('No events found.')
        return
    }

    console.log(events)

    // Flatten to string to display
    const output = events.reduce(
        (str, event) => `${str}${event.summary} (${event?.start?.dateTime || event?.start?.date})\n`,
        'Events:\n')
    console.log(output)

    return events
}

const insertEvent = async function () {
    const now = new Date()
    const later = new Date(
        now.getFullYear(),
        now.getMonth(),
        now.getDate(),
        now.getHours() + 1,
    )

    const startDateTime = later.toISOString()

    later.setHours(later.getHours() + 1)

    const endDateTime = later.toISOString()

    const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;

    const summary = 'Google I/O 2015'

    const listRes = await gapi.client.calendar.events.list({
        'calendarId': 'primary',
        // 'timeMin': now.toISOString(),
        // 'timeMax': endDateTime,
        // 'maxResults': 10,
        'maxResults': 1,
        // 'q': summary.slice(3),
        'q': summary,
        // 'timeZone': timezone,
        'singleEvents': true,
        'orderBy': 'startTime',
    })

    const events = listRes.result.items
    if (typeof events !== 'undefined' && events.length > 0) {
        return
    }

    const response = await gapi.client.calendar.events.insert({
        'calendarId': 'primary',
        'resource': {
            'summary': summary,
            'location': '800 Howard St., San Francisco, CA 94103',
            'description': 'A chance to hear more about Google\'s developer products.',
            'start': {
                'dateTime': startDateTime,
                'timeZone': timezone,
            },
            'end': {
                'dateTime': endDateTime,
                'timeZone': timezone,
            },
            'recurrence': [
                'RRULE:FREQ=DAILY;COUNT=2'
            ],
            'attendees': [
                { 'email': 'lpage@example.com' },
                { 'email': 'sbrin@example.com' }
            ],
            'reminders': {
                'useDefault': false,
                'overrides': [
                    { 'method': 'email', 'minutes': 24 * 60 },
                    { 'method': 'popup', 'minutes': 10 }
                ]
            }
        }
    })

    const event = response.result
    console.log('Event created:', event, event.htmlLink)
}

const listCalendarList = async function () {
    const res = await gapi.client.calendar.calendarList.list()
    console.log("Calendars:", res.result.items)
}

const insertCalendar = async function () {
    const summary = 'とある科学のカレンダー'

    const listRes = await gapi.client.calendar.calendarList.list()
    const cals = listRes.result.items

    if (typeof cals !== 'undefined') {
        const ex = cals.some(cal => cal.summary === summary)
        if (ex) {
            console.log('Calendar already exists')
            return
        }
    }

    const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;

    const calendar = {
        'summary': summary,
        'timeZone': timezone,
    }

    const res = await gapi.client.calendar.calendars.insert({}, calendar)

    console.log('Calendar created:', res.result)
}

export default async function () {
    await listUpcomingEvents()
    await insertEvent()
    await listCalendarList()
    await insertCalendar()
}