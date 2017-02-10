package net.ngeor.t3;

import android.content.Context;
import android.content.SharedPreferences;
import android.preference.PreferenceManager;
import net.ngeor.t3.models.AILevel;
import net.ngeor.t3.models.BoardInvariants;
import net.ngeor.t3.models.Player;

/**
 * Rich access to the settings data.
 * Created by ngeor on 2/5/2017.
 */
public class SettingsAdapter implements BoardInvariants {
    private final static String KEY_AI_LEVEL = "pref_ai_level";
    private final static String KEY_FIRST_PLAYER = "pref_first_player";
    private final SharedPreferences sharedPreferences;

    public SettingsAdapter(Context context) {
        sharedPreferences = PreferenceManager.getDefaultSharedPreferences(context);
    }

    public AILevel getAILevel() {
        String value = sharedPreferences.getString(KEY_AI_LEVEL, "");
        AILevel aiLevel = null;
        if (value != null && !value.isEmpty()) {
            try {
                aiLevel = AILevel.valueOf(value);
            } catch (IllegalArgumentException ignored) {
            }
        }

        return aiLevel == null ? AILevel.EASY : aiLevel;
    }

    public Player getFirstPlayer() {
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

    @Override
    public int getRows() {
        return sharedPreferences.getInt("rows", 3);
    }

    @Override
    public int getCols() {
        return sharedPreferences.getInt("cols", 3);
    }
}
