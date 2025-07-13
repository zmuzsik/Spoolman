"""Helper functions for recording spool filament adjustments."""

from datetime import datetime
from typing import Optional
from sqlalchemy.ext.asyncio import AsyncSession
from spoolman.database import models

async def record_spool_adjustment(
    db: AsyncSession,
    spool_id: int,
    adjustment_amount: float,
    reason: Optional[str] = None,
    adjustment_length: Optional[float] = None,
):
    adjustment = models.SpoolAdjustment(
        spool_id=spool_id,
        adjustment_amount=adjustment_amount,
        adjustment_length=adjustment_length,
        reason=reason,
        timestamp=datetime.utcnow(),
    )
    db.add(adjustment)
    await db.commit()
    await db.refresh(adjustment)
    return adjustment
