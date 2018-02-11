package net.ngeor.t3.players;

import android.util.Log;

import net.ngeor.t3.MessageBox;
import net.ngeor.t3.ai.MinimaxMovesPicker;
import net.ngeor.t3.ai.MovesPickerAsyncTask;
import net.ngeor.t3.ai.RandomMoveReducer;
import net.ngeor.t3.models.AILevel;
import net.ngeor.t3.models.GameModel;
import net.ngeor.t3.models.GameModelListener;
import net.ngeor.t3.models.MutableGameModel;
import net.ngeor.t3.models.PlayerSymbol;
import net.ngeor.t3.settings.AIPlayerDefinition;
import net.ngeor.t3.settings.PlayerDefinition;

public class AIPlayer extends AbstractPlayer implements GameModelListener {
    private final MessageBox messageBox;
    private final MutableGameModel model;
    private MovesPickerAsyncTask move;

    public AIPlayer(MessageBox messageBox, MutableGameModel model, PlayerSymbol turn) {
        super(turn);
        this.messageBox = messageBox;
        this.model = model;
    }

    @Override
    public void stateChanged(MutableGameModel model) {
        if (!canIPlay(model)) {
            return;
        }

        Log.d("AIPlayer", model.getState().toString());

        AILevel aiLevel = getAILevel(model);

        final int minimaxDepth;
        switch (aiLevel) {
            case EASY:
                minimaxDepth = 1;
                break;
            case MEDIUM:
                minimaxDepth = 2;
                break;
            case HARD:
                minimaxDepth = 3;
                break;
            default:
                throw new IllegalArgumentException();
        }

        MinimaxMovesPicker minimaxMovesPicker = new MinimaxMovesPicker(this::isCancelled, model, minimaxDepth);
        RandomMoveReducer randomMoveReducer = new RandomMoveReducer();
        move = new MovesPickerAsyncTask(
                messageBox,
                this.model,
                m -> randomMoveReducer.reduce(minimaxMovesPicker.pickMoves(m))
        );
        move.execute();
    }

    public void cancel() {
        if (move == null) {
            return;
        }

        move.cancel(false);
        move = null;
    }

    private AILevel getAILevel(GameModel model) {
        PlayerDefinition playerDefinition = getPlayerDefinition(model);
        AIPlayerDefinition aiPlayerDefinition = (AIPlayerDefinition) playerDefinition;
        return aiPlayerDefinition.getAILevel();
    }

    private boolean isCancelled() {
        return move == null || move.isCancelled();
    }
}
