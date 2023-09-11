const { nanoid } = require('nanoid')
const { sendResponse, sendError } = require('../../responses/index')
const { db } = require('../../services/db')

exports.handler = async (event, context) => {
    const { name, person, date, time } = JSON.parse(event.body)

    try {
        const id = nanoid()
        const result = await db.collection('bookings').add({
            name,
            person,
            date,
            time,
            id
        })

        return sendResponse(200, {
            message: 'Booking successfully created',
            id: result.id,
            name: result.name,
            person: result.person,
            date: result.date,
            time: result.time

        })
    } catch (error) {
        console.log(error)
        return sendError(500, error)
    }
    
}