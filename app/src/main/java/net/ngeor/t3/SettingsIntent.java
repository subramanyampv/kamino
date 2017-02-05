package net.ngeor.t3;

import android.content.Intent;
import net.ngeor.t3.models.AILevel;

/**
 * Rich access to the settings intent data.
 * Created by ngeor on 2/5/2017.
 */
public class SettingsIntent {
    private final Intent intent;
    private final static String KEY_AI_LEVEL = "aiLevel";

    public SettingsIntent(Intent intent) {
        this.intent = intent;
    }

    public AILevel getAILevel() {
        return AILevel.values()[intent.getIntExtra(KEY_AI_LEVEL, AILevel.Easy.ordinal())];
    }

    public void setAILevel(AILevel value) {
        intent.putExtra(KEY_AI_LEVEL, value.ordinal());
    }
}
