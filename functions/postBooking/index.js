const { sendResponse, sendError } = require('../../responses/index')
const { db } = require('../../services/db')

exports.handler = async (event, context) => {

    return sendResponse(200, {
        message: 'Hello from PostBooking Lambda'
    })
}