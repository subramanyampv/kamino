package net.ngeor.t3.preferences;

import android.preference.Preference;
import android.preference.PreferenceFragment;

/**
 * Enables or disables a preference based on the value of another preference.
 *
 * @author ngeor on 11/2/2018.
 */
public class EnablingDependency {
    private final PreferenceFragment preferenceFragment;
    private String preferenceKey;
    private String dependencyKey;

    public EnablingDependency(PreferenceFragment preferenceFragment) {
        this.preferenceFragment = preferenceFragment;
    }

    public EnablingDependency enablePreference(String preferenceKey) {
        this.preferenceKey = preferenceKey;
        return this;
    }

    public EnablingDependency whenPreference(String dependencyKey) {
        this.dependencyKey = dependencyKey;
        return this;
    }

    public void equals(String enablingValue) {
        // initial enable-disable
        findPreference().setEnabled(
                enablingValue.equals(preferenceFragment.getPreferenceManager().getSharedPreferences().getString(dependencyKey, "")));

        // listen to dependency property to update enable-disable state
        findDependencyPreference().setOnPreferenceChangeListener((preference, newValue) -> {
            findPreference().setEnabled(enablingValue.equals(newValue));
            return true;
        });
    }

    private Preference findDependencyPreference() {
        return preferenceFragment.findPreference(dependencyKey);
    }

    private Preference findPreference() {
        return preferenceFragment.findPreference(preferenceKey);
    }
}
