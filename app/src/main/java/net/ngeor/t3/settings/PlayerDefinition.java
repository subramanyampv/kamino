package net.ngeor.t3.settings;

import net.ngeor.t3.models.Player;
import net.ngeor.t3.models.PlayerType;

public interface PlayerDefinition {
    Player getPlayer();
    PlayerType getPlayerType();
}

