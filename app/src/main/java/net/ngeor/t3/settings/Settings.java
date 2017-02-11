package net.ngeor.t3.settings;

import java.util.List;

/**
 * Describes the settings of the game.
 * Created by ngeor on 2/11/2017.
 */
public interface Settings {
    int getRows();
    int getCols();
    List<PlayerDefinition> getPlayerDefinitions();
}

