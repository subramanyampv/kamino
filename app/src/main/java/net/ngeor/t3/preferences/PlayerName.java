package net.ngeor.t3.preferences;

/**
 * Holds the names of the players, as stored in the preferences.
 *
 * @author ngeor on 11/2/2018.
 */
public enum PlayerName {
    first,
    second;

    public PlayerName other() {
        return this == first ? second : first;
    }
}
