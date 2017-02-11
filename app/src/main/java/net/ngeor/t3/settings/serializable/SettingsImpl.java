package net.ngeor.t3.settings.serializable;

import net.ngeor.t3.models.AILevel;
import net.ngeor.t3.models.Player;
import net.ngeor.t3.models.PlayerType;
import net.ngeor.t3.settings.AIPlayerDefinition;
import net.ngeor.t3.settings.PlayerDefinition;
import net.ngeor.t3.settings.Settings;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.Collections;
import java.util.List;

/**
 * Created by ngeor on 2/11/2017.
 */
public class SettingsImpl implements Settings {
    private final int rows;
    private final int cols;
    private final List<PlayerDefinition> playerDefinitions;

    public SettingsImpl() {
        rows = 3;
        cols = 3;

        PlayerDefinition first = new PlayerDefinitionImpl(Player.X, PlayerType.HUMAN);
        PlayerDefinition second = new AIPlayerDefinitionImpl(Player.O, AILevel.EASY);
        playerDefinitions = Arrays.asList(first, second);
    }

    public SettingsImpl(Settings other) {
        this.rows = other.getRows();
        this.cols = other.getCols();

        List<PlayerDefinition> converted = new ArrayList<>();
        for (PlayerDefinition otherPlayerDefinition : other.getPlayerDefinitions()) {
            converted.add(convert(otherPlayerDefinition));
        }

        playerDefinitions = Collections.unmodifiableList(converted);
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

    static PlayerDefinition convert(PlayerDefinition other) {
        if (other instanceof AIPlayerDefinition) {
            return convert((AIPlayerDefinition)other);
        }

        return new PlayerDefinitionImpl(other);
    }

    static PlayerDefinition convert(AIPlayerDefinition other) {
        return new AIPlayerDefinitionImpl(other);
    }
}