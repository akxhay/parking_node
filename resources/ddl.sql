CREATE TABLE public.parking_lots
(
  id bigserial NOT NULL,
"name" varchar
(
255
)
NOT NULL,
CONSTRAINT parking_lots_name_key null,
CONSTRAINT parking_lots_pkey null
);

CREATE TABLE public.floors
(
  id             bigserial NOT NULL,
  parking_lot_id int8 NOT NULL,
"name" varchar
(
255
)
NOT NULL,
CONSTRAINT floors_pkey null
);


ALTER TABLE public.floors ADD CONSTRAINT fk9o9d21ndox2oqaqo70maj88ao FOREIGN KEY(parking_lot_id)REFERENCES public.
parking_lots(id);


CREATE TABLE public.parking_slots
(
  is_occupied  bool NOT NULL,
  slot_number  int4 NOT NULL,
  arrived_at   int8 NULL,
  floor_id     int8 NOT NULL,
  id           bigserial NOT NULL,
  number_plate varchar(255) NULL,
  slot_type    varchar(255) NOT NULL,
CONSTRAINT parking_slots_number_plate_key null,
CONSTRAINT parking_slots_pkey null
);


ALTER TABLE public.parking_slots ADD CONSTRAINT fklwqj0vlq3y26h4ikgaboijwiq FOREIGN KEY(floor_id)REFERENCES public.
floors(id);