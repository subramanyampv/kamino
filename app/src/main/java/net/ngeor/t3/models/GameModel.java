package net.ngeor.t3.models;

import java.util.ArrayList;
import java.util.List;

/**
 * Represents the state of the board.
 * Created by ngeor on 1/29/2017.
 */
public class GameModel extends GameDto {
    // somehow this gets serialized
    // that's why there's the split to GameDto
    private final transient List<GameModelListener> gameModelListeners = new ArrayList<>();

    public GameModel(int rows, int cols, PlayerAssignment playerAssignment) {
        super(rows, cols, playerAssignment);
    }

    public GameModel(GameDto savedState) {
        super(savedState);
    }

    public void start() {
        setState(GameState.WaitingPlayer);
    }

    @Override
    protected void setState(GameState state) {
        super.setState(state);
        fireStateChanged();
    }

    public void addGameModelListener(GameModelListener gameModelListener) {
        if (gameModelListener == null) {
            throw new IllegalArgumentException();
        }

        gameModelListeners.add(gameModelListener);
    }

    public void removeGameModelListener(GameModelListener gameModelListener) {
        if (gameModelListener == null) {
            throw new IllegalArgumentException();
        }

        gameModelListeners.remove(gameModelListener);
    }

    private void fireStateChanged() {
        for (GameModelListener gameModelListener : gameModelListeners) {
            gameModelListener.stateChanged(this);
        }
    }
}
