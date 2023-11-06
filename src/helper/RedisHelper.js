const redis = require("../config/Redis");

const sizes = ['s', 'm', 'l', 'xl'];
const createParkingLot = (parkingLotId, size, slotId) => {
    const queue = `parkingSlotQueue:${parkingLotId}:${size}`;
    redis.sadd(queue, slotId);
};
const dequeueItem = (parkingLotId, size, callback) => {
    const queue = `parkingSlotQueue:${parkingLotId}:${size}`;
    redis.spop(queue, (err, item) => {
        if (!err) {
            callback(item);
        } else {
            console.error(`Error in dequeueItem: ${err}`);
            callback(null);
        }
    });
};
const queueExistsByPartialParkingLotId = (partialParkingLotId, callback) => {
    const pattern = `parkingSlotQueue:${partialParkingLotId}:*`;
    redis.keys(pattern, (err, keys) => {
        if (!err) {
            callback(keys.length > 0);
        } else {
            console.error(`Error searching for queues: ${err}`);
            callback(false);
        }
    });
};

const addParkingSpotsInQueue = (parkingLot) => {
    for (const floor of parkingLot.floors) {
        for (const parkingSlot of floor.parkingSlots) {
            if (!parkingSlot.occupied)
                createParkingLot(parkingLot.id, parkingSlot.slotType, parkingSlot.id);
        }
    }
};

const removeParkingSpotInQueue = (parkingLotId, size) => {
    return new Promise((resolve, reject) => {
        dequeueItem(parkingLotId, size, (item) => {
            if (item) {
                resolve(item);
            } else {
                resolve(null);
            }
        });
    });
};

exports.addParkingSpotsInQueueIfNotExists = (parkingLot) => {
    queueExistsByPartialParkingLotId(parkingLot.id, (exists) => {
        if (exists) {
            console.log('Queue(s) exist for parking lot IDs that start with "4".');
        } else {
            console.log('No matching queues found.');
            addParkingSpotsInQueue(parkingLot);
        }
    });
};

exports.addParkingSpotInQueue = (parkingLotId, size, slotId) => {
    createParkingLot(parkingLotId, size, slotId);
};

exports.findSuitableSlot = async (parkingLotId, size) => {
    let parkingSlot;
    switch (size) {
        case 's':
            parkingSlot = await removeParkingSpotInQueue(parkingLotId, "s");
            if (parkingSlot) return parkingSlot;
        case 'm':
            parkingSlot = await removeParkingSpotInQueue(parkingLotId, "m");
            if (parkingSlot) return parkingSlot;
        case 'l':
            parkingSlot = await removeParkingSpotInQueue(parkingLotId, "l");
            if (parkingSlot) return parkingSlot;
        case 'xl':
            parkingSlot = await removeParkingSpotInQueue(parkingLotId, "xl");
            if (parkingSlot) return parkingSlot;
    }
    return null;
};