import json

from api.endpoints.utils import process_raw_data
from api.models import db
from api.models.game import Game
from api.models.user import User
from test import TestBase


class TestGameEndpoints(TestBase):

    def setUp(self):
        super().setUp()

    def test_list_games(self):
        o_player = User(name='O player')
        x_player = User(name='X player')
        db.session.add_all([o_player, x_player])
        db.session.commit()

        first_game = Game(x_player_id=x_player.id, o_player_id=o_player.id)
        second_game = Game(x_player_id=x_player.id, o_player_id=o_player.id)
        third_game = Game(x_player_id=x_player.id, o_player_id=o_player.id)
        db.session.add_all([first_game, second_game, third_game])
        db.session.commit()

        self.assertEquals(3, len(self.client.get('/game/').json))

    def test_create_game(self):
        o_player = User(name='O player')
        x_player = User(name='X player')
        db.session.add_all([o_player, x_player])
        db.session.commit()

        self.assertEquals(0, Game.query.count())
        self.client.post('/game/', data=json.dumps({
            'x_player_id': x_player.id,
            'o_player_id': o_player.id
        }))
        self.assertEquals(1, Game.query.count())

        game = Game.query.first()
        self.assertEquals(x_player, game.x_player)
        self.assertEquals(o_player, game.o_player)

    def test_get_game(self):
        o_player = User(name='O player')
        x_player = User(name='X player')
        db.session.add_all([o_player, x_player])
        db.session.commit()

        new_game = Game(x_player_id=x_player.id, o_player_id=o_player.id)
        db.session.add(new_game)
        db.session.commit()

        payload = self.client.get('/game/' + str(new_game.id)).json
        self.assertEquals(o_player.id, payload['o_player_id'])
        self.assertEquals(x_player.id, payload['x_player_id'])
