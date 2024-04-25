from .. import db
from datetime import datetime

class Rent(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    init_date = db.Column(db.String(20), nullable=False)
    expiration = db.Column(db.String(20), nullable=False)
    
    
    def __repr__(self):
        return '<Rent> id:%r' % (self.id)

    def to_json(self):
        rent_json = {
            'id': self.id,
            'init_date': str(self.init_date.strftime('%Y-%m-%d')),
            'expiration': str(self.expiration.strftime('%Y-%m-%d'))
        }
        return rent_json

    def to_json_short(self):
        rent_json = {
            'id': self.id
        }
        return rent_json

    @staticmethod
    def from_json(rent_json):
        id = rent_json.get('id'),
        init_date = datetime.strptime(rent_json.get('init_date'), '%Y-%m-%d'),
        expiration = datetime.strptime(rent_json.get('expiration'), '%Y-%m-%d')


        return Rent(id = id,
                        init_date = init_date,
                        expiration = expiration
                    )