CREATE TABLE
    public.parking_lot (
        id bigserial NOT NULL,
        "name" varchar(255) NOT NULL,
        CONSTRAINT parking_lot_name_key UNIQUE (name),
        CONSTRAINT parking_lot_pkey PRIMARY KEY (id)
    );

CREATE TABLE
    public.floor (
        id bigserial NOT NULL,
        parking_lot_id int8 NOT NULL,
        "name" varchar(255) NOT NULL,
        CONSTRAINT floor_pkey PRIMARY KEY (id)
    );

ALTER TABLE public.floor
ADD
    CONSTRAINT fk6u3jkigcon9kmb52axqmb3c27 FOREIGN KEY (parking_lot_id) REFERENCES public.parking_lot(id);

CREATE TABLE
    public.parking_slot (
        is_occupied bool NOT NULL,
        slot_number int4 NOT NULL,
        arrived_at int8 NULL,
        floor_id int8 NOT NULL,
        id bigserial NOT NULL,
        number_plate varchar(255) NULL,
        slot_type varchar(255) NOT NULL,
        CONSTRAINT parking_slot_number_plate_key UNIQUE (number_plate),
        CONSTRAINT parking_slot_pkey PRIMARY KEY (id)
    );

ALTER TABLE
    public.parking_slot
ADD
    CONSTRAINT fkg6ltredxjoe7d2p0qprxk1ywt FOREIGN KEY (floor_id) REFERENCES public.floor(id);