package net.ngeor.t3.players;

import net.ngeor.t3.ai.AbstractMove;
import net.ngeor.t3.ai.MessageBox;
import net.ngeor.t3.ai.SmartMove;
import net.ngeor.t3.models.AILevel;
import net.ngeor.t3.models.GameModel;
import net.ngeor.t3.models.GameModelListener;
import net.ngeor.t3.models.PlayerSymbol;
import net.ngeor.t3.settings.AIPlayerDefinition;
import net.ngeor.t3.settings.PlayerDefinition;

public class AIPlayer extends AbstractPlayer implements GameModelListener {
    private final MessageBox messageBox;
    private AbstractMove move;

    public AIPlayer(MessageBox messageBox, GameModel model, PlayerSymbol turn) {
        super(model, turn);
        this.messageBox = messageBox;
    }

    private AILevel getAILevel() {
        PlayerDefinition playerDefinition = getPlayerDefinition();
        AIPlayerDefinition aiPlayerDefinition = (AIPlayerDefinition) playerDefinition;
        return aiPlayerDefinition.getAILevel();
    }

    @Override
    public void stateChanged() {
        if (!canIPlay()) {
            return;
        }

        AILevel aiLevel = getAILevel();

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

        move = new SmartMove(messageBox, getModel(), minimaxDepth);
        move.execute();
    }

    public void cancel() {
        if (move == null) {
            return;
        }

        move.cancel(false);
        move = null;
    }
}
