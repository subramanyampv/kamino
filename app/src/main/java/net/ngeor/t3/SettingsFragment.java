package net.ngeor.t3;

import android.content.SharedPreferences;
import android.os.Bundle;
import android.preference.ListPreference;
import android.preference.Preference;
import android.preference.PreferenceFragment;

/**
 * Created by ngeor on 2/6/2017.
 */
public class SettingsFragment extends PreferenceFragment {
    @Override
    public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        addPreferencesFromResource(R.xml.preferences);

        for (final String playerNumber : new String[]{"first", "second"}) {
            setEnumDependency("pref_key_" + playerNumber + "_player_type",
                    "pref_key_" + playerNumber + "_player_ai_level",
                    "CPU", "");

            findPreference("pref_key_" + playerNumber + "_player_symbol").setOnPreferenceChangeListener(new Preference.OnPreferenceChangeListener() {
                @Override
                public boolean onPreferenceChange(Preference preference, Object newValue) {
                    String otherValue = "X".equals(newValue) ? "O" : "X";
                    String otherPlayer = "first".equals(playerNumber) ? "second" : "first";
                    String otherKey = "pref_key_" + otherPlayer + "_player_symbol";
                    ListPreference listPreference = (ListPreference)findPreference(otherKey);
                    listPreference.setValue(otherValue);
                    return true;
                }
            });

        }
    }

    private void setEnumDependency(String sourceKey, final String dependentKey, final String enablingValue, String defaultValue) {
        findPreference(dependentKey).setEnabled(
                enablingValue.equals(getPreferenceManager().getSharedPreferences().getString(sourceKey, defaultValue)));
        findPreference(sourceKey).setOnPreferenceChangeListener(new Preference.OnPreferenceChangeListener() {
            @Override
            public boolean onPreferenceChange(Preference preference, Object newValue) {
                findPreference(dependentKey).setEnabled(enablingValue.equals(newValue));
                return true;
            }
        });
    }
}
