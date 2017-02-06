package net.ngeor.t3.ai;

import net.ngeor.t3.models.GameModel;
import net.ngeor.t3.models.GameModelListener;
import net.ngeor.t3.models.GameState;

public class AIPlayer implements GameModelListener {
    @Override
    public void stateChanged(GameModel model) {
        if (model.isHumanTurn() || model.getState() != GameState.WaitingPlayer) {
            return;
        }

        AbstractMove move;
        switch (model.getGameParameters().getAILevel()) {
            case EASY:
                move = new FirstBlankMove(model);
                break;
            case HARD:
                move = new SmartMove(model);
                break;
            default:
                throw new IllegalArgumentException();
        }

        move.execute();
    }
}
