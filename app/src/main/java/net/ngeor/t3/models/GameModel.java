package net.ngeor.t3.models;

import net.ngeor.t3.settings.Settings;

public interface GameModel {
    PlayerSymbol getTurn();

    GameState getState();

    BoardModel getBoardModel();

    Settings getSettings();
}

