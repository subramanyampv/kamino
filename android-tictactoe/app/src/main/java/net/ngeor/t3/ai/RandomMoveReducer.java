package net.ngeor.t3.ai;

import net.ngeor.t3.models.Location;

import java.util.List;
import java.util.Random;

/**
 * Picks a random move out of possible ones.
 */
public class RandomMoveReducer implements MoveReducer {
    @Override
    public Location reduce(List<Location> bestMoves) {
        if (bestMoves == null || bestMoves.isEmpty()) {
            return null;
        }

        // in case multiple moves have the same score, pick a random one
        Random random = new Random();
        int nextMoveIndex = random.nextInt(bestMoves.size());
        Location result = bestMoves.get(nextMoveIndex);
        return result;
    }
}
