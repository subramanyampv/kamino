package net.ngeor.t3.preferences;

import android.os.Bundle;
import android.preference.PreferenceFragment;
import android.widget.Toast;

import net.ngeor.t3.R;

/**
 * Manages the settings of the application.
 *
 * @author ngeor on 2/6/2017.
 */
public class SettingsFragment extends PreferenceFragment {
    @Override
    public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        addPreferencesFromResource(R.xml.preferences);

        PlayerPreferenceKeys playerPreferenceKeys = new PlayerPreferenceKeys();

        for (final PlayerName playerName : PlayerName.values()) {

            new EnablingDependency(this)
                    .enablePreference(playerPreferenceKeys.aILevel(playerName))
                    .whenPreference(playerPreferenceKeys.type(playerName))
                    .equals("CPU");

            new ExclusiveListDependency(this, this::showMessage)
                    .sourcePreference(playerPreferenceKeys.symbol(playerName))
                    .destinationPreference(playerPreferenceKeys.symbol(playerName.other()))
                    .toggle();
        }
    }

    private void showMessage(int messageId) {
        Toast.makeText(getView().getContext(), messageId, Toast.LENGTH_SHORT).show();
    }
}

