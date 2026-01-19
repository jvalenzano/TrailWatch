from sqlalchemy import func
from sqlalchemy.future import select
from .database import AsyncSessionFactory
from .models import Trail


async def find_nearest_trail(latitude: float, longitude: float, tolerance_meters: int):
    """
    Finds the nearest trail to a given point within a tolerance.
    Returns the trail and the distance in meters.
    """
    point = f'SRID=4326;POINT({longitude} {latitude})'

    async with AsyncSessionFactory() as session:
        q = select(
            Trail,
            func.ST_Distance(Trail.geom, point).label('distance')
        ).filter(
            func.ST_DWithin(
                Trail.geom,
                point,
                tolerance_meters
            )
        ).order_by(
            func.ST_Distance(Trail.geom, point)
        ).limit(1)

        result = await session.execute(q)
        trail, distance = result.first() or (None, None)

        if trail:
            q_snap = select(
                func.ST_X(func.ST_ClosestPoint(Trail.geom, point)),
                func.ST_Y(func.ST_ClosestPoint(Trail.geom, point))
            ).where(Trail.id == trail.id)
            snapped_x, snapped_y = (await session.execute(q_snap)).first()
            return trail, distance, (snapped_y, snapped_x)
        else:
            return None, None, None

def calculate_gps_confidence(distance: Optional[float]) -> float:
    """Calculates the GPS confidence score based on the distance to the trail."""
    if distance is None:
        return 0.0
    if distance <= 20:
        return 1.0
    if 20 < distance <= 50:
        return 1.0 - (distance - 20) / 30 * 0.5
    if 50 < distance <= 100:
        return 0.5 - (distance - 50) / 50 * 0.5
    return 0.0
