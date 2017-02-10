package net.ngeor.t3.ai;

import net.ngeor.t3.AbstractPlayer;
import net.ngeor.t3.models.*;

public class AIPlayer extends AbstractPlayer implements GameModelListener {
    private AILevel aiLevel;

    public AIPlayer(GameModel model, Player turn) {
        super(model, turn);
    }

    public AILevel getAILevel() {
        return aiLevel;
    }

    public void setAILevel(AILevel aiLevel) {
        this.aiLevel = aiLevel;
    }

    @Override
    public void stateChanged(GameModel model) {
        if (!isMyTurn() || model.getState() != GameState.WaitingPlayer) {
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
