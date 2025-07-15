from typing import List

from fastapi import APIRouter, Depends, HTTPException

from esm_fullstack_challenge.models import AutoGenModels
from esm_fullstack_challenge.routers.utils import \
    get_route_list_function, get_route_id_function

from esm_fullstack_challenge.db import DB
from esm_fullstack_challenge.dependencies import get_db


drivers_router = APIRouter()

table_model = AutoGenModels['drivers']

# Route to get driver by id
get_driver = get_route_id_function('drivers', table_model)
drivers_router.add_api_route(
    '/{id}', get_driver,
    methods=["GET"], response_model=table_model,
)

# Route to get a list of drivers
get_drivers = get_route_list_function('drivers', table_model)
drivers_router.add_api_route(
    '', get_drivers,
    methods=["GET"], response_model=List[table_model],
)


# Add route to create a new driver
@drivers_router.post('', response_model=table_model)
def create_driver(data: dict, db: DB = Depends(get_db)):
    new_driver = table_model(**data)

    with db.get_connection() as conn:
        curr = conn.cursor()
        curr.execute('INSERT INTO drivers (id, driver_ref, number, code, forename, surname, dob, nationality, url) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
                               (new_driver.id, new_driver.driver_ref, new_driver.number, new_driver.code,
                                new_driver.forename, new_driver.surname, new_driver.dob,
                                new_driver.nationality, new_driver.url))

    return new_driver


# Add route to update driver
@drivers_router.put('/{id}', response_model=table_model)
def update_driver(id: int, data: dict, db: DB = Depends(get_db)):
    updated_driver = table_model(**data)

    with db.get_connection() as conn:
        curr = conn.cursor()
        curr.execute('UPDATE drivers SET driver_ref=?, number=?, code=?, forename=?, surname=?, dob=?, nationality=?, url=? WHERE id=?',
                     (updated_driver.driver_ref, updated_driver.number, updated_driver.code,
                      updated_driver.forename, updated_driver.surname, updated_driver.dob,
                      updated_driver.nationality, updated_driver.url, id))

    return updated_driver


# Add route to delete driver
@drivers_router.delete('/{id}', response_model=table_model)
def delete_driver(id: int, db: DB = Depends(get_db)):
    with db.get_connection() as conn:
        curr = conn.cursor()
        curr.execute('DELETE FROM drivers WHERE id=?', (id,))
        if curr.rowcount == 0:
            raise HTTPException(status_code=400, detail="Driver not found")

    return {"detail": "Driver deleted"}
