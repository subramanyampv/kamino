package net.ngeor.t3.settings;

import net.ngeor.t3.models.PlayerSymbol;

public class HumanPlayerDefinition extends PlayerDefinition {

    public HumanPlayerDefinition(PlayerSymbol playerSymbol) {
        super(playerSymbol);
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

        HumanPlayerDefinition that = (HumanPlayerDefinition) other;
        return getPlayerSymbol() == that.getPlayerSymbol();
    }

    @Override
    public int hashCode() {
        return getPlayerSymbol().hashCode();
    }
}
