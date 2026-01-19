from sqlalchemy import Column, Integer, String
from sqlalchemy.orm import declarative_base
from geoalchemy2 import Geometry

Base = declarative_base()

class Trail(Base):
    __tablename__ = "trails"

    id = Column(Integer, primary_key=True)
    name = Column(String)
    managing_district = Column(String)
    geom = Column(Geometry(geometry_type='MULTILINESTRING', srid=4326), index=True)
