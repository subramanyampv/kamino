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
    private final GameParameters gameParameters;
    private GameState state;

    // TODO somehow this gets serialized
    // that's why there is a setGameModelListener instead of addGameModelListener
    private final transient List<GameModelListener> gameModelListeners = new ArrayList<>();
    private Player turn;

    public GameModel(GameParameters gameParameters) {
        // store game parameters
        this.gameParameters = gameParameters;

        // initialize and clear tiles
        tiles = new TileState[getRows()][getCols()];
        clearTiles();

        // first player plays next
        turn = gameParameters.getFirstPlayer();
        state = GameState.NotStarted;
    }

    public void start() {
        setState(GameState.WaitingPlayer);
    }

    private void clearTiles() {
        for (int row = 0; row < getRows(); row++) {
            for (int col = 0; col < getCols(); col++) {
                tiles[row][col] = TileState.Empty;
            }
        }
    }

    public void reset() {
        clearTiles();
        turn = gameParameters.getFirstPlayer();

        // this will trigger an event
        setState(GameState.WaitingPlayer);
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

    private void setState(GameState state) {
        this.state = state;
        fireStateChanged();
    }

    public TileState getState(int row, int col) {
        return tiles[row][col];
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

    public boolean isBoardFull() {
        for (int row = 0; row < getRows(); row++) {
            for (int col = 0; col < getCols(); col++) {
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
        gameModelListeners.clear();
        gameModelListeners.add(gameModelListener);
    }

    private void fireStateChanged() {
        for (GameModelListener gameModelListener : gameModelListeners) {
            gameModelListener.stateChanged(this);
        }
    }
}
