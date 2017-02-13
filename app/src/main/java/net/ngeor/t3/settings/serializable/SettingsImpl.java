package net.ngeor.t3.settings.serializable;

import net.ngeor.t3.settings.AIPlayerDefinition;
import net.ngeor.t3.settings.HumanPlayerDefinition;
import net.ngeor.t3.settings.PlayerDefinition;
import net.ngeor.t3.settings.Settings;

import java.io.Serializable;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Collections;
import java.util.List;

/**
 * Serializable implementation of Settings.
 * This is needed to save the settings mid-game.
 * Created by ngeor on 2/11/2017.
 */
public class SettingsImpl implements Settings, Serializable {
    private final int rows;
    private final int cols;
    private final List<PlayerDefinition> playerDefinitions;
    private final boolean invisibleMode;

    public SettingsImpl(int rows, int cols, PlayerDefinition... playerDefinitions) {
        this.rows = rows;
        this.cols = cols;
        this.playerDefinitions = Arrays.asList(playerDefinitions);
        this.invisibleMode = false;
    }

    public SettingsImpl(Settings other) {
        this.rows = other.getRows();
        this.cols = other.getCols();

        List<PlayerDefinition> converted = new ArrayList<>();
        for (PlayerDefinition otherPlayerDefinition : other.getPlayerDefinitions()) {
            converted.add(convert(otherPlayerDefinition));
        }

        playerDefinitions = Collections.unmodifiableList(converted);
        this.invisibleMode = other.isInvisibleMode();
    }

    @Override
    public int getRows() {
        return rows;
    }

    @Override
    public int getCols() {
        return cols;
    }

    @Override
    public List<PlayerDefinition> getPlayerDefinitions() {
        return playerDefinitions;
    }

    @Override
    public boolean isInvisibleMode() {
        return invisibleMode;
    }

    private static PlayerDefinition convert(PlayerDefinition other) {
        if (other instanceof AIPlayerDefinition) {
            return convert((AIPlayerDefinition)other);
        }

        if (other instanceof HumanPlayerDefinition) {
            return convert((HumanPlayerDefinition)other);
        }

        throw new IllegalArgumentException();
    }

    private static PlayerDefinition convert(HumanPlayerDefinition other) {
        return new HumanPlayerDefinitionImpl(other);
    }

    private static PlayerDefinition convert(AIPlayerDefinition other) {
        return new AIPlayerDefinitionImpl(other);
    }
}