package net.ngeor.t3.settings;

import androidx.annotation.NonNull;

import java.io.Serializable;

/**
 * Serializable implementation of Settings.
 * This is needed to save the settings mid-game.
 *
 * @author ngeor on 2/11/2017.
 */
public class Settings implements Serializable {
    private final int rows;
    private final int cols;
    private final PlayerDefinitions playerDefinitions;
    private final boolean invisibleMode;

    public Settings(int rows, int cols, boolean invisibleMode, PlayerDefinitions playerDefinitions) {
        if (playerDefinitions == null) {
            throw new IllegalArgumentException("playerDefinitions");
        }

        this.rows = rows;
        this.cols = cols;
        this.playerDefinitions = playerDefinitions;
        this.invisibleMode = invisibleMode;
    }

    public int getRows() {
        return rows;
    }

    public int getCols() {
        return cols;
    }

    @NonNull
    public PlayerDefinitions getPlayerDefinitions() {
        return playerDefinitions;
    }

    public boolean isInvisibleMode() {
        return invisibleMode;
    }

    @Override
    public boolean equals(Object o) {
        if (o instanceof Settings) {
            Settings settings = (Settings) o;
            return rows == settings.rows
                    && cols == settings.cols
                    && invisibleMode == settings.invisibleMode
                    && playerDefinitions.equals(settings.playerDefinitions);
        }

        return false;
    }

    @Override
    public int hashCode() {
        int result = rows;
        result = 31 * result + cols;
        result = 31 * result + playerDefinitions.hashCode();
        result = 31 * result + (invisibleMode ? 1 : 0);
        return result;
    }
}