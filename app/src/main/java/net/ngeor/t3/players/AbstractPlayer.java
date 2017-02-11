package net.ngeor.t3.players;

import net.ngeor.t3.models.GameModel;
import net.ngeor.t3.models.GameState;
import net.ngeor.t3.models.PlayerSymbol;
import net.ngeor.t3.settings.PlayerDefinition;

import java.util.List;

/**
 * Created by ngeor on 2/10/2017.
 */
public abstract class AbstractPlayer {
    private final GameModel model;
    private final PlayerSymbol turn;

    public AbstractPlayer(GameModel model, PlayerSymbol turn) {
        this.model = model;
        this.turn = turn;
    }

    public GameModel getModel() {
        return model;
    }

    protected boolean isMyTurn() {
        return model.getTurn() == turn;
    }

    protected boolean canIPlay() {
        return isMyTurn() && model.getState() == GameState.WaitingPlayer;
    }

    protected PlayerDefinition getPlayerDefinition() {
        List<PlayerDefinition> playerDefinitions = model.getSettings().getPlayerDefinitions();
        for (PlayerDefinition playerDefinition : playerDefinitions) {
            if (playerDefinition.getPlayerSymbol() == turn) {
                return playerDefinition;
            }
        }

        throw new IllegalStateException("Could not find my player definition");
    }
}
