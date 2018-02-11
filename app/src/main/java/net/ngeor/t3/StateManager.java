package net.ngeor.t3;

import android.os.Bundle;

import net.ngeor.t3.models.BoardModel;
import net.ngeor.t3.models.GameState;
import net.ngeor.t3.models.PlayerSymbol;
import net.ngeor.t3.settings.Settings;
import net.ngeor.t3.settings.SettingsImpl;

/**
 * Handles the state of the main activity during creation and saving.
 * Created by ngeor on 2/7/2017.
 */
public class StateManager {
    private final Bundle bundle;

    public StateManager(Bundle bundle) {
        this.bundle = bundle;
    }

    public Settings getSettings() {
        return (Settings) bundle.getSerializable("settings");
    }

    public void setSettings(SettingsImpl settings) {
        bundle.putSerializable("settings", settings);
    }

    public BoardModel getBoardModel() {
        return (BoardModel) bundle.getSerializable("boardModel");
    }

    public void setBoardModel(BoardModel boardModel) {
        bundle.putSerializable("boardModel", boardModel);
    }

    public GameState getGameState() {
        try {
            return GameState.valueOf(bundle.getString("gameState"));
        } catch (NullPointerException | IllegalArgumentException ex) {
            return GameState.NotStarted;
        }
    }

    public void setGameState(GameState gameState) {
        bundle.putString("gameState", gameState.toString());
    }

    public PlayerSymbol getTurn() {
        try {
            return PlayerSymbol.valueOf(bundle.getString("turn"));
        } catch (NullPointerException | IllegalArgumentException ex) {
            return null;
        }
    }

    public void setTurn(PlayerSymbol playerSymbol) {
        bundle.putString("turn", playerSymbol == null ? "" : playerSymbol.toString());
    }
}
