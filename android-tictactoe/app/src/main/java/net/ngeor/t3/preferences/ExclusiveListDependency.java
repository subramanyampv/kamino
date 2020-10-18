package net.ngeor.t3.preferences;

import android.preference.ListPreference;
import android.preference.PreferenceFragment;

import net.ngeor.t3.MessageBox;
import net.ngeor.t3.R;

/**
 * Sets up a dependency between two list preferences, so that they can't be set at the same value.
 *
 * @author ngeor on 11/2/2018.
 */
public class ExclusiveListDependency {
    private final PreferenceFragment preferenceFragment;
    private final MessageBox messageBox;
    private String sourcePreference;
    private String destinationPreference;

    public ExclusiveListDependency(PreferenceFragment preferenceFragment, MessageBox messageBox) {
        this.preferenceFragment = preferenceFragment;
        this.messageBox = messageBox;
    }

    public ExclusiveListDependency sourcePreference(String sourcePreference) {
        this.sourcePreference = sourcePreference;
        return this;
    }

    public ExclusiveListDependency destinationPreference(String destinationPreference) {
        this.destinationPreference = destinationPreference;
        return this;
    }

    public void toggle() {
        preferenceFragment.findPreference(sourcePreference).setOnPreferenceChangeListener((preference, newValue) -> {
            ListPreference listPreference = (ListPreference) preferenceFragment.findPreference(destinationPreference);
            if (listPreference.getValue().equals(newValue)) {
                CharSequence[] entryValues = listPreference.getEntryValues();
                listPreference.setValue(findOther(entryValues, newValue));
                messageBox.show(R.string.info_updated_other_player);
            }

            return true;
        });
    }

    private String findOther(CharSequence[] possibleValues, Object newValue) {
        for (CharSequence possibleValue : possibleValues) {
            if (!possibleValue.equals(newValue)) {
                return String.valueOf(possibleValue);
            }
        }

        throw new IllegalStateException("Could not find exclusive value");
    }
}
