package net.ngeor.t3;

/**
 * Represents the state of the board.
 * Created by ngeor on 1/29/2017.
 */
public class GameModel {
    private final TileState[][] tiles;
    public final static int ROWS = 3;
    public final static int COLS = 3;

    public GameModel() {
        tiles = new TileState[ROWS][COLS];
        clear();
    }

    public void clear() {
        for (int row = 0; row < ROWS; row++) {
            for (int col = 0; col < COLS; col++) {
                tiles[row][col] = TileState.Empty;
            }
        }
    }

    public TileState getState(int row, int col) {
        return tiles[row][col];
    }

    public void setState(int row, int col, TileState state) {
        tiles[row][col] = state;
    }

    public boolean isBoardFull() {
        for (int row = 0; row < ROWS; row++) {
            for (int col = 0; col < COLS; col++) {
                if (getState(row, col) == TileState.Empty) {
                    return false;
                }
            }
        }

        return true;
    }
}
