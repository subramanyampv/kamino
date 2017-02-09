package net.ngeor.t3;

import android.content.Context;
import android.content.SharedPreferences;
import android.preference.PreferenceManager;
import net.ngeor.t3.models.AILevel;
import net.ngeor.t3.models.Player;
import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.powermock.api.mockito.PowerMockito;
import org.powermock.core.classloader.annotations.PrepareForTest;
import org.powermock.modules.junit4.PowerMockRunner;

import static junit.framework.Assert.assertEquals;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;

/**
 * Created by ngeor on 2/9/2017.
 */
@RunWith(PowerMockRunner.class)
@PrepareForTest(PreferenceManager.class)
public class SettingsAdapterTest {
    private SettingsAdapter settingsAdapter;
    private Context context;
    private SharedPreferences sharedPreferences;

    @Before
    public void before() {
        PowerMockito.mockStatic(PreferenceManager.class);
        context = mock(Context.class);
        sharedPreferences = mock(SharedPreferences.class);
        when(PreferenceManager.getDefaultSharedPreferences(context)).thenReturn(sharedPreferences);
        settingsAdapter = new SettingsAdapter(context);
    }

    @Test
    public void getAILevelShouldReturnEasyOnNullValue() {
        when(sharedPreferences.getString("pref_ai_level", "")).thenReturn(null);
        assertEquals(AILevel.EASY, settingsAdapter.getAILevel());
    }

    @Test
    public void getAILevelShouldReturnEasyOnEmptyValue() {
        when(sharedPreferences.getString("pref_ai_level", "")).thenReturn("");
        assertEquals(AILevel.EASY, settingsAdapter.getAILevel());
    }

    @Test
    public void getAILevelShouldReturnEasyOnInvalidValue() {
        when(sharedPreferences.getString("pref_ai_level", "")).thenReturn("invalid string");
        assertEquals(AILevel.EASY, settingsAdapter.getAILevel());
    }

    @Test
    public void getAILevelShouldReturnHard() {
        when(sharedPreferences.getString("pref_ai_level", "")).thenReturn(AILevel.HARD.toString());
        assertEquals(AILevel.HARD, settingsAdapter.getAILevel());
    }

    @Test
    public void getgetFirstPlayerShouldReturnXOnNullValue() {
        when(sharedPreferences.getString("pref_first_player", "")).thenReturn(null);
        assertEquals(Player.X, settingsAdapter.getFirstPlayer());
    }

    @Test
    public void getgetFirstPlayerShouldReturnXOnEmptyValue() {
        when(sharedPreferences.getString("pref_first_player", "")).thenReturn("");
        assertEquals(Player.X, settingsAdapter.getFirstPlayer());
    }

    @Test
    public void getgetFirstPlayerShouldReturnXOnInvalidValue() {
        when(sharedPreferences.getString("pref_first_player", "")).thenReturn("invalid string");
        assertEquals(Player.X, settingsAdapter.getFirstPlayer());
    }

    @Test
    public void getFirstPlayerShouldReturnO() {
        when(sharedPreferences.getString("pref_first_player", "")).thenReturn(Player.O.toString());
        assertEquals(Player.O, settingsAdapter.getFirstPlayer());
    }

}
