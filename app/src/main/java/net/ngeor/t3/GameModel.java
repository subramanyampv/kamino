package net.ngeor.t3;

import java.io.Serializable;
import java.util.ArrayList;
import java.util.List;

/**
 * Represents the state of the board.
 * Created by ngeor on 1/29/2017.
 */
public class GameModel implements Serializable {
    private final TileState[][] tiles;
    private GameState state;
    private int rows = 3;
    private int cols = 3;
    private TileState humanState = TileState.X;
    private TileState cpuState = TileState.O;

    // TODO somehow this gets serialized
    // that's why there is a setGameModelListener instead of addGameModelListener
    private final transient List<GameModelListener> gameModelListeners = new ArrayList<>();
    private TileState turn;

    public GameModel() {
        tiles = new TileState[rows][cols];
        state = GameState.WaitingHuman;
        turn = getHumanState();
        clearTiles();
    }

    private void clearTiles() {
        for (int row = 0; row < rows; row++) {
            for (int col = 0; col < cols; col++) {
                tiles[row][col] = TileState.Empty;
            }
        }
    }

    public void reset() {
        clearTiles();
        turn = getHumanState();

        // this will trigger an event
        setState(GameState.WaitingHuman);
    }

    public int getRows() {
        return rows;
    }

    public int getCols() {
        return cols;
    }

    public TileState getHumanState() {
        return humanState;
    }

    public TileState getCpuState() {
        return cpuState;
    }

    public GameState getState() {
        return state;
    }

    public TileState getTurn() { return turn; }

    private void setState(GameState state) {
        this.state = state;
        fireStateChanged();
    }

    public TileState getState(int row, int col) {
        return tiles[row][col];
    }

    public void play(int row, int col) {
        tiles[row][col] = turn;

        TileState nextTurn = TileState.Empty;
        // notify that someone played
        if (turn == getHumanState()) {
            fireHumanPlayed();
            nextTurn = getCpuState();
        } else if (turn == getCpuState()) {
            fireCpuPlayed();
            nextTurn = getHumanState();
        }

        // move to next state
        TileState winner = getWinner();
        if (winner != TileState.Empty) {
            setState(GameState.Victory);
        } else if (isBoardFull()) {
            setState(GameState.Draw);
        } else {
            turn = nextTurn;
            if (turn == getHumanState()) {
                setState(GameState.WaitingHuman);
            } else {
                setState(GameState.WaitingCpu);
            }
        }
    }

    public boolean isBoardFull() {
        for (int row = 0; row < rows; row++) {
            for (int col = 0; col < cols; col++) {
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
        for (int row = 0; row < rows; row++) {
            sequenceProviders.add(new HorizontalSequenceProvider(row));
        }

        // check vertical matches
        for (int col = 0; col < cols; col++) {
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
            for (int col = 0; col < cols; col++) {
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
            for (int row = 0; row < rows; row++) {
                result.add(getState(row, col));
            }

            return result;
        }
    }

    class LeftTopRightBottomSequenceProvider implements SequenceProvider {
        @Override
        public List<TileState> getSequence() {
            List<TileState> result = new ArrayList<>();
            for (int row = 0; row < rows; row++) {
                result.add(getState(row, row));
            }

            return result;
        }
    }

    class LeftBottomRightTopSequenceProvider implements SequenceProvider {
        @Override
        public List<TileState> getSequence() {
            List<TileState> result = new ArrayList<>();
            for (int row = 0; row < rows; row++) {
                result.add(getState(rows - row - 1, row));
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
        gameModelListeners.clear();
        gameModelListeners.add(gameModelListener);
    }

    private void fireStateChanged() {
        for (GameModelListener gameModelListener : gameModelListeners) {
            gameModelListener.stateChanged(this);
        }
    }

    private void fireHumanPlayed() {
        for (GameModelListener gameModelListener : gameModelListeners) {
            gameModelListener.humanPlayed(this);
        }
    }

    private void fireCpuPlayed() {
        for (GameModelListener gameModelListener : gameModelListeners) {
            gameModelListener.cpuPlayed(this);
        }
    }
}
