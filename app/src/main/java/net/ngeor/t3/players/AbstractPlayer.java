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
        List<PlayerDefinition> playerDefinitions = model.getSettings().getPlayerDefinitions();
        for (PlayerDefinition playerDefinition : playerDefinitions) {
            if (playerDefinition.getPlayerSymbol() == turn) {
                return playerDefinition;
            }
        }

        throw new IllegalStateException("Could not find my player definition");
    }
}
