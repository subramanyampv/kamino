package net.ngeor.t3.settings;

import net.ngeor.t3.models.AILevel;
import net.ngeor.t3.models.PlayerSymbol;

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

    private static AILevel validateAILevel(AILevel aiLevel) {
        if (aiLevel == null) {
            throw new IllegalArgumentException();
        }

        return aiLevel;
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

    @Override
    public boolean equals(Object other) {
        if (other == null) {
            return false;
        }

        if (!(other instanceof AIPlayerDefinition)) {
            return false;
        }

        AIPlayerDefinition that = (AIPlayerDefinition) other;
        return this.getPlayerSymbol() == that.getPlayerSymbol() && this.getAILevel() == that.getAILevel();
    }

    @Override
    public int hashCode() {
        return getPlayerSymbol().hashCode() ^ aiLevel.hashCode();
    }
}
