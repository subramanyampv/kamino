package net.ngeor.t3;

import android.content.Context;
import android.content.SharedPreferences;
import android.preference.PreferenceManager;
import net.ngeor.t3.models.AILevel;

/**
 * Rich access to the settings data.
 * Created by ngeor on 2/5/2017.
 */
public class SettingsAdapter {
    private final SharedPreferences sharedPreferences;
    private final static String KEY_AI_LEVEL = "pref_ai_level";

    public SettingsAdapter(Context context) {
        sharedPreferences = PreferenceManager.getDefaultSharedPreferences(context);
    }

    public AILevel getAILevel() {
        String aiLevelAsString = sharedPreferences.getString(KEY_AI_LEVEL, "");
        AILevel aiLevel = AILevel.EASY;
        try {
            if (aiLevelAsString != null && !aiLevelAsString.isEmpty()) {
                aiLevel = AILevel.valueOf(aiLevelAsString);
            }
        } catch (IllegalArgumentException ex) {
            aiLevel = AILevel.EASY;
        }

        return aiLevel;
    }
}
