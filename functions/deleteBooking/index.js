const { sendResponse, sendError } = require('../../responses/index')
const { db } = require('../../services/db')

exports.handler = async (event, context) => {
    const { bookingId } = event.pathParameters;

    try {
        // First, check if the booking exists
        const checkResult = await db.get({
            TableName: 'Bonz-db',
            Key: {
                bookingId,
            },
        }).promise();

        if (!checkResult.Item) {
            return sendError(404, 'Booking not found');
        }

        // If the booking exists, proceed with deletion
        await db.deleteItem({
            TableName: 'Bonz-db',
            Key: {
                bookingId,
            },
        }).promise();

        return sendResponse(200, {
            message: 'Booking deleted successfully',
        });
    } catch (error) {
        console.log(error);
        return sendError(500, error);
    }
};
