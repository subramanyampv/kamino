package net.ngeor.t3.models;

import net.ngeor.t3.settings.Settings;

/**
 * Represents the state of the board.
 *
 * @author ngeor on 1/29/2017.
 */
public class ImmutableGameModelImpl implements ImmutableGameModel {
    private final Settings settings;
    private final BoardModel boardModel;
    private final GameState state;
    private final PlayerSymbol turn;

    public ImmutableGameModelImpl(Settings settings) {
        this(
                settings,
                new BoardModel(settings.getRows(), settings.getCols()),
                GameState.NotStarted,
                settings.getPlayerDefinitions().getFirstPlayerDefinition().getPlayerSymbol());
    }

    public ImmutableGameModelImpl(Settings settings, BoardModel boardModel, GameState state, PlayerSymbol turn) {
        this.settings = settings;
        this.boardModel = boardModel;
        this.state = state;
        this.turn = turn;
    }

    @Override
    public Settings getSettings() {
        return settings;
    }

    @Override
    public BoardModel getBoardModel() {
        return boardModel;
    }

    @Override
    public GameState getState() {
        return state;
    }

    @Override
    public ImmutableGameModel immutablePlay(int row, int col) {
        if (state != GameState.WaitingPlayer) {
            throw new IllegalStateException("Game is not started: " + state);
        }

        BoardModel newBoardModel = boardModel.playAt(row, col, turn);

        // move to next state
        PlayerSymbol winner = newBoardModel.getWinner();
        GameState newState;
        PlayerSymbol newTurn = turn;
        if (winner != null) {
            newState = GameState.Victory;
        } else if (newBoardModel.isBoardFull()) {
            newState = GameState.Draw;
        } else {
            newTurn = turn.opponent();
            newState = GameState.WaitingPlayer;
        }

        return new ImmutableGameModelImpl(settings, newBoardModel, newState, newTurn);
    }

    @Override
    public PlayerSymbol getTurn() {
        return turn;
    }


    @Override
    public ImmutableGameModel immutableStart() {
        return new ImmutableGameModelImpl(settings, boardModel, GameState.WaitingPlayer, turn);
    }
}
