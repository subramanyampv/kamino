package net.ngeor.t3.settings;

import net.ngeor.t3.models.PlayerSymbol;

import java.io.Serializable;

/**
 * Base class for player definitions.
 *
 * @author ngeor on 2/11/2017.
 */
public abstract class PlayerDefinition implements Serializable {
    private final PlayerSymbol playerSymbol;

    public PlayerDefinition(PlayerSymbol playerSymbol) {
        if (playerSymbol == null) {
            throw new IllegalArgumentException();
        }

        this.playerSymbol = playerSymbol;
    }

    public PlayerSymbol getPlayerSymbol() {
        return playerSymbol;
    }
}

