package net.ngeor.t3.settings.preferences;

import android.content.SharedPreferences;
import net.ngeor.t3.models.Player;
import net.ngeor.t3.models.PlayerType;
import net.ngeor.t3.settings.PlayerDefinition;

/**
 * Created by ngeor on 2/11/2017.
 */
public class PlayerDefinitionImpl implements PlayerDefinition {
    protected final SharedPreferences sharedPreferences;
    private final int index;
    private final Player player;

    public PlayerDefinitionImpl(SharedPreferences sharedPreferences, int index, Player player) {
        this.sharedPreferences = sharedPreferences;
        this.index = index;
        this.player = player;
    }

    @Override
    public Player getPlayer() {
        return player;
    }

    @Override
    public PlayerType getPlayerType() {
        return PlayerType.HUMAN;
    }
}
