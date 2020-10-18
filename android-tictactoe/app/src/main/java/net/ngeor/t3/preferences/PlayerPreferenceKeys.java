package net.ngeor.t3.preferences;

/**
 * Creates preference keys per player.
 *
 * @author ngeor on 11/2/2018.
 */
public class PlayerPreferenceKeys {
    public String type(PlayerName playerNumber) {
        return "pref_key_" + playerNumber + "_player_type";
    }

    public String aILevel(PlayerName playerNumber) {
        return "pref_key_" + playerNumber + "_player_ai_level";
    }

    public String symbol(PlayerName playerNumber) {
        return "pref_key_" + playerNumber + "_player_symbol";
    }
}
