package net.ngeor.t3;

import android.os.Bundle;

import net.ngeor.t3.models.BoardModel;
import net.ngeor.t3.models.GameState;
import net.ngeor.t3.models.PlayerSymbol;
import net.ngeor.t3.settings.Settings;

import org.junit.Before;
import org.junit.Test;

import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertNull;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

/**
 * Unit test for StateManager.
 * Created by ngeor on 2/7/2017.
 */
public class StateManagerTest {
    private Bundle bundle;
    private StateManager stateManager;

    @Before
    public void before() {
        bundle = mock(Bundle.class);
        stateManager = new StateManager(bundle);
    }

    @Test
    public void getSettings() {
        Settings settings = mock(Settings.class);
        when(bundle.getSerializable("settings")).thenReturn(settings);
        Settings actualSettings = stateManager.getSettings();
        assertEquals(settings, actualSettings);
    }

    @Test
    public void setSettings() {
        Settings settings = mock(Settings.class);
        stateManager.setSettings(settings);
        verify(bundle).putSerializable("settings", settings);
    }

    @Test
    public void getBoardModel() {
        BoardModel boardModel = mock(BoardModel.class);
        when(bundle.getSerializable("boardModel")).thenReturn(boardModel);
        BoardModel actualBoardModel = stateManager.getBoardModel();
        assertEquals(boardModel, actualBoardModel);
    }

    @Test
    public void setBoardModel() {
        BoardModel boardModel = mock(BoardModel.class);
        stateManager.setBoardModel(boardModel);
        verify(bundle).putSerializable("boardModel", boardModel);
    }

    @Test
    public void getGameState() {
        when(bundle.getString("gameState")).thenReturn("Draw");
        GameState state = stateManager.getGameState();
        assertEquals(GameState.Draw, state);
    }

    @Test
    public void getGameState_whenBundleHasNullValue() {
        when(bundle.getString("gameState")).thenReturn(null);
        GameState state = stateManager.getGameState();
        assertEquals(GameState.NotStarted, state);
    }

    @Test
    public void getGameState_whenBundleHasUnknownValue() {
        when(bundle.getString("gameState")).thenReturn("Oops");
        GameState state = stateManager.getGameState();
        assertEquals(GameState.NotStarted, state);
    }

    @Test
    public void setGameState() {
        stateManager.setGameState(GameState.Draw);
        verify(bundle).putString("gameState", "Draw");
    }

    @Test
    public void getPlayerSymbol() {
        when(bundle.getString("turn")).thenReturn("O");
        PlayerSymbol playerSymbol = stateManager.getTurn();
        assertEquals(PlayerSymbol.O, playerSymbol);
    }

    @Test
    public void getPlayerSymbol_whenBundleHasNullValue() {
        when(bundle.getString("turn")).thenReturn(null);
        PlayerSymbol playerSymbol = stateManager.getTurn();
        assertNull(playerSymbol);
    }

    @Test
    public void getPlayerSymbol_whenBundleHasUnknownValue() {
        when(bundle.getString("turn")).thenReturn("Oops");
        PlayerSymbol playerSymbol = stateManager.getTurn();
        assertNull(playerSymbol);
    }

    @Test
    public void setPlayerSymbol() {
        stateManager.setTurn(PlayerSymbol.O);
        verify(bundle).putString("turn", "O");
    }

    @Test
    public void setPlayerSymbol_Null() {
        stateManager.setTurn(null);
        verify(bundle).putString("turn", "");
    }
}
