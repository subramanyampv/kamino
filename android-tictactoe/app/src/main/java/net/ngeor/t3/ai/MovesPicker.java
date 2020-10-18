package net.ngeor.t3.ai;

import net.ngeor.t3.models.ImmutableGameModel;
import net.ngeor.t3.models.Location;

import java.util.List;

/**
 * Selects probable next moves on a board.
 */
@FunctionalInterface
public interface MovesPicker {
    /**
     * Picks some probable moves.
     */
    List<Location> pickMoves(ImmutableGameModel model);
}
