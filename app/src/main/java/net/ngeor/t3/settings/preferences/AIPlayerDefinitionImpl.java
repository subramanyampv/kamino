package net.ngeor.t3.settings.preferences;

import android.content.SharedPreferences;
import net.ngeor.t3.models.AILevel;
import net.ngeor.t3.models.PlayerSymbol;
import net.ngeor.t3.settings.AIPlayerDefinition;

/**
 * Created by ngeor on 2/11/2017.
 */
public class AIPlayerDefinitionImpl extends PlayerDefinitionImpl implements AIPlayerDefinition {
    private final static String KEY_AI_LEVEL = "pref_ai_level";
    public AIPlayerDefinitionImpl(SharedPreferences sharedPreferences, int index, PlayerSymbol playerSymbol) {
        super(sharedPreferences, index, playerSymbol);
    }

    @Override
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
}
