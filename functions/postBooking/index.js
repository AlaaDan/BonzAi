const { nanoid } = require('nanoid')
const { sendResponse, sendError } = require('../../responses/index')
const { db } = require('../../services/db')

let max_rooms = 20

async function checkAvailability(checkIn, checkOut) {
    let rooms_info = {
        single: {
            rooms: 5,
            capacity: 1,
            occupied: 0
        },
        double: {
            rooms: 5,
            capacity: 2,
            occupied: 0
        },
        suite: {
            rooms: 10,
            capacity: 3,
            occupied: 0
        }
    }
    const result = await db.scan({
        TableName: 'Bonz-db',
        FilterExpression: 'checkIn <= :checkOut AND checkOut >= :checkIn',
        ExpressionAttributeValues: {
            ':checkIn': checkIn,
            ':checkOut': checkOut
        }
    }).promise()
    // check if there are any bookings in the database for the dates provided 
    if (result.Items.length > 0) {

        result.Items.forEach(item => {
            rooms_info.single.rooms -= item.rooms.singleRoom
            rooms_info.double.rooms -= item.rooms.doubleRoom
            rooms_info.suite.rooms -= item.rooms.suiteRoom
        })
    console.log("ROOMS INFO ",rooms_info)
    }
    return rooms_info
}

function calculatePrice(guests) {
    return guests * 500
}

async function allocateRooms(guestsNum, checkIn, checkOut) {
    let rooms = {
        singleRoom: 0,
        doubleRoom: 0,
        suiteRoom: 0
    }
    let guests = guestsNum
    let rooms_info = await checkAvailability(checkIn, checkOut)
    console.log("ROOMS TEST ",rooms_info)
    // check if there are enough rooms available
    if (!checkUnavailableRooms(rooms_info)) {
        return false
    } // check if the rooms available can accommodate the number of guests according to the capacity of each room type
    if (guests > (rooms_info.single.capacity * rooms_info.single.rooms) + (rooms_info.double.capacity * rooms_info.double.rooms) + (rooms_info.suite.capacity * rooms_info.suite.rooms)) {
        return false    }
    // allocate rooms according to the number of guests and the capacity of each room type 
    while (guests > 0) {
        if (guests >= rooms_info.suite.capacity && rooms_info.suite.rooms > 0) {
            rooms.suiteRoom += 1
            rooms_info.suite.rooms -= 1
            guests -= rooms_info.suite.capacity
        } else if (guests >= rooms_info.double.capacity && rooms_info.double.rooms > 0) {
            rooms.doubleRoom += 1
            rooms_info.double.rooms -= 1
            guests -= rooms_info.double.capacity
        } else if (guests >= rooms_info.single.capacity && rooms_info.single.rooms > 0) {
            rooms.singleRoom += 1
            rooms_info.single.rooms -= 1
            guests -= rooms_info.single.capacity
        }
        // 
    }

    return rooms

}



function checkUnavailableRooms(rooms_info) {
    if (rooms_info.single.rooms === 0 || rooms_info.double.rooms === 0 || rooms_info.suite.rooms === 0) {
        return false
    }
    return true
}

exports.handler = async (event, context) => {
    const { name, guests, checkIn, checkOut } = JSON.parse(event.body)
    const price = calculatePrice(guests)
    //checkAvailability(checkIn, checkOut)
    const rooms = await allocateRooms(guests, checkIn, checkOut)
    console.log("ROOMS", rooms)

    if (typeof(rooms) !== "object") {
        return sendError(400, 'Not enough rooms available')
    }else {

        try {
            const item = {
                bookingId: nanoid(),
                name,
                guests,
                checkIn,
                checkOut,
                price,
                rooms
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
}

