import pandas as pd
from fastapi import APIRouter, Depends

from esm_fullstack_challenge.db import DB, query_builder
from esm_fullstack_challenge.dependencies import get_db, CommonQueryParams


dashboard_router = APIRouter()

@dashboard_router.get("/top_constructors_by_wins")
def get_top_constructors_by_wins(
    cqp: CommonQueryParams = Depends(CommonQueryParams),
    db: DB = Depends(get_db)
) -> list:
    base_query_str = "SELECT c.id, c.name, c.nationality, SUM(cr.points) as points FROM constructors c INNER JOIN constructor_results cr ON c.id = cr.constructor_id"
    query_str = query_builder(
        custom_select=base_query_str,
        order_by=cqp.order_by or [('points', 'desc')],
        limit=cqp.limit,
        offset=cqp.offset,
        filter_by=cqp.filter_by,
        group_by=['c.id']
    )

    with db.get_connection() as conn:
        df = pd.read_sql_query(query_str, conn)
        constructors = list(df.to_dict(orient='records'))

    return constructors

@dashboard_router.get("/top_drivers_by_wins")
def get_top_drivers_by_wins(
    cqp: CommonQueryParams = Depends(CommonQueryParams),
    db: DB = Depends(get_db)
) -> list:
    """Gets top drivers by wins.

    Args:
        cqp (CommonQueryParams, optional): Common query params used for filtering.
                                           Defaults to Depends(CommonQueryParams).
        db (DB, optional): SQLite DB connection. Defaults to Depends(get_db).

    Returns:
        list: list of top drivers by wins.
    """
    base_query_str = (
        "with driver_wins as (\n"
        "    select d.id,\n"
        "        d.forename || ' ' || d.surname as full_name,\n"
        "        d.nationality,\n"
        "        d.dob,\n"
        "        date() - date(dob)             as age,\n"
        "        d.url\n"
        "    from drivers d\n"
        "          join results r on d.id = r.driver_id\n"
        "          join status s on r.status_id = s.id\n"
        "    where s.status = 'Finished'\n"
        "    and r.position_order = 1\n"
        ")\n"
        "select\n"
        "    *,\n"
        "    count(*) as number_of_wins\n"
        "from driver_wins"
    )
    query_str = query_builder(
        custom_select=base_query_str,
        order_by=cqp.order_by or [('number_of_wins', 'desc')],
        limit=cqp.limit,
        offset=cqp.offset,
        filter_by=cqp.filter_by,
        group_by=['id', 'full_name', 'nationality', 'dob', 'age', 'url']
    )
    with db.get_connection() as conn:
        df = pd.read_sql_query(query_str, conn)
        drivers = list(df.to_dict(orient='records'))

    return drivers
