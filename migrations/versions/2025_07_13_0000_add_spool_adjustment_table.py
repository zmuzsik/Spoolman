"""Add spool_adjustment table for recording filament adjustments."""
from alembic import op
import sqlalchemy as sa

def upgrade():
    op.create_table(
        "spool_adjustment",
        sa.Column("id", sa.Integer, primary_key=True, index=True),
        sa.Column("spool_id", sa.Integer, sa.ForeignKey("spool.id"), nullable=False),
        sa.Column("adjustment_amount", sa.Float, nullable=False),
        sa.Column("reason", sa.String(256)),
        sa.Column("timestamp", sa.DateTime, nullable=False),
    )


def downgrade():
    op.drop_table("spool_adjustment")
