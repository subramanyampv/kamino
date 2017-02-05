package net.ngeor.t3.ai;

import net.ngeor.t3.models.GameModel;
import net.ngeor.t3.models.Location;
import net.ngeor.t3.models.TileState;

import java.util.Random;

public class RandomMove extends AbstractMove {
    public RandomMove(GameModel model) {
        super(model);
    }

    @Override
    protected Location pickMove(GameModel model) {
        Random random = new Random();
        boolean found = false;
        int row = -1;
        int col = -1;
        while (!found) {
            row = random.nextInt(model.getRows());
            col = random.nextInt(model.getCols());
            found = model.getState(row, col) == TileState.Empty;
        }

        return new Location(row, col);
    }
}
