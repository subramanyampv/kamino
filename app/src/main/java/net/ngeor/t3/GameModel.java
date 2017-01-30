package net.ngeor.t3;

import java.util.ArrayList;
import java.util.List;

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

    public TileState getWinner() {
        List<SequenceProvider> sequenceProviders = new ArrayList<>();

        // check horizontal matches
        for (int row = 0; row < ROWS; row++) {
            sequenceProviders.add(new HorizontalSequenceProvider(row));
        }

        // check vertical matches
        for (int col = 0; col < COLS; col++) {
            sequenceProviders.add(new VerticalSequenceProvider(col));
        }

        // check left-top -> right-bottom diagonal
        sequenceProviders.add(new LeftTopRightBottomSequenceProvider());

        // check left-bottom -> right-top diagonal
        sequenceProviders.add(new LeftBottomRightTopSequenceProvider());

        for (SequenceProvider sequenceProvider : sequenceProviders) {
            List<TileState> sequence = sequenceProvider.getSequence();
            TileState winner = getWinner(sequence);
            if (winner != TileState.Empty) {
                return winner;
            }
        }

        return TileState.Empty;
    }

    interface SequenceProvider {
        List<TileState> getSequence();
    }

    class HorizontalSequenceProvider implements SequenceProvider {
        private final int row;

        public HorizontalSequenceProvider(int row) {
            this.row = row;
        }

        @Override
        public List<TileState> getSequence() {
            List<TileState> result = new ArrayList<>();
            for (int col = 0; col < COLS; col++) {
                result.add(getState(row, col));
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
        public List<TileState> getSequence() {
            List<TileState> result = new ArrayList<>();
            for (int row = 0; row < ROWS; row++) {
                result.add(getState(row, col));
            }

            return result;
        }
    }

    class LeftTopRightBottomSequenceProvider implements  SequenceProvider {
        @Override
        public List<TileState> getSequence() {
            List<TileState> result = new ArrayList<>();
            for (int row = 0; row < ROWS; row++) {
                result.add(getState(row, row));
            }

            return result;
        }
    }

    class LeftBottomRightTopSequenceProvider implements SequenceProvider {
        @Override
        public List<TileState> getSequence() {
            List<TileState> result = new ArrayList<>();
            for (int row = 0; row < ROWS; row++) {
                result.add(getState(ROWS - row - 1, row));
            }

            return result;
        }
    }

    private TileState getWinner(List<TileState> sequence) {
        TileState first = sequence.get(0);
        for (int i = 1; i < sequence.size(); i++) {
            if (first != sequence.get(i)) {
                // different tile found
                return TileState.Empty;
            }
        }

        return first;
    }
}
