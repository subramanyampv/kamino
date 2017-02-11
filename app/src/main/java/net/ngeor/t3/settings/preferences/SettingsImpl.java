package net.ngeor.t3.settings.preferences;

import android.content.SharedPreferences;
import net.ngeor.t3.models.AILevel;
import net.ngeor.t3.models.PlayerSymbol;
import net.ngeor.t3.settings.PlayerDefinition;
import net.ngeor.t3.settings.Settings;
import net.ngeor.t3.settings.serializable.AIPlayerDefinitionImpl;
import net.ngeor.t3.settings.serializable.HumanPlayerDefinitionImpl;

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
        String firstPlayerSymbol = sharedPreferences.getString("pref_key_first_player_symbol", "X");
        String firstPlayerType = sharedPreferences.getString("pref_key_first_player_type", "HUMAN");
        String firstPlayerAILevel = sharedPreferences.getString("pref_key_first_player_ai_level", "EASY");

        String secondPlayerSymbol = sharedPreferences.getString("pref_key_second_player_symbol", "O");
        String secondPlayerType = sharedPreferences.getString("pref_key_second_player_type", "CPU");
        String secondPlayerAILevel = sharedPreferences.getString("pref_key_second_player_ai_level", "EASY");

        return Arrays.asList(
                createPlayerDefinition(firstPlayerSymbol, firstPlayerType, firstPlayerAILevel),
                createPlayerDefinition(secondPlayerSymbol, secondPlayerType, secondPlayerAILevel)
        );
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
        return new HumanPlayerDefinitionImpl(PlayerSymbol.valueOf(symbol));
    }

    private PlayerDefinition createAIPlayerDefinition(String symbol, String aiLevel) {
        return new AIPlayerDefinitionImpl(PlayerSymbol.valueOf(symbol), AILevel.valueOf(aiLevel));
    }
}
