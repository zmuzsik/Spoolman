"""API endpoints for filament usage history."""
from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from spoolman.database import database, models
from .models import FilamentUsage

router = APIRouter(prefix="/usage", tags=["usage"])

@router.get("/", response_model=list[FilamentUsage])
async def get_usage_history(db: AsyncSession = Depends(database.get_db)):
    adjustments = await db.execute(
        database.sa.select(models.SpoolAdjustment).order_by(models.SpoolAdjustment.timestamp.desc())
    )
    records = adjustments.scalars().all()
    return [FilamentUsage.from_db(adj) for adj in records]
