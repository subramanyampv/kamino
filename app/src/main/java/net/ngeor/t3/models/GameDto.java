package net.ngeor.t3.models;

import net.ngeor.t3.settings.Settings;

import java.io.Serializable;

/**
 * Represents a data transfer object of the entire game.
 * This contains anything that needs to be persisted.
 */
public class GameDto implements Serializable {
    private Settings settings;
    private BoardModel boardModel;
    private GameState state;
    private PlayerSymbol turn;

    public GameDto(Settings settings) {
        restart(settings);
    }

    public GameDto(GameDto other) {
        this.settings = other.settings;

        // deep copy to be able to mutate
        this.boardModel = new BoardModel(other.boardModel);
        this.state = other.state;
        this.turn = other.turn;
    }

    public void restart(Settings settings) {
        this.settings = settings;
        boardModel = new BoardModel(settings);
        state = GameState.NotStarted;
        turn = settings.getPlayerDefinitions().get(0).getPlayerSymbol();
    }

    public Settings getSettings() {
        return settings;
    }

    public BoardModel getBoardModel() {
        return boardModel;
    }

    public GameState getState() {
        return state;
    }

    protected void setState(GameState state) {
        this.state = state;
    }

    public void play(int row, int col) {
        boardModel.setTileState(row, col, TileState.fromPlayer(turn));

        // move to next state
        TileState winner = getBoardModel().getWinner();
        if (winner != TileState.EMPTY) {
            setState(GameState.Victory);
        } else if (getBoardModel().isBoardFull()) {
            setState(GameState.Draw);
        } else {
            turn = turn.opponent();
            setState(GameState.WaitingPlayer);
        }
    }

    public PlayerSymbol getTurn() {
        return turn;
    }
}
