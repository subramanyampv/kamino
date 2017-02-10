package net.ngeor.t3;

import net.ngeor.t3.models.GameModel;
import net.ngeor.t3.models.Player;

/**
 * Created by ngeor on 2/10/2017.
 */
public abstract class AbstractPlayer {
    private final GameModel model;
    private final Player turn;

    public AbstractPlayer(GameModel model, Player turn) {
        this.model = model;
        this.turn = turn;
    }

    public GameModel getModel() {
        return model;
    }

    protected boolean isMyTurn() {
        return model.getTurn() == turn;
    }
}
