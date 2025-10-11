from datetime import datetime, timedelta
from typing import List, Tuple

from sqlalchemy import Column, Integer, String, DateTime, Float, func, desc
from sqlalchemy.orm import declarative_base, Session

Base = declarative_base()


class QRAnalytics(Base):
    __tablename__ = "qr_analytics"

    id = Column(Integer, primary_key=True, index=True)
    qr_id = Column(String, index=True)
    url = Column(String)
    action_type = Column(String)  # 'generate' | 'scan'
    timestamp = Column(DateTime, default=datetime.utcnow, index=True)
    location = Column(String, nullable=True)
    device_type = Column(String, nullable=True)
    response_time = Column(Float, nullable=True)


# Helper queries

def get_top_urls(db: Session, limit: int = 10) -> List[Tuple[str, int]]:
    q = (
        db.query(QRAnalytics.url, func.count(QRAnalytics.id).label("cnt"))
        .group_by(QRAnalytics.url)
        .order_by(desc("cnt"))
        .limit(limit)
    )
    return [(row[0], int(row[1])) for row in q.all() if row[0]]


def get_daily_counts(db: Session, days: int = 30, action: str | None = None):
    since = datetime.utcnow() - timedelta(days=days)
    q = (
        db.query(
            func.date(QRAnalytics.timestamp).label("date"),
            func.count(QRAnalytics.id).label("count"),
        )
        .filter(QRAnalytics.timestamp >= since)
        .group_by(func.date(QRAnalytics.timestamp))
        .order_by(func.date(QRAnalytics.timestamp))
    )
    if action:
        q = q.filter(QRAnalytics.action_type == action)
    rows = q.all()
    return [{"date": str(r[0]), "count": int(r[1])} for r in rows]


def get_avg_response_time(db: Session, days: int = 30):
    since = datetime.utcnow() - timedelta(days=30)
    avg_val = (
        db.query(func.avg(QRAnalytics.response_time))
        .filter(QRAnalytics.timestamp >= since)
        .scalar()
    )
    return float(avg_val) if avg_val is not None else 0.0
