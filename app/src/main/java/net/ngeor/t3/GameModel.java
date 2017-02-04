package net.ngeor.t3;

import java.util.ArrayList;
import java.util.List;

/**
 * Represents the state of the board.
 * Created by ngeor on 1/29/2017.
 */
public class GameModel extends GameDto {
    // TODO somehow this gets serialized
    // that's why there's the split to GameDto
    private transient GameModelListener gameModelListener = new NullGameModelListener();

    public GameModel(GameParameters gameParameters) {
        super(gameParameters);
    }

    public GameModel(GameDto savedState) {
        super(savedState);
    }

    public void start() {
        setState(GameState.WaitingPlayer);
    }

    private void setState(GameState state) {
        this.state = state;
        fireStateChanged();
    }

    public void play(int row, int col) {
        tiles[row][col] = TileState.fromPlayer(turn);

        // move to next state
        TileState winner = getWinner();
        if (winner != TileState.Empty) {
            setState(GameState.Victory);
        } else if (isBoardFull()) {
            setState(GameState.Draw);
        } else {
            turn = turn.opponent();
            setState(GameState.WaitingPlayer);
        }
    }

    private boolean isBoardFull() {
        for (int row = 0; row < getRows(); row++) {
            for (int col = 0; col < getCols(); col++) {
                if (getState(row, col) == TileState.Empty) {
                    return false;
                }
            }
        }

        return true;
    }

    private TileState getWinner() {
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
            for (int col = 0; col < getCols(); col++) {
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
            for (int row = 0; row < getRows(); row++) {
                result.add(getState(row, col));
            }

            return result;
        }
    }

    class LeftTopRightBottomSequenceProvider implements SequenceProvider {
        @Override
        public List<TileState> getSequence() {
            List<TileState> result = new ArrayList<>();
            for (int row = 0; row < getRows(); row++) {
                result.add(getState(row, row));
            }

            return result;
        }
    }

    class LeftBottomRightTopSequenceProvider implements SequenceProvider {
        @Override
        public List<TileState> getSequence() {
            List<TileState> result = new ArrayList<>();
            for (int row = 0; row < getRows(); row++) {
                result.add(getState(getRows() - row - 1, row));
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

    public void setGameModelListener(GameModelListener gameModelListener) {
        if (gameModelListener == null) {
            throw new IllegalArgumentException();
        }

        this.gameModelListener = gameModelListener;
    }

    private void fireStateChanged() {
        gameModelListener.stateChanged(this);
    }
}
