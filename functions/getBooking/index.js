const { sendResponse, sendError } = require('../../responses/index')
const { db } = require('../../services/db')

exports.handler = async (event) => {
    const {bookingId} = event.pathParameters
    try{
        // get the items for the bookingId
        const result = await db.get({
            TableName: 'Bonz-db',
            Key: {
                bookingId
            }
        }).promise()
        if (!result.Item) {
            return sendError(404, 'Booking not found');
        }
        // return the booking
        return sendResponse(200, {
            message: 'Booking retrieved successfully',
            booking: result.Item
        })
    }
    catch(error){
        console.log(error)
        return sendError(500, error)
    }
}