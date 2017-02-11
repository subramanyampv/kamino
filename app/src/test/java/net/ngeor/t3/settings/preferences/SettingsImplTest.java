package net.ngeor.t3.settings.preferences;

import android.content.SharedPreferences;
import net.ngeor.t3.models.AILevel;
import net.ngeor.t3.models.Player;
import net.ngeor.t3.models.PlayerType;
import net.ngeor.t3.settings.PlayerDefinition;
import org.junit.Before;
import org.junit.Test;

import java.util.List;

import static junit.framework.Assert.assertEquals;
import static org.junit.Assert.*;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;

/**
 * Created by ngeor on 2/11/2017.
 */
public class SettingsImplTest {
    private SharedPreferences sharedPreferences;
    private SettingsImpl settings;

    @Before
    public void setUp() {
        sharedPreferences = mock(SharedPreferences.class);
        settings = new SettingsImpl(sharedPreferences);
    }

    @Test
    public void getRows() {
        assertEquals(3, settings.getRows());
    }

    @Test
    public void getCols() {
        assertEquals(3, settings.getCols());
    }

    @Test
    public void getPlayerDefinitions() {
        List<PlayerDefinition> playerDefinitions = settings.getPlayerDefinitions();
        assertNotNull(playerDefinitions);
        assertEquals(2, playerDefinitions.size());
        PlayerDefinition first = playerDefinitions.get(0);
        assertEquals(Player.X, first.getPlayer());
        assertEquals(PlayerType.HUMAN, first.getPlayerType());
        AIPlayerDefinitionImpl second = (AIPlayerDefinitionImpl)playerDefinitions.get(1);
        assertEquals(Player.O, second.getPlayer());
        assertEquals(PlayerType.CPU, second.getPlayerType());
        assertEquals(AILevel.EASY, second.getAILevel());
    }

    @Test
    public void whenFirstPlayerSettingIsNull() {
        when(sharedPreferences.getString("pref_first_player", "")).thenReturn(null);
        assertEquals(Player.X, settings.getPlayerDefinitions().get(0).getPlayer());
    }

    @Test
    public void whenFirstPlayerSettingIsEmpty() {
        when(sharedPreferences.getString("pref_first_player", "")).thenReturn("");
        assertEquals(Player.X, settings.getPlayerDefinitions().get(0).getPlayer());
    }

    @Test
    public void whenFirstPlayerSettingIsInvalid() {
        when(sharedPreferences.getString("pref_first_player", "")).thenReturn("invalid string");
        assertEquals(Player.X, settings.getPlayerDefinitions().get(0).getPlayer());
    }

    @Test
    public void whenFirstPlayerSettingIsO() {
        when(sharedPreferences.getString("pref_first_player", "")).thenReturn(Player.O.toString());
        assertEquals(Player.O, settings.getPlayerDefinitions().get(0).getPlayer());
    }
}