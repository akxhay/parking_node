create table
    public.parking_lots (
        id bigserial not null,
        "name" varchar (255) not null,
        constraint parking_lots_name_key null,
        constraint parking_lots_pkey null
    );

create table
    public.floors (
        id bigserial not null,
        parking_lot_id int8 not null,
        "name" varchar (255) not null,
        constraint floors_pkey null
    );

alter table public.floors
add
    constraint fk9o9d21ndox2oqaqo70maj88ao foreign key(parking_lot_id) references public.parking_lots(id);

create table
    public.parking_slots (
        is_occupied bool not null,
        slot_number int4 not null,
        arrived_at int8 null,
        floor_id int8 not null,
        id bigserial not null,
        number_plate varchar(255) null,
        slot_type varchar(255) not null,
        constraint parking_slots_number_plate_key null,
        constraint parking_slots_pkey null
    );

alter table
    public.parking_slots
add
    constraint fklwqj0vlq3y26h4ikgaboijwiq foreign key(floor_id) references public.floors(id);