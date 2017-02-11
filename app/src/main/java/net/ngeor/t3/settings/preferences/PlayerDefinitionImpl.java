package net.ngeor.t3.settings.preferences;

import android.content.SharedPreferences;
import net.ngeor.t3.models.PlayerSymbol;
import net.ngeor.t3.settings.PlayerDefinition;

/**
 * Created by ngeor on 2/11/2017.
 */
public abstract class PlayerDefinitionImpl implements PlayerDefinition {
    protected final SharedPreferences sharedPreferences;
    private final int index;
    private final PlayerSymbol playerSymbol;

    public PlayerDefinitionImpl(SharedPreferences sharedPreferences, int index, PlayerSymbol playerSymbol) {
        this.sharedPreferences = sharedPreferences;
        this.index = index;
        this.playerSymbol = playerSymbol;
    }

    public PlayerSymbol getPlayerSymbol() {
        return playerSymbol;
    }
}

