package net.ngeor.t3.settings.serializable;

import net.ngeor.t3.models.Player;
import net.ngeor.t3.models.PlayerType;
import net.ngeor.t3.settings.PlayerDefinition;

import java.io.Serializable;

/**
 * Created by ngeor on 2/11/2017.
 */
public class PlayerDefinitionImpl implements PlayerDefinition, Serializable {
    private final Player player;
    private final PlayerType playerType;

    public PlayerDefinitionImpl(Player player, PlayerType playerType) {
        this.player = player;
        this.playerType = playerType;
    }

    public PlayerDefinitionImpl(PlayerDefinition other) {
        this.player = other.getPlayer();
        this.playerType = other.getPlayerType();
    }

    @Override
    public Player getPlayer() {
        return player;
    }

    @Override
    public PlayerType getPlayerType() {
        return playerType;
    }
}
