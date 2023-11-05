const express = require("express");
const router = express.Router();
const ParkingLotController = require("../controllers/ParkingLotController");

router.get("/parking/greet", ParkingLotController.greet);

router.post(
  "/parking/lot",
  ParkingLotController.validateParkingLot,
  ParkingLotController.createParkingLot
);
router.get("/parking/lot", ParkingLotController.fetchParkingLots);

router.delete(
  "/parking/lot/:parking_lot_id",
  ParkingLotController.deleteParkingLot
);
router.get(
  "/parking/getslot/:parking_lot_id/:size",
  ParkingLotController.getParkingSlot
);

router.put(
  "/parking/releaseslot/:parking_lot_id/:slot_id",
  ParkingLotController.releaseParkingLot
);

module.exports = router;
