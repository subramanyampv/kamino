package net.ngeor.t3;

import android.os.Bundle;
import android.preference.PreferenceFragment;

/**
 * Created by ngeor on 2/6/2017.
 */
public class SettingsFragment extends PreferenceFragment {
    @Override
    public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        addPreferencesFromResource(R.xml.preferences);
    }
}
