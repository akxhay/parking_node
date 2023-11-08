const chai = require('chai');
const chaiHttp = require('chai-http');
const {describe, it} = require('mocha');
const app = require('../app'); // Replace with the path to your Express app
const expect = chai.expect;

chai.use(chaiHttp);

//test data
const slots = 1
const parkingLotData = {
    "name": "My parking lot" + Date.now(), "floors": [{
        "name": "My floor 1",
        "smallSlots": slots,
        "mediumSlots": slots,
        "largeSlots": slots,
        "xlargeSlots": slots
    }]
}
const parkingLotDataWithoutName = {
    "floors": [{
        "name": "My floor 1",
        "smallSlots": slots,
        "mediumSlots": slots,
        "largeSlots": slots,
        "xlargeSlots": slots
    }]
}

const parkingLotDataWithoutFloors = {
    "name": "My parking lot" + Date.now()
}
const parkingLotDataWithoutFloorName = {
    "name": "My parking lot" + Date.now(), "floors": [{
        "smallSlots": 10, "mediumSlots": 10, "largeSlots": 10, "xlargeSlots": 10
    }]
};
const pageSize = 5
const pageNumber = 1

describe('Parking Lot API', () => {
    let parkingLot;
    it(`should create a parking lot with ${slots} slots of each slot type`, (done) => {
        chai
            .request(app)
            .post('/parking/lot')
            .send(parkingLotData)
            .end((err, res) => {
                parkingLot = res.body;
                expect(res).to.have.status(200);
                done();
            });
    });

    it('should not create a parking lot with duplicate name', (done) => {
        chai
            .request(app)
            .post('/parking/lot')
            .send(parkingLotData)
            .end((err, res) => {
                expect(res.text).equals("Parking lot is already present with this name");
                expect(res).to.have.status(400); // Assuming it returns a 201 status code on successful creation
                done();
            });
    });

    it('should not create a parking lot without parking lot name', (done) => {
        chai
            .request(app)
            .post('/parking/lot')
            .send(parkingLotDataWithoutName)
            .end((err, res) => {
                expect(res.text).equals("\"name\" is required");
                expect(res).to.have.status(400); // Assuming it returns a 201 status code on successful creation
                done();
            });
    });

    it('should not create a parking lot without floors', (done) => {
        chai
            .request(app)
            .post('/parking/lot')
            .send(parkingLotDataWithoutFloors)
            .end((err, res) => {
                expect(res.text).equals("\"floors\" is required");
                expect(res).to.have.status(400); // Assuming it returns a 201 status code on successful creation
                done();
            });
    });

    it('should not create a parking lot without floor name', (done) => {
        chai
            .request(app)
            .post('/parking/lot')
            .send(parkingLotDataWithoutFloorName)
            .end((err, res) => {
                expect(res).to.have.status(400);
                expect(res.text).equals("\"floors[0].name\" is required");

                done();
            });
    });

    it(`should fetch parking lots with ${pageNumber} pageNumber and ${pageSize} pageSize`, (done) => {
        chai
            .request(app)
            .get('/parking/lot?pageNumber=' + pageNumber + '&pageSize=' + pageSize)
            .end((err, res) => {
                expect(res).to.have.status(200);
                expect(res.body.parkingLots.length).lessThanOrEqual(pageSize);
                done();
            });
    });

    it('should fetch parking lots without page size', (done) => {
        chai
            .request(app)
            .get('/parking/lot?pageNumber=0')
            .end((err, res) => {
                expect(res).to.have.status(500);
                expect(res.text).equals("pageSize should be greater than 0");
                done();
            });
    });


    it('should fetch parking lots without page number', (done) => {
        const pageSize = 5;
        chai
            .request(app)
            .get('/parking/lot?pageSize=1')
            .end((err, res) => {
                console.log(res.text);
                expect(res).to.have.status(500);
                expect(res.text).equals("pageSize should be greater than or equals to 0");
                done();
            });
    });

    it('should not get a parking slot without number plate', (done) => {
        const parkingLotId = parkingLot.id;
        const size = 's';
        chai
            .request(app)
            .get(`/parking/getslot/${parkingLotId}/${size}`)
            .end((err, res) => {
                expect(res).to.have.status(400);
                expect(res.text).equals("Car cannot be parked without number plate");
                done();
            });
    });

    let smallSlotId

    for (let i = 1; i <= slots; i++) {
        it(`should get a small parking slot ${i} for small car`, (done) => {
            const parkingLotId = parkingLot.id;
            const size = 's';
            chai
                .request(app)
                .get(`/parking/getslot/${parkingLotId}/${size}`)
                .set('number-plate', Date.now().toString())
                .set('arrived-at', Date.now().toString())
                .end((err, res) => {
                    expect(res).to.have.status(200);
                    smallSlotId = res.body.id
                    expect(res.body.slotType).equals('s');
                    done();
                });
        });
    }
    for (let i = 1; i <= slots; i++) {
        it(`should get a medium parking slot ${i} for small car`, (done) => {
            const parkingLotId = parkingLot.id;
            const size = 's';

            chai
                .request(app)
                .get(`/parking/getslot/${parkingLotId}/${size}`)
                .set('number-plate', Date.now().toString())
                .set('arrived-at', Date.now().toString())
                .end((err, res) => {
                    expect(res).to.have.status(200);
                    expect(res.body.slotType).equals('m');
                    done();
                });
        });
    }
    for (let i = 1; i <= slots; i++) {
        it(`should get a large parking slot ${i} for large car`, (done) => {
            const parkingLotId = parkingLot.id;
            const size = 'l';

            chai
                .request(app)
                .get(`/parking/getslot/${parkingLotId}/${size}`)
                .set('number-plate', Date.now().toString())
                .set('arrived-at', Date.now().toString())
                .end((err, res) => {
                    expect(res).to.have.status(200);
                    expect(res.body.slotType).equals('l');
                    done();
                });
        });
    }
    for (let i = 1; i <= slots; i++) {
        it(`should get a x - large parking slot ${i} for medium car`, (done) => {
            const parkingLotId = parkingLot.id;
            const size = 'm';

            chai
                .request(app)
                .get(`/parking/getslot/${parkingLotId}/${size}`)
                .set('number-plate', Date.now().toString())
                .set('arrived-at', Date.now().toString())
                .end((err, res) => {
                    expect(res).to.have.status(200);
                    expect(res.body.slotType).equals('xl');
                    done();
                });
        });
    }

    it('should not get a parking slot as all slots are occupied', (done) => {
        const parkingLotId = parkingLot.id;
        const size = 's';
        chai
            .request(app)
            .get(`/parking/getslot/${parkingLotId}/${size}`)
            .set('number-plate', Date.now().toString())
            .set('arrived-at', Date.now().toString())
            .end((err, res) => {
                expect(res).to.have.status(500);
                expect(res.text).equals("Parking Slot is not available");
                done();
            });
    });

    it('should release a small parking slot', (done) => {
        const parkingLotId = parkingLot.id;
        chai
            .request(app)
            .put(`/parking/releaseslot/${parkingLotId}/${smallSlotId}`)
            .end((err, res) => {
                expect(res).to.have.status(200);
                done();
            });
    });

    it('should get a small parking slot which was released in last test', (done) => {
        const parkingLotId = parkingLot.id;
        const size = 's';
        chai
            .request(app)
            .get(`/parking/getslot/${parkingLotId}/${size}`)
            .set('number-plate', Date.now().toString())
            .set('arrived-at', Date.now().toString())
            .end((err, res) => {
                expect(res).to.have.status(200);
                smallSlotId = res.body.id
                expect(res.body.id).equals(smallSlotId);
                expect(res.body.slotType).equals('s');
                done();
            });
    });

    it('should delete a parking lot', (done) => {
        const parkingLotId = parkingLot.id;
        chai
            .request(app)
            .delete(`/parking/lot/${parkingLotId}`)
            .end((err, res) => {
                expect(res).to.have.status(200); // Assuming it returns a 204 status code on successful deletion
                done();
            });
    });
});
