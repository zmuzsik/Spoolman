"""Add adjustment_length column to spool_adjustment table."""
from alembic import op
import sqlalchemy as sa

def upgrade():
    op.add_column(
        "spool_adjustment",
        sa.Column("adjustment_length", sa.Float, nullable=True),
    )

def downgrade():
    op.drop_column("spool_adjustment", "adjustment_length")
