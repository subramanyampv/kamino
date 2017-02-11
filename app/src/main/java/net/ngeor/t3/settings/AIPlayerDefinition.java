package net.ngeor.t3.settings;

import net.ngeor.t3.models.AILevel;

public interface AIPlayerDefinition extends PlayerDefinition {
    AILevel getAILevel();
}
