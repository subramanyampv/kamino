package net.ngeor.t3.preferences;

import android.content.SharedPreferences;

import net.ngeor.t3.models.AILevel;
import net.ngeor.t3.models.PlayerSymbol;
import net.ngeor.t3.settings.AIPlayerDefinition;
import net.ngeor.t3.settings.HumanPlayerDefinition;
import net.ngeor.t3.settings.PlayerDefinition;
import net.ngeor.t3.settings.PlayerDefinitions;
import net.ngeor.t3.settings.Settings;

/**
 * PreferenceBackedSettings implementation that uses SharedPreferences as a backend.
 * If they get changed mid-game, they don't affect the existing game.
 * They are only picked up when the player presses the Restart button.
 *
 * @author ngeor on 2/11/2017.
 */
public class PreferenceBackedSettings {
    private final SharedPreferences sharedPreferences;

    public PreferenceBackedSettings(SharedPreferences sharedPreferences) {
        this.sharedPreferences = sharedPreferences;
    }

    public Settings createSettings() {
        return new Settings(3, 3, isInvisibleMode(), getPlayerDefinitions());
    }

    private PlayerDefinitions getPlayerDefinitions() {
        PlayerPreferenceKeys playerPreferenceKeys = new PlayerPreferenceKeys();

        String firstPlayerSymbol = sharedPreferences.getString(playerPreferenceKeys.symbol(PlayerName.first), "X");
        String firstPlayerType = sharedPreferences.getString(playerPreferenceKeys.type(PlayerName.first), "HUMAN");
        String firstPlayerAILevel = sharedPreferences.getString(playerPreferenceKeys.aILevel(PlayerName.first), "EASY");

        String secondPlayerSymbol = sharedPreferences.getString(playerPreferenceKeys.symbol(PlayerName.second), "O");
        String secondPlayerType = sharedPreferences.getString(playerPreferenceKeys.type(PlayerName.second), "CPU");
        String secondPlayerAILevel = sharedPreferences.getString(playerPreferenceKeys.aILevel(PlayerName.second), "EASY");

        return new PlayerDefinitions(
                createPlayerDefinition(firstPlayerSymbol, firstPlayerType, firstPlayerAILevel),
                createPlayerDefinition(secondPlayerSymbol, secondPlayerType, secondPlayerAILevel)
        );
    }

    private boolean isInvisibleMode() {
        return sharedPreferences.getBoolean("pref_key_invisible_mode", false);
    }

    private PlayerDefinition createPlayerDefinition(String symbol, String type, String aiLevel) {
        switch (type) {
            case "HUMAN":
                return createHumanPlayerDefinition(symbol);
            case "CPU":
                return createAIPlayerDefinition(symbol, aiLevel);
            default:
                throw new IllegalArgumentException("Unsupported type " + type);
        }
    }

    private PlayerDefinition createHumanPlayerDefinition(String symbol) {
        return new HumanPlayerDefinition(PlayerSymbol.valueOf(symbol));
    }

    private PlayerDefinition createAIPlayerDefinition(String symbol, String aiLevel) {
        return new AIPlayerDefinition(PlayerSymbol.valueOf(symbol), AILevel.valueOf(aiLevel));
    }
}
