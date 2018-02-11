package net.ngeor.t3.settings;

import android.content.SharedPreferences;

import net.ngeor.t3.models.AILevel;
import net.ngeor.t3.models.PlayerSymbol;

import org.junit.Before;
import org.junit.Test;

import java.util.Arrays;
import java.util.List;

import static org.junit.Assert.assertEquals;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;

/**
 * Unit tests for PreferenceBackedSettings.
 * Created by ngeor on 2/11/2017.
 */
public class PreferenceBackedSettingsTest {
    private SharedPreferences sharedPreferences;
    private PreferenceBackedSettings settings;

    @Before
    public void setUp() {
        sharedPreferences = mock(SharedPreferences.class);
        settings = new PreferenceBackedSettings(sharedPreferences);

        // mock default values
        mockPreference("pref_key_first_player_symbol", "X", "X");
        mockPreference("pref_key_first_player_type", "HUMAN", "HUMAN");
        mockPreference("pref_key_first_player_ai_level", "EASY", null);

        mockPreference("pref_key_second_player_symbol", "O", "O");
        mockPreference("pref_key_second_player_type", "CPU", "CPU");
        mockPreference("pref_key_second_player_ai_level", "EASY", "EASY");
    }

    @Test
    public void getRows() {
        assertEquals(3, settings.createSettings().getRows());
    }

    @Test
    public void getCols() {
        assertEquals(3, settings.createSettings().getCols());
    }

    @Test
    public void getPlayerDefinitions_withDefaultSettings() {
        // arrange

        // act
        List<PlayerDefinition> playerDefinitions = settings.createSettings().getPlayerDefinitions();

        // assert
        assertEquals(
                Arrays.asList(
                        new HumanPlayerDefinitionImpl(PlayerSymbol.X),
                        new AIPlayerDefinitionImpl(PlayerSymbol.O, AILevel.EASY)),
                playerDefinitions);
    }

    @Test
    public void getPlayerDefinitions_withCustomSettings() {
        // arrange
        mockPreference("pref_key_first_player_symbol", "X", "O");
        mockPreference("pref_key_first_player_type", "HUMAN", "CPU");
        mockPreference("pref_key_first_player_ai_level", "EASY", "MEDIUM");

        mockPreference("pref_key_second_player_symbol", "O", "X");
        mockPreference("pref_key_second_player_type", "CPU", "HUMAN");
        mockPreference("pref_key_second_player_ai_level", "EASY", "EASY");

        // act
        List<PlayerDefinition> playerDefinitions = settings.createSettings().getPlayerDefinitions();

        // assert
        assertEquals(
                Arrays.asList(
                        new AIPlayerDefinitionImpl(PlayerSymbol.O, AILevel.MEDIUM),
                        new HumanPlayerDefinitionImpl(PlayerSymbol.X)),
                playerDefinitions);
    }

    private void mockPreference(String key, String defaultValue, String value) {
        when(sharedPreferences.getString(key, defaultValue)).thenReturn(value);
    }
}