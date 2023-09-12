const { nanoid } = require('nanoid')
const { sendResponse, sendError } = require('../../responses/index')
const { db } = require('../../services/db')

exports.handler = async (event, context) => {
    const { name, person, date } = JSON.parse(event.body)

    try {
        
        const item = {
            bookingId: nanoid(),
            name,
            person,
            date,
        }
        await db.put({
            TableName: 'Bonz-db',
            Item: {...item},
        }).promise()

        return sendResponse(200, {
            message: 'Booking successfully created',
            booking: {...item},

        })

    } catch (error) {
        console.log(error)
        return sendError(500, error)
    }
    
}
