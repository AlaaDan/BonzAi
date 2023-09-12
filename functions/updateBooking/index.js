const { sendResponse, sendError } = require('../../responses/index')
const { db } = require('../../services/db')

exports.handler = async (event) => {
    //Update booking by bookingId
    const { bookingId } = event.pathParameters
    const { name, person, date } = JSON.parse(event.body)
    
    try {
        // get the items for the bookingId
        const checkBooking = await db.get({
            TableName: 'Bonz-db',
            Key: {
                bookingId
            }
        }).promise()
        if (!checkBooking.Item) {
            return sendError(404, 'Booking not found');
        }

        // update the booking
        await db.update({
            TableName: 'Bonz-db',
            Key: {
                bookingId
            },
            UpdateExpression: 'set #name = :name, #person = :person, #date = :date',
            ExpressionAttributeNames: {
                '#name': 'name',
                '#person': 'person',
                '#date': 'date'
            },
            ExpressionAttributeValues: {
                ':name': name,
                ':person': person,
                ':date': date
            }
        }).promise()


        const result = await db.get({
            TableName: 'Bonz-db',
            Key: {
                bookingId
            }
        }).promise()
        // return the booking
        return sendResponse(200, {
            message: 'Booking retrieved successfully',
            booking: result.Item
        })
    }
    catch (error) {
        console.log(error)
        return sendError(500, error)
    }
    
}