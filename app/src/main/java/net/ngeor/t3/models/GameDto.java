package net.ngeor.t3.models;

import java.io.Serializable;
import java.util.ArrayList;
import java.util.List;

public class GameDto implements Serializable {
    private final GameParameters gameParameters;
    private final Tile[][] tiles;
    private GameState state;
    private Player turn;

    GameDto(GameParameters gameParameters) {
        // store game parameters
        this.gameParameters = gameParameters;

        // initialize and clear tiles
        tiles = new Tile[getRows()][getCols()];
        clearTiles();

        state = GameState.NotStarted;

        // first player plays next
        turn = gameParameters.getFirstPlayer();
    }

    public GameDto(GameDto other) {
        // shallow copy immutable game parameters
        this.gameParameters = other.gameParameters;

        // deep copy tiles
        this.tiles = new Tile[getRows()][getCols()];
        for (int row = 0; row < getRows(); row++) {
            for (int col = 0; col < getCols(); col++) {
                tiles[row][col] = new Tile(this, other.tiles[row][col]);
            }
        }

        this.state = other.state;
        this.turn = other.turn;
    }

    public GameParameters getGameParameters() {
        return gameParameters;
    }

    private void clearTiles() {
        for (int row = 0; row < getRows(); row++) {
            for (int col = 0; col < getCols(); col++) {
                tiles[row][col] = new Tile(this, new Location(row, col));
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

    protected void setState(GameState state) {
        this.state = state;
    }

    public boolean isHumanTurn() {
        return isHuman(turn);
    }

    private boolean isHuman(Player player) {
        return player == gameParameters.getHumanPlayer();
    }

    public void play(int row, int col) {
        tiles[row][col].setState(TileState.fromPlayer(turn));

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

    public Tile getTile(int row, int col) {
        return tiles[row][col];
    }

    public List<Tile> allTiles() {
        List<Tile> tiles = new ArrayList<>();
        for (int row = 0; row < getRows(); row++) {
            for (int col = 0; col < getCols(); col++) {
                tiles.add(getTile(row, col));
            }
        }

        return tiles;
    }

    private boolean isBoardFull() {
        for (Tile tile : allTiles()) {
            if (tile.isEmpty()) {
                return false;
            }
        }

        return true;
    }

    protected List<SequenceProvider> sequenceProviders() {
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

    private TileState getWinner() {
        for (SequenceProvider sequenceProvider : sequenceProviders()) {
            List<Tile> sequence = sequenceProvider.getSequence();
            TileState winner = getWinner(sequence);
            if (winner != TileState.Empty) {
                return winner;
            }
        }

        return TileState.Empty;
    }

    class HorizontalSequenceProvider implements SequenceProvider {
        private final int row;

        public HorizontalSequenceProvider(int row) {
            this.row = row;
        }

        @Override
        public List<Tile> getSequence() {
            List<Tile> result = new ArrayList<>();
            for (int col = 0; col < getCols(); col++) {
                result.add(getTile(row, col));
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
        public List<Tile> getSequence() {
            List<Tile> result = new ArrayList<>();
            for (int row = 0; row < getRows(); row++) {
                result.add(getTile(row, col));
            }

            return result;
        }
    }

    class LeftTopRightBottomSequenceProvider implements SequenceProvider {
        @Override
        public List<Tile> getSequence() {
            List<Tile> result = new ArrayList<>();
            for (int row = 0; row < getRows(); row++) {
                result.add(getTile(row, row));
            }

            return result;
        }
    }

    class LeftBottomRightTopSequenceProvider implements SequenceProvider {
        @Override
        public List<Tile> getSequence() {
            List<Tile> result = new ArrayList<>();
            for (int row = 0; row < getRows(); row++) {
                result.add(getTile(getRows() - row - 1, row));
            }

            return result;
        }
    }

    private TileState getWinner(List<Tile> sequence) {
        TileState first = sequence.get(0).getState();
        for (int i = 1; i < sequence.size(); i++) {
            if (first != sequence.get(i).getState()) {
                // different tile found
                return TileState.Empty;
            }
        }

        return first;
    }
}
