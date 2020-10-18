package net.ngeor.t3.models;

import java.io.Serializable;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

/**
 * Represents a collection of tiles.
 *
 * @author ngeor on 2/7/2017.
 */
public class BoardModel implements Serializable {
    private final int rows;
    private final int cols;
    private final PlayerSymbol[] tileStates;

    public BoardModel(int rows, int cols) {
        this.rows = rows;
        this.cols = cols;
        this.tileStates = new PlayerSymbol[rows * cols];
        Arrays.fill(tileStates, null);
    }

    private BoardModel(int rows, int cols, PlayerSymbol[] tileStates) {
        this.rows = rows;
        this.cols = cols;
        this.tileStates = tileStates;
    }

    public int getRows() {
        return rows;
    }

    public int getCols() {
        return cols;
    }

    public PlayerSymbol getTileState(int row, int col) {
        return tileStates[row * getCols() + col];
    }

    public PlayerSymbol getTileState(Location location) {
        return getTileState(location.getRow(), location.getCol());
    }

    public BoardModel playAt(int row, int col, PlayerSymbol tileState) {
        if (tileState == null) {
            throw new IllegalArgumentException("TileState cannot be null");
        }

        if (getTileState(row, col) != null) {
            throw new IllegalStateException("Tile is taken");
        }

        PlayerSymbol[] newState = Arrays.copyOf(tileStates, tileStates.length);
        newState[row * rows + col] = tileState;
        return new BoardModel(rows, cols, newState);
    }

    public List<Location> allLocations() {
        List<Location> result = new ArrayList<>();
        for (int row = 0; row < rows; row++) {
            for (int col = 0; col < cols; col++) {
                result.add(new Location(row, col));
            }
        }

        return result;
    }

    public List<Location> emptyLocations() {
        List<Location> result = new ArrayList<>();
        for (int row = 0; row < rows; row++) {
            for (int col = 0; col < cols; col++) {
                if (getTileState(row, col) == null) {
                    result.add(new Location(row, col));
                }
            }
        }

        return result;
    }

    public boolean isBoardFull() {
        return emptyLocations().isEmpty();
    }

    public PlayerSymbol getWinner() {
        for (List<Location> sequence : new WinningSequencesProvider().calculate(this)) {
            PlayerSymbol winner = getWinner(sequence);
            if (winner != null) {
                return winner;
            }
        }

        return null;
    }

    private PlayerSymbol getWinner(List<Location> sequence) {
        PlayerSymbol first = getTileState(sequence.get(0));
        for (int i = 1; i < sequence.size(); i++) {
            if (first != getTileState(sequence.get(i))) {
                // different tile found
                return null;
            }
        }

        return first;
    }
}
