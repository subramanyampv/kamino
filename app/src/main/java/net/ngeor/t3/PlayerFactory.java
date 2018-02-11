package net.ngeor.t3;

import android.content.Context;

import net.ngeor.t3.ai.MessageBox;
import net.ngeor.t3.models.MutableGameModel;
import net.ngeor.t3.players.AIPlayer;
import net.ngeor.t3.players.HumanPlayer;
import net.ngeor.t3.settings.AIPlayerDefinition;
import net.ngeor.t3.settings.HumanPlayerDefinition;
import net.ngeor.t3.settings.PlayerDefinition;
import net.ngeor.t3.settings.Settings;

import java.util.ArrayList;
import java.util.List;

/**
 * Creates and deletes players.
 *
 * @author ngeor on 10/2/2018.
 */
public class PlayerFactory {
    private final Context context;
    private final MutableGameModel model;
    private final List<AIPlayer> aiPlayers = new ArrayList<>();
    private final List<HumanPlayer> humanPlayers = new ArrayList<>();
    private final MessageBox messageBox;
    private final CompositeTouchListener boardTouchListener;

    public PlayerFactory(Context context, MutableGameModel model, MessageBox messageBox, CompositeTouchListener boardTouchListener) {
        this.context = context;
        this.model = model;
        this.messageBox = messageBox;
        this.boardTouchListener = boardTouchListener;
    }

    public void createPlayers() {
        Settings settings = model.getSettings();
        for (PlayerDefinition playerDefinition : settings.getPlayerDefinitions()) {
            if (playerDefinition instanceof HumanPlayerDefinition) {
                // create touch listener
                createHumanPlayer(playerDefinition);
            } else if (playerDefinition instanceof AIPlayerDefinition) {
                createAIPlayer(playerDefinition);
            } else {
                throw new IllegalArgumentException("Cannot create player");
            }
        }
    }

    public void destroyPlayers() {
        destroyAIPlayers();
        destroyHumanPlayers();
    }

    private void createHumanPlayer(PlayerDefinition playerDefinition) {
        HumanPlayer humanPlayer = new HumanPlayer(context, model, playerDefinition.getPlayerSymbol());
        boardTouchListener.addListener(humanPlayer);
        model.addGameModelListener(humanPlayer);
        humanPlayers.add(humanPlayer);
    }

    private void createAIPlayer(PlayerDefinition playerDefinition) {
        AIPlayer aiPlayer = new AIPlayer(
                messageBox,
                model,
                playerDefinition.getPlayerSymbol());
        model.addGameModelListener(aiPlayer);
        aiPlayers.add(aiPlayer);
    }

    private void destroyHumanPlayers() {
        for (HumanPlayer humanPlayer : humanPlayers) {
            destroyHumanPlayer(humanPlayer);
        }

        humanPlayers.clear();
    }

    private void destroyAIPlayers() {
        for (AIPlayer aiPlayer : aiPlayers) {
            destroyAIPlayer(aiPlayer);
        }

        aiPlayers.clear();
    }

    private void destroyHumanPlayer(HumanPlayer humanPlayer) {
        boardTouchListener.removeListener(humanPlayer);
        model.removeGameModelListener(humanPlayer);
    }

    private void destroyAIPlayer(AIPlayer aiPlayer) {
        aiPlayer.cancel();
        model.removeGameModelListener(aiPlayer);
    }
}
