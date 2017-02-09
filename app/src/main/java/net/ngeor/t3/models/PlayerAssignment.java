package net.ngeor.t3.models;

import java.io.Serializable;

/**
 * Determines which player type controls which symbol.
 * Created by ngeor on 2/7/2017.
 */
public class PlayerAssignment implements Serializable {
    private final Player firstPlayer;

    public PlayerAssignment(Player firstPlayer) {
        this.firstPlayer = firstPlayer;
    }

    public Player getFirstPlayer() {
        return firstPlayer;
    }

    public PlayerType getPlayerType(Player player) {
        switch (player) {
            case X:
                return PlayerType.HUMAN;
            case O:
                return PlayerType.CPU;
            default:
                throw new IllegalArgumentException();
        }
    }
}
