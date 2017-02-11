package net.ngeor.t3.settings.preferences;

import android.content.SharedPreferences;
import net.ngeor.t3.models.PlayerSymbol;
import net.ngeor.t3.settings.HumanPlayerDefinition;

public class HumanPlayerDefinitionImpl extends PlayerDefinitionImpl implements HumanPlayerDefinition {

    public HumanPlayerDefinitionImpl(SharedPreferences sharedPreferences, int index, PlayerSymbol playerSymbol) {
        super(sharedPreferences, index, playerSymbol);
    }
}
