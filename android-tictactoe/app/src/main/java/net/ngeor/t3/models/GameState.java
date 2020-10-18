package net.ngeor.t3.models;

/**
 * Represents the state of the game.
 * Created by ngeor on 1/29/2017.
 */
public enum GameState {
    /**
     * The game has not started yet.
     */
    NotStarted,

    /**
     * Waiting for a player to immutablePlay.
     */
    WaitingPlayer,

    /**
     * The game is finished with someone winning.
     */
    Victory,

    /**
     * The game resulted in a draw.
     */
    Draw
}
