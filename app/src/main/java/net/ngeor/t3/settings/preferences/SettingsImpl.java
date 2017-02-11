package net.ngeor.t3.settings.preferences;

import android.content.SharedPreferences;
import net.ngeor.t3.models.Player;
import net.ngeor.t3.settings.PlayerDefinition;
import net.ngeor.t3.settings.Settings;

import java.util.Arrays;
import java.util.List;

/**
 * SettingsImpl implementation that uses SharedPreferences as a backend.
 * Created by ngeor on 2/11/2017.
 */
public class SettingsImpl implements Settings {
    private final static String KEY_FIRST_PLAYER = "pref_first_player";

    private final SharedPreferences sharedPreferences;
    public SettingsImpl(SharedPreferences sharedPreferences) {
        this.sharedPreferences = sharedPreferences;
    }

    @Override
    public int getRows() {
        return 3;
    }

    @Override
    public int getCols() {
        return 3;
    }

    @Override
    public List<PlayerDefinition> getPlayerDefinitions() {
        PlayerDefinition first, second;
        if (getFirstPlayer() == Player.X) {
            first = new PlayerDefinitionImpl(sharedPreferences, 0, Player.X);
            second = new AIPlayerDefinitionImpl(sharedPreferences, 1, Player.O);
        } else {
            first = new AIPlayerDefinitionImpl(sharedPreferences, 0, Player.O);
            second = new PlayerDefinitionImpl(sharedPreferences, 1, Player.X);
        }

        return Arrays.asList(first, second);
    }

    private Player getFirstPlayer() {
        String value = sharedPreferences.getString(KEY_FIRST_PLAYER, "");
        Player player = null;
        if (value != null && !value.isEmpty()) {
            try {
                player = Player.valueOf(value);
            } catch (IllegalArgumentException ignored) {
            }
        }

        return player == null ? Player.X : player;
    }
}
