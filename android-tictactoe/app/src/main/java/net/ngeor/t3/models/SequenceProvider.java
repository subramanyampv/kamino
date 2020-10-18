package net.ngeor.t3.models;

import java.util.List;

/**
 * Creates a sequence of tiles.
 *
 * @author ngeor on 2/5/2017.
 */
@FunctionalInterface
public interface SequenceProvider {
    List<Location> getSequence(BoardModel boardModel);
}
