package net.ngeor.t3.ai;

import net.ngeor.t3.models.GameModel;
import net.ngeor.t3.models.Location;
import net.ngeor.t3.models.TileState;

public class FirstBlankMove extends AbstractMove {

    public FirstBlankMove(GameModel model) {
        super(model);
    }

    @Override
    protected Location pickMove(GameModel model) {
        for (int row = 0; row < model.getRows(); row++) {
            for (int col = 0; col < model.getCols(); col++) {
                if (model.getState(row, col) == TileState.Empty) {
                    return new Location(row, col);
                }
            }
        }

        return null;
    }
}
