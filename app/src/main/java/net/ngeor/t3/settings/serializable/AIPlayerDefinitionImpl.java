package net.ngeor.t3.settings.serializable;

import net.ngeor.t3.models.AILevel;
import net.ngeor.t3.models.PlayerSymbol;
import net.ngeor.t3.settings.AIPlayerDefinition;

import java.io.Serializable;

/**
 * Created by ngeor on 2/11/2017.
 */
public class AIPlayerDefinitionImpl extends PlayerDefinitionImpl implements AIPlayerDefinition, Serializable {
    private final AILevel aiLevel;
    public AIPlayerDefinitionImpl(PlayerSymbol playerSymbol, AILevel aiLevel) {
        super(playerSymbol);
        this.aiLevel = validateAILevel(aiLevel);
    }

    public AIPlayerDefinitionImpl(AIPlayerDefinition other) {
        super(other);
        this.aiLevel = validateAILevel(other.getAILevel());
    }

    @Override
    public AILevel getAILevel() {
        return aiLevel;
    }

    @Override
    public String toString() {
        return "AIPlayerDefinition{ " +
                getPlayerSymbol() +
                " aiLevel=" + aiLevel +
                '}';
    }

    private static AILevel validateAILevel(AILevel aiLevel) {
        if (aiLevel == null) {
            throw new IllegalArgumentException();
        }

        return aiLevel;
    }
}
