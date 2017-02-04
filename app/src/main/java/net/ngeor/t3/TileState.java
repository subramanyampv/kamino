package net.ngeor.t3;

/**
 * Represents the state of a tile on the game board.
 * Created by ngeor on 1/29/2017.
 */
public enum TileState {
    /**
     * The tile is empty.
     */
    Empty,

    /**
     * The tile is marked X.
     */
    X,

    /**
     * The tile is marked O.
     */
    O;

    public static TileState fromPlayer(Player player) {
        switch (player) {
            case X:
                return TileState.X;
            case O:
                return TileState.O;
            default:
                throw new IllegalArgumentException();
        }
    }
}
