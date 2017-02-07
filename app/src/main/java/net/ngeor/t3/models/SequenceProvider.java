package net.ngeor.t3.models;

import java.util.List;

/**
 * Creates a sequence of tiles.
 * Created by ngeor on 2/5/2017.
 */
public interface SequenceProvider {
    List<Location> getSequence();
}
