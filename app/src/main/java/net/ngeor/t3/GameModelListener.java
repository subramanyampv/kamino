package net.ngeor.t3;

/**
 * Receives events from GameModel.
 * Created by ngeor on 2/4/2017.
 */
public interface GameModelListener {
    void stateChanged(GameModel model);

    void humanPlayed(GameModel model);

    void cpuPlayed(GameModel model);
}
