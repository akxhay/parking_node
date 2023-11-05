const genericConstants = require("../constants/GenericConstants");
const parkingHandler = require("../parkingHandler");
const parkingLotSchema = require("../validators/parkingLotSchema");
const CustomError = require("../error/CustomError")

exports.validateParkingLot = (req, res, next) => {
    const {error} = parkingLotSchema.validate(req.body);
    if (error) {
        return res.status(400).send(error.details[0].message);
    }
    next(); // Continue to the next middleware or route handler if validation passes
};

exports.greet = (req, res) => {
    console.log("Inside greet");
    res.status(200).send(genericConstants.GREET);
};

exports.createParkingLot = async (req, res) => {
    const parkingLotRequestDto = req.body;
    console.log(`Inside createParkingLot, parkingLotDto: ${parkingLotDto}`);
    try {
        const createdMessage = await parkingHandler.createParkingLot(parkingLotRequestDto);
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
        const response = await parkingHandler.fetchParkingLots(pageNumber, pageSize);
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
        const response = await parkingHandler.deleteParkingLot(parkingLotId);
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

exports.getParkingSlot = (req, res) => {
    const parkingLotRequestDto = req.body;
    res.status(200).json(parkingHandler.getParkingSlot(0, 0, 0, 0));
};

exports.releaseParkingLot = (req, res) => {
    const parkingLotRequestDto = req.body;
    res.status(200).json(parkingHandler.releaseParkingSlot(1, 1));
};
