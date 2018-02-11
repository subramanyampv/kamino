package net.ngeor.t3.models;

/**
 * Represents the possible players.
 * Created by ngeor on 2/4/2017.
 */
public enum PlayerSymbol {
    X,
    O;

    public PlayerSymbol opponent() {
        return this == X ? O : X;
    }
}
