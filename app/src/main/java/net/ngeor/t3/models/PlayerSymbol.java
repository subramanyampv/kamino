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

    public static PlayerSymbol fromTileState(TileState tileState) {
        if (tileState == null) {
            throw new IllegalArgumentException();
        }

        switch (tileState) {
            case X:
                return PlayerSymbol.X;
            case O:
                return PlayerSymbol.O;
            case EMPTY:
                return null;
            default:
                throw new IllegalArgumentException();
        }
    }
}
