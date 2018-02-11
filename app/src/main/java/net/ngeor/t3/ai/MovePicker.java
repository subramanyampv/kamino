package net.ngeor.t3.ai;

import net.ngeor.t3.models.ImmutableGameModel;
import net.ngeor.t3.models.Location;

/**
 * Selects a single next probable move.
 */
@FunctionalInterface
public interface MovePicker {
    Location pickMove(ImmutableGameModel model);
}
