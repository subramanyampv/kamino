package net.ngeor.t3.settings.serializable;

import net.ngeor.t3.models.PlayerSymbol;
import net.ngeor.t3.settings.HumanPlayerDefinition;

public class HumanPlayerDefinitionImpl extends PlayerDefinitionImpl implements HumanPlayerDefinition {

    public HumanPlayerDefinitionImpl(PlayerSymbol playerSymbol) {
        super(playerSymbol);
    }

    public HumanPlayerDefinitionImpl(HumanPlayerDefinition other) {
        super(other);
    }

    @Override
    public String toString() {
        return "HumanPlayerDefinition {" + getPlayerSymbol() + "}";
    }

    @Override
    public boolean equals(Object other) {
        if (other == null) {
            return false;
        }

        if (!(other instanceof HumanPlayerDefinition)) {
            return false;
        }

        HumanPlayerDefinition that = (HumanPlayerDefinition)other;
        return getPlayerSymbol() == that.getPlayerSymbol();
    }

    @Override
    public int hashCode() {
        return getPlayerSymbol().hashCode();
    }
}
