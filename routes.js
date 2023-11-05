const express = require("express");
const router = express.Router();
const parkingLotController = require("./app/controllers/parkingLotController");

router.get("/parking/greet", parkingLotController.greet);

router.post(
  "/parking/lot",
  parkingLotController.validateParkingLot,
  parkingLotController.createParkingLot
);
router.get("/parking/lot", parkingLotController.fetchParkingLots);

router.delete(
  "/parking/lot/:parking_lot_id",
  parkingLotController.deleteParkingLot
);
router.get(
  "/parking/getslot/:parking_lot_id/:size",
  parkingLotController.getParkingSlot
);

router.put(
  "/parking/releaseslot/:parking_lot_id/:slot_id",
  parkingLotController.releaseParkingLot
);

module.exports = router;
