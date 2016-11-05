"""empty message

Revision ID: 9acb0bf634c5
Revises: 80eff11313b7
Create Date: 2016-11-04 13:06:54.974794

"""

# revision identifiers, used by Alembic.
revision = '9acb0bf634c5'
down_revision = '80eff11313b7'

from alembic import op
import sqlalchemy as sa


def upgrade():
    ### commands auto generated by Alembic - please adjust! ###
    op.create_table('clusters',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('name', sa.String(length=64), nullable=True),
    sa.Column('ip', sa.String(length=64), nullable=True),
    sa.Column('port', sa.Integer(), nullable=True),
    sa.Column('username', sa.String(length=64), nullable=True),
    sa.Column('password', sa.String(length=64), nullable=True),
    sa.PrimaryKeyConstraint('id')
    )
    op.create_index(op.f('ix_clusters_name'), 'clusters', ['name'], unique=True)
    ### end Alembic commands ###


def downgrade():
    ### commands auto generated by Alembic - please adjust! ###
    op.drop_index(op.f('ix_clusters_name'), table_name='clusters')
    op.drop_table('clusters')
    ### end Alembic commands ###
