const { sendResponse, sendError } = require('../../responses/index')
const { db } = require('../../services/db')

function checkIfCanBeCancelled(checkIn) {
    const today = new Date()
    const checkInDate = new Date(checkIn)
    const diffTime = Math.abs(checkInDate - today)
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    if (diffDays < 2) {
        return false
    }
    return true
}


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

        // If the booking exists, and it can be cancelled, delete it
        if (!checkIfCanBeCancelled(checkResult.Item.checkIn)) {
            return sendError(400, {
                message: 'Booking cannot be cancelled', 
                reason: "It's too late to cancel this booking, you can only cancel bookings 2 days before check-in"});
        } else {

            await db.delete({
                TableName: 'Bonz-db',
                Key: {
                    bookingId,
                },
            }).promise();

            return sendResponse(200, {
                message: 'Booking deleted successfully',
            });}
    } catch (error) {
        console.log(error);
        return sendError(500, error);
    }
};
