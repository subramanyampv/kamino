package net.ngeor.t3.preferences;

import org.junit.Test;

import static org.junit.Assert.assertEquals;

/**
 * Unit tests for PlayerPreferenceKeys.
 *
 * @author ngeor on 11/2/2018.
 */
public class PlayerPreferenceKeysTest {
    @Test
    public void type() throws Exception {
        PlayerPreferenceKeys playerPreferenceKeys = new PlayerPreferenceKeys();
        assertEquals("pref_key_first_player_type", playerPreferenceKeys.type(PlayerName.first));
    }

    @Test
    public void aILevel() throws Exception {
        PlayerPreferenceKeys playerPreferenceKeys = new PlayerPreferenceKeys();
        assertEquals("pref_key_second_player_ai_level", playerPreferenceKeys.aILevel(PlayerName.second));
    }

    @Test
    public void symbol() throws Exception {
        PlayerPreferenceKeys playerPreferenceKeys = new PlayerPreferenceKeys();
        assertEquals("pref_key_first_player_symbol", playerPreferenceKeys.symbol(PlayerName.first));
    }
}