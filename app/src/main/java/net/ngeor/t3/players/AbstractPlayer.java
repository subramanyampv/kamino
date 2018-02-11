package net.ngeor.t3.players;

import net.ngeor.t3.models.GameModel;
import net.ngeor.t3.models.GameState;
import net.ngeor.t3.models.PlayerSymbol;
import net.ngeor.t3.settings.PlayerDefinition;

/**
 * Base class for player implementation.
 *
 * @author ngeor on 2/10/2017.
 */
public abstract class AbstractPlayer {
    private final PlayerSymbol turn;

    public AbstractPlayer(PlayerSymbol turn) {
        this.turn = turn;
    }

    protected boolean isMyTurn(GameModel model) {
        return model.getTurn() == turn;
    }

    protected boolean canIPlay(GameModel model) {
        return isMyTurn(model) && model.getState() == GameState.WaitingPlayer;
    }

    protected PlayerDefinition getPlayerDefinition(GameModel model) {
        return model.getSettings().getPlayerDefinitions().get(turn);
    }
}
