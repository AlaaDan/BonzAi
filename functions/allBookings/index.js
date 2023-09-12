const { sendResponse, sendError } = require('../../responses/index')
const { db } = require('../../services/db')

exports.handler = async (event) => {


    try {
        const result = await db.scan({
            TableName: 'Bonz-db',
        }).promise()

        return sendResponse(200, {
            message: 'All Bookings',
            bookings: result.Items
        })

    } catch (error) {
        console.log(error)
        return sendError(500, error)
    }
}