package net.ngeor.t3.settings.serializable;

import net.ngeor.t3.models.PlayerSymbol;
import net.ngeor.t3.settings.PlayerDefinition;

import java.io.Serializable;

/**
 * Created by ngeor on 2/11/2017.
 */
public abstract class PlayerDefinitionImpl implements PlayerDefinition, Serializable {
    private final PlayerSymbol playerSymbol;

    public PlayerDefinitionImpl(PlayerSymbol playerSymbol) {
        if (playerSymbol == null) {
            throw new IllegalArgumentException();
        }

        this.playerSymbol = playerSymbol;
    }

    public PlayerDefinitionImpl(PlayerDefinition other) {
        this(other.getPlayerSymbol());
    }

    public PlayerSymbol getPlayerSymbol() {
        return playerSymbol;
    }
}

