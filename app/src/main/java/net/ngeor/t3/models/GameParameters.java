package net.ngeor.t3.models;

import java.io.Serializable;

/**
 * Represents the initial conditions of the game.
 * These can't change during a game.
 * Created by ngeor on 2/4/2017.
 */
public class GameParameters implements Serializable {
    private final int rows;
    private final int cols;
    private final Player firstPlayer;
    private final Player humanPlayer;

    public GameParameters(int rows, int cols, Player firstPlayer, Player humanPlayer) {
        this.rows = rows;
        this.cols = cols;
        this.firstPlayer = firstPlayer;
        this.humanPlayer = humanPlayer;
    }

    public GameParameters() {
        this(3, 3, Player.X, Player.X);
    }

    public int getRows() {
        return rows;
    }

    public int getCols() {
        return cols;
    }

    public Player getFirstPlayer() {
        return firstPlayer;
    }

    public Player getHumanPlayer() {
        return humanPlayer;
    }
}
