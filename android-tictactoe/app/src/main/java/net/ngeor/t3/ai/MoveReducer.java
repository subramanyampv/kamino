package net.ngeor.t3.ai;

import net.ngeor.t3.models.Location;

import java.util.List;

/**
 * Selects a single move out of multiple possible moves.
 *
 * @author ngeor on 10/2/2018.
 */
@FunctionalInterface
interface MoveReducer {
    Location reduce(List<Location> bestMoves);
}
