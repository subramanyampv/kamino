package net.ngeor.t3;

import java.io.Serializable;

public class GameDto implements Serializable {
    protected final GameParameters gameParameters;
    protected final TileState[][] tiles;
    protected GameState state;
    protected Player turn;

    public GameDto(GameParameters gameParameters) {
        // store game parameters
        this.gameParameters = gameParameters;

        // initialize and clear tiles
        tiles = new TileState[getRows()][getCols()];
        clearTiles();

        state = GameState.NotStarted;

        // first player plays next
        turn = gameParameters.getFirstPlayer();
    }

    public GameDto(GameDto other) {
        this.gameParameters = other.gameParameters;
        this.tiles = other.tiles;
        this.state = other.state;
        this.turn = other.turn;
    }

    private void clearTiles() {
        for (int row = 0; row < getRows(); row++) {
            for (int col = 0; col < getCols(); col++) {
                tiles[row][col] = TileState.Empty;
            }
        }
    }

    public int getRows() {
        return gameParameters.getRows();
    }

    public int getCols() {
        return gameParameters.getCols();
    }

    public GameState getState() {
        return state;
    }

    public boolean isHumanTurn() {
        return isHuman(turn);
    }

    public boolean isHuman(Player player) {
        return player == gameParameters.getHumanPlayer();
    }

    public Player getTurn() { return turn; }

    public TileState getState(int row, int col) {
        return tiles[row][col];
    }
}
