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
//const { v4: uuidv4 } = require('uuid'); // Import the uuid package

// const { sendResponse, sendError } = require('../../responses/index');
// const { db } = require('../../services/db');

// exports.handler = async (event, context) => {
//   try {
   
//     const requestBody = JSON.parse(event.body);

//     // Generate a random ID for the booking
//     const bookingId = nanoid();

//     // TODO: Validate the booking details (e.g., check for required fields)

//     // Create a new booking object
//     const booking = {
//       bookingId, 
//       guestName: requestBody.guestName,
//       checkInDate: requestBody.checkInDate,
//       checkOutDate: requestBody.checkOutDate,
//       roomType: requestBody.roomType,
      
//     };

//     // Store the booking in DynamoDB
//     const params = {
//       TableName: 'bonz-db', 
//       Item: booking,
//     };

//     await db.put(params).promise();

//     return sendResponse(200, {
//       message: 'Booking successful',
//       bookingId, 
//     });
//   } catch (error) {
//     console.error('Error creating booking:', error);
//     return sendError(500, {
//       message: 'Internal server error',
//     });
//   }
// };