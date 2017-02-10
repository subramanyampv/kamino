package net.ngeor.t3.models;

import java.io.Serializable;

/**
 * Represents a data transfer object of the entire game.
 * This contains anything that needs to be persisted.
 */
public class GameDto implements Serializable {
    private final PlayerAssignment playerAssignment;
    private final BoardModel boardModel;
    private GameState state;
    private Player turn;

    GameDto(BoardInvariants boardInvariants, PlayerAssignment playerAssignment) {
        this.playerAssignment = playerAssignment;

        // initialize and clear tiles
        boardModel = new BoardModel(boardInvariants);
        state = GameState.NotStarted;

        // first player plays next
        turn = playerAssignment.getFirstPlayer();
    }

    public GameDto(GameDto other) {
        this.playerAssignment = other.playerAssignment;
        this.boardModel = new BoardModel(other.boardModel);
        this.state = other.state;
        this.turn = other.turn;
    }

    public PlayerAssignment getPlayerAssignment() {
        return playerAssignment;
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

    @Deprecated
    public boolean isHumanTurn() {
        return isHuman(turn);
    }

    private boolean isHuman(Player player) {
        return playerAssignment.getPlayerType(player) == PlayerType.HUMAN;
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

    public Player getTurn() {
        return turn;
    }
}
