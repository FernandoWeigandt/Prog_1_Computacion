from .. import db
from datetime import datetime

class Valoration(db.Model):
    __tablename__ = "valorations"
    id = db.Column(db.Integer, primary_key = True)
    comment = db.Column(db.String(250), nullable = True)
    valoration = db.Column(db.Integer, nullable = False)
    date = db.Column(db.String(20), nullable = False)
    
    def __repr__(self):
        return '<Valoration> id:%r, valoration:%r, comment:%r' % (self.id, self.valoration, self.comment)

    def to_json(self):
        valoration_json = {
            'id': self.id,
            'comment': str(self.comment),
            'valoration': self.valoration,
            'date': str(self.date.strftime('%d-%m-%Y'))
            
        }
        return valoration_json

    def to_json_short(self):
        valoration_json = {
            'id': self.id,
        }
        return valoration_json

    @staticmethod
    def from_json(valoration_json):
        id = valoration_json.get('id')
        valoration = valoration_json.get('valoration')
        comment = valoration_json.get('comment')
        date = datetime.strptime(valoration_json.get('date'), '%d-%m-%Y')

        return Valoration(id = id,
                    valoration = valoration,
                    comment = comment,
                    date = date
                    )