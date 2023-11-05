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

exports.fetchParkingLots = (req, res) => {
    const parkingLotRequestDto = req.body;
    console.log("Inside createParkingLot, parkingLotDto:", parkingLotRequestDto);
    res.status(200).json(parkingHandler.fetchParkingLots(0, 0));
};

exports.deleteParkingLot = (req, res) => {
    const parkingLotRequestDto = req.body;
    res.status(200).json(parkingHandler.deleteParkingLot(1));
};

exports.getParkingSlot = (req, res) => {
    const parkingLotRequestDto = req.body;
    res.status(200).json(parkingHandler.getParkingSlot(0, 0, 0, 0));
};

exports.releaseParkingLot = (req, res) => {
    const parkingLotRequestDto = req.body;
    res.status(200).json(parkingHandler.releaseParkingSlot(1, 1));
};
