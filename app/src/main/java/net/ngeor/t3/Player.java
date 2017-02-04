package net.ngeor.t3;

/**
 * Represents the possible players.
 * Created by ngeor on 2/4/2017.
 */
public enum Player {
    X,
    O;

    public Player opponent() {
        return this == X ? O : X;
    }
}
