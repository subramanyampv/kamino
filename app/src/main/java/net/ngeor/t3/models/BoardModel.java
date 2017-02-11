package net.ngeor.t3.models;

import net.ngeor.t3.settings.Settings;

import java.io.Serializable;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

/**
 * Represents a collection of tiles.
 * Created by ngeor on 2/7/2017.
 */
public class BoardModel implements Serializable {
    private final int rows;
    private final int cols;
    private final TileState[] tileStates;

    public BoardModel(int rows, int cols) {
        this.rows = rows;
        this.cols = cols;
        this.tileStates = new TileState[rows * cols];
        Arrays.fill(tileStates, TileState.EMPTY);
    }

    public BoardModel(Settings settings) {
        this(settings.getRows(), settings.getCols());
    }

    public BoardModel(BoardModel model) {
        this.rows = model.getRows();
        this.cols = model.getCols();
        this.tileStates = Arrays.copyOf(model.tileStates, model.tileStates.length);
    }

    public int getRows() {
        return rows;
    }

    public int getCols() {
        return cols;
    }

    public TileState getTileState(int row, int col) {
        return tileStates[row * getCols() + col];
    }

    void setTileState(int row, int col, TileState tileState) {
        tileStates[row * getCols() + col] = tileState;
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

    public TileState getTileState(Location location) {
        return getTileState(location.getRow(), location.getCol());
    }

    public List<Location> emptyLocations() {
        List<Location> result = new ArrayList<>();
        for (int row = 0; row < rows; row++) {
            for (int col = 0; col < cols; col++) {
                if (getTileState(row, col) == TileState.EMPTY) {
                    result.add(new Location(row, col));
                }
            }
        }

        return result;
    }

    public boolean isBoardFull() {
        return emptyLocations().isEmpty();
    }

    class HorizontalSequenceProvider implements SequenceProvider {
        private final int row;

        public HorizontalSequenceProvider(int row) {
            this.row = row;
        }

        @Override
        public List<Location> getSequence() {
            List<Location> result = new ArrayList<>();
            for (int col = 0; col < getCols(); col++) {
                result.add(new Location(row, col));
            }

            return result;
        }
    }

    class VerticalSequenceProvider implements SequenceProvider {
        private final int col;

        public VerticalSequenceProvider(int col) {
            this.col = col;
        }

        @Override
        public List<Location> getSequence() {
            List<Location> result = new ArrayList<>();
            for (int row = 0; row < getRows(); row++) {
                result.add(new Location(row, col));
            }

            return result;
        }
    }

    class LeftTopRightBottomSequenceProvider implements SequenceProvider {
        @Override
        public List<Location> getSequence() {
            List<Location> result = new ArrayList<>();
            for (int row = 0; row < getRows(); row++) {
                result.add(new Location(row, row));
            }

            return result;
        }
    }

    class LeftBottomRightTopSequenceProvider implements SequenceProvider {
        @Override
        public List<Location> getSequence() {
            List<Location> result = new ArrayList<>();
            for (int row = 0; row < getRows(); row++) {
                result.add(new Location(getRows() - row - 1, row));
            }

            return result;
        }
    }

    public List<SequenceProvider> winningSequenceProviders() {
        List<SequenceProvider> sequenceProviders = new ArrayList<>();

        // check horizontal matches
        for (int row = 0; row < getRows(); row++) {
            sequenceProviders.add(new HorizontalSequenceProvider(row));
        }

        // check vertical matches
        for (int col = 0; col < getCols(); col++) {
            sequenceProviders.add(new VerticalSequenceProvider(col));
        }

        // check left-top -> right-bottom diagonal
        sequenceProviders.add(new LeftTopRightBottomSequenceProvider());

        // check left-bottom -> right-top diagonal
        sequenceProviders.add(new LeftBottomRightTopSequenceProvider());
        return sequenceProviders;
    }

    private TileState getWinner(List<Location> sequence) {
        TileState first = getTileState(sequence.get(0));
        for (int i = 1; i < sequence.size(); i++) {
            if (first != getTileState(sequence.get(i))) {
                // different tile found
                return TileState.EMPTY;
            }
        }

        return first;
    }

    public TileState getWinner() {
        for (SequenceProvider sequenceProvider : winningSequenceProviders()) {
            List<Location> sequence = sequenceProvider.getSequence();
            TileState winner = getWinner(sequence);
            if (winner != TileState.EMPTY) {
                return winner;
            }
        }

        return TileState.EMPTY;
    }
}
