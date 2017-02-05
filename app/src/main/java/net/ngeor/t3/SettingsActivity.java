package net.ngeor.t3;

import android.app.Activity;
import android.content.Intent;
import android.support.v7.app.AppCompatActivity;
import android.os.Bundle;
import android.view.View;
import android.widget.RadioGroup;
import net.ngeor.t3.models.AILevel;

public class SettingsActivity extends AppCompatActivity {

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_settings);
        Intent intent = getIntent();
        SettingsIntent settingsIntent = new SettingsIntent(intent);
        AILevel aiLevel = settingsIntent.getAILevel();
        RadioGroup radioGroup = (RadioGroup) findViewById(R.id.rb_difficulty);
        int checkedRadioButtonId;
        switch (aiLevel) {
            case Easy:
                checkedRadioButtonId = R.id.rb_easy;
                break;
            case Hard:
                checkedRadioButtonId = R.id.rb_hard;
                break;
            default:
                throw new IndexOutOfBoundsException();
        }

        radioGroup.check(checkedRadioButtonId);
    }

    /**
     * Called when the user clicks the save button.
     *
     * @param view
     */
    public void saveSettings(View view) {
        RadioGroup radioGroup = (RadioGroup) findViewById(R.id.rb_difficulty);
        int checkedRadioButtonId = radioGroup.getCheckedRadioButtonId();
        AILevel aiLevel;
        if (checkedRadioButtonId == R.id.rb_easy) {
            aiLevel = AILevel.Easy;
        } else if (checkedRadioButtonId == R.id.rb_hard) {
            aiLevel = AILevel.Hard;
        } else {
            aiLevel = null;
        }

        Intent intent = new Intent();
        SettingsIntent settingsIntent = new SettingsIntent(intent);
        settingsIntent.setAILevel(aiLevel);
        setResult(Activity.RESULT_OK, intent);
        finish();
    }

    /**
     * Called when the user clicks the revert button.
     *
     * @param view
     */
    public void revertSettings(View view) {
        setResult(Activity.RESULT_CANCELED);
        finish();
    }
}
