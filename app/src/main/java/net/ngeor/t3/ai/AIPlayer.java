package net.ngeor.t3.ai;

import net.ngeor.t3.models.AILevel;
import net.ngeor.t3.models.GameModel;
import net.ngeor.t3.models.GameModelListener;
import net.ngeor.t3.models.GameState;

public class AIPlayer implements GameModelListener {
    private AILevel aiLevel;

    public AILevel getAILevel() {
        return aiLevel;
    }

    public void setAILevel(AILevel aiLevel) {
        this.aiLevel = aiLevel;
    }

    @Override
    public void stateChanged(GameModel model) {
        if (model.isHumanTurn() || model.getState() != GameState.WaitingPlayer) {
            return;
        }

        AbstractMove move;

        // TODO have CPU easy play against CPU hard
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

        move = new SmartMove(model, minimaxDepth);
        move.execute();
    }
}
