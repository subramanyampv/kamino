package net.ngeor.t3.models;

/**
 * Receives events from ImmutableGameModelImpl.
 * Created by ngeor on 2/4/2017.
 */
public interface GameModelListener {
    void stateChanged(MutableGameModel model);
}
