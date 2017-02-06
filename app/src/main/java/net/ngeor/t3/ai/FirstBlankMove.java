package net.ngeor.t3.ai;

import net.ngeor.t3.models.GameModel;
import net.ngeor.t3.models.Location;
import net.ngeor.t3.models.Tile;

public class FirstBlankMove extends AbstractMove {

    public FirstBlankMove(GameModel model) {
        super(model);
    }

    @Override
    protected Location pickMove(GameModel model) {
        for (Tile tile : model.allTiles()) {
            if (tile.isEmpty()) {
                return tile.getLocation();
            }
        }

        return null;
    }
}
