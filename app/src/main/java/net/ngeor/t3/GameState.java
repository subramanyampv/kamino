package net.ngeor.t3;

/**
 * Represents the state of the game.
 * Created by ngeor on 1/29/2017.
 */
public enum GameState {
    /**
     * Waiting for the human player to play.
     */
    WaitingHuman,

    /**
     * Waiting for the CPU to play.
     */
    WaitingCpu,

    /**
     * The game is finished with someone winning.
     */
    Victory,

    /**
     * The game resulted in a draw.
     */
    Draw
}
