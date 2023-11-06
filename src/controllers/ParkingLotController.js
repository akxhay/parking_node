const genericConstants = require("../data/constants/GenericConstants");
const ParkingHandler = require("../handlers/ParkingHandler");
const ParkingLotSchemaValidator = require("../validators/ParkingLotSchemaValidator");
const CustomError = require("../data/error/CustomError")

exports.validateParkingLot = (req, res, next) => {
    const {error} = ParkingLotSchemaValidator.validate(req.body);
    if (error) {
        return res.status(400).send(error.details[0].message);
    }
    next();
};

exports.greet = (req, res) => {
    console.log("Inside greet");
    res.status(200).send(genericConstants.GREET);
};

exports.createParkingLot = async (req, res) => {
    const parkingLotRequestDto = req.body;
    console.log(`Inside createParkingLot, parkingLotRequestDto: ${parkingLotRequestDto}`);
    try {
        const createdMessage = await ParkingHandler.createParkingLot(parkingLotRequestDto);
        res.status(200).json(createdMessage);
    } catch (err) {
        if (err instanceof CustomError) {
            res.status(err.statusCode).send(err.message);
        } else {
            console.log(err);
            res.status(500).json({error: 'Internal Server Error'});
        }
    }

};

exports.fetchParkingLots = async (req, res) => {
    const pageNumber = req.query.pageNumber;
    const pageSize = req.query.pageSize;
    console.log(`Inside fetchParkingLots, pageNumber: ${pageNumber}, pageSize: ${pageSize}`);
    try {
        const response = await ParkingHandler.fetchParkingLots(pageNumber, pageSize);
        res.status(200).json(response);
    } catch (err) {
        if (err instanceof CustomError) {
            res.status(err.statusCode).send(err.message);
        } else {
            console.log(err);
            res.status(500).json({error: 'Internal Server Error'});
        }
    }
};

exports.deleteParkingLot = async (req, res) => {
    const parkingLotId = req.params.parking_lot_id;
    console.log(`Inside deleteParkingLot, parkingLotId: ${parkingLotId}`);
    try {
        const response = await ParkingHandler.deleteParkingLot(parkingLotId);
        res.status(200).send(response);
    } catch (err) {
        if (err instanceof CustomError) {
            res.status(err.statusCode).send(err.message);
        } else {
            console.log(err);
            res.status(500).json({error: 'Internal Server Error'});
        }
    }
};

exports.getParkingSlot = async (req, res) => {
    const parking_lot_id = req.params.parking_lot_id;
    const size = req.params.size;
    const numberPlate = req.headers["number-plate"]
    const arrivedAt = req.headers["arrived-at"]

    console.log(`Inside getParkingSlot, parking_lot_id: ${parking_lot_id}, size: ${size}, numberPlate: ${numberPlate}, arrivedAt: ${arrivedAt}`);

    try {
        const response = await ParkingHandler.getParkingSlot(parking_lot_id, size, numberPlate, arrivedAt);
        res.status(200).send(response);
    } catch (err) {
        if (err instanceof CustomError) {
            res.status(err.statusCode).send(err.message);
        } else {
            console.log(err);
            res.status(500).json({error: 'Internal Server Error'});
        }
    }
};

exports.releaseParkingLot = async (req, res) => {
    const parking_lot_id = req.params.parking_lot_id;
    const slot_id = req.params.slot_id;
    console.log(`Inside releaseParkingLot, parking_lot_id: ${parking_lot_id}, slot_id: ${slot_id}`);
    try {
        const response = await ParkingHandler.releaseParkingSlot(parking_lot_id, slot_id);
        res.status(200).send(response);
    } catch (err) {
        if (err instanceof CustomError) {
            res.status(err.statusCode).send(err.message);
        } else {
            console.log(err);
            res.status(500).json({error: 'Internal Server Error'});
        }
    }
};
