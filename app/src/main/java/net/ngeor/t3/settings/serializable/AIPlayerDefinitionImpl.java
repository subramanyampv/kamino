package net.ngeor.t3.settings.serializable;

import net.ngeor.t3.models.AILevel;
import net.ngeor.t3.models.Player;
import net.ngeor.t3.models.PlayerType;
import net.ngeor.t3.settings.AIPlayerDefinition;

import java.io.Serializable;

/**
 * Created by ngeor on 2/11/2017.
 */
public class AIPlayerDefinitionImpl extends PlayerDefinitionImpl implements AIPlayerDefinition, Serializable {
    private final AILevel aiLevel;
    public AIPlayerDefinitionImpl(Player player, AILevel aiLevel) {
        super(player, PlayerType.CPU);
        this.aiLevel = aiLevel;
    }

    public AIPlayerDefinitionImpl(AIPlayerDefinition other) {
        super(other);
        this.aiLevel = other.getAILevel();
    }

    @Override
    public AILevel getAILevel() {
        return aiLevel;
    }
}
