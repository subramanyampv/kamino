package net.ngeor.t3.settings.preferences;

import android.content.SharedPreferences;
import net.ngeor.t3.models.AILevel;
import net.ngeor.t3.models.PlayerSymbol;
import net.ngeor.t3.settings.HumanPlayerDefinition;
import net.ngeor.t3.settings.PlayerDefinition;
import org.junit.Before;
import org.junit.Test;

import java.util.List;

import static junit.framework.Assert.assertEquals;
import static org.junit.Assert.assertNotNull;
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
        // act
        List<PlayerDefinition> playerDefinitions = settings.getPlayerDefinitions();

        // assert list
        assertNotNull(playerDefinitions);
        assertEquals(2, playerDefinitions.size());

        // assert first player
        HumanPlayerDefinition first = (HumanPlayerDefinition)playerDefinitions.get(0);
        assertEquals(PlayerSymbol.X, first.getPlayerSymbol());

        // assert second player
        AIPlayerDefinitionImpl second = (AIPlayerDefinitionImpl)playerDefinitions.get(1);
        assertEquals(PlayerSymbol.O, second.getPlayerSymbol());
        assertEquals(AILevel.EASY, second.getAILevel());
    }

    @Test
    public void whenFirstPlayerSettingIsNull() {
        when(sharedPreferences.getString("pref_first_player", "")).thenReturn(null);
        assertEquals(PlayerSymbol.X, settings.getPlayerDefinitions().get(0).getPlayerSymbol());
    }

    @Test
    public void whenFirstPlayerSettingIsEmpty() {
        when(sharedPreferences.getString("pref_first_player", "")).thenReturn("");
        assertEquals(PlayerSymbol.X, settings.getPlayerDefinitions().get(0).getPlayerSymbol());
    }

    @Test
    public void whenFirstPlayerSettingIsInvalid() {
        when(sharedPreferences.getString("pref_first_player", "")).thenReturn("invalid string");
        assertEquals(PlayerSymbol.X, settings.getPlayerDefinitions().get(0).getPlayerSymbol());
    }

    @Test
    public void whenFirstPlayerSettingIsO() {
        when(sharedPreferences.getString("pref_first_player", "")).thenReturn(PlayerSymbol.O.toString());
        assertEquals(PlayerSymbol.O, settings.getPlayerDefinitions().get(0).getPlayerSymbol());
    }
}