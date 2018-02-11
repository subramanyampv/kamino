package net.ngeor.t3;

import android.content.Intent;
import android.content.SharedPreferences;
import android.os.Bundle;
import android.preference.PreferenceManager;
import android.support.v7.app.AppCompatActivity;
import android.util.Log;
import android.view.View;
import android.widget.TextView;
import android.widget.Toast;

import net.ngeor.t3.models.GameModelHolder;
import net.ngeor.t3.models.GameState;
import net.ngeor.t3.models.ImmutableGameModelImpl;
import net.ngeor.t3.settings.PreferenceBackedSettings;
import net.ngeor.t3.settings.Settings;
import net.ngeor.t3.settings.SettingsImpl;

public class MainActivity extends AppCompatActivity implements MainActivityView {
    public static final String TAG = "MainActivity";
    private final CompositeTouchListener boardTouchListener = new CompositeTouchListener();
    private final PlayerFactory playerFactory;
    private final GameListener gameListener = new GameListener(this);
    private final GameModelHolder model = new GameModelHolder();

    public MainActivity() {
        Log.d(TAG, "ctor");
        model.addGameModelListener(gameListener);
        playerFactory = new PlayerFactory(
                this,
                model,
                msg -> Toast.makeText(this, msg, Toast.LENGTH_SHORT).show(),
                boardTouchListener
        );
    }

    /**
     * Saves the state of the current game in the given bundle.
     *
     * @param outState The bundle to save state into.
     */
    @Override
    public void onSaveInstanceState(Bundle outState) {
        super.onSaveInstanceState(outState);
        StateManager stateManager = new StateManager(outState);
        stateManager.setSettings(new SettingsImpl(model.getSettings()));
        stateManager.setBoardModel(model.getBoardModel());
        stateManager.setGameState(model.getState());
        stateManager.setTurn(model.getTurn());
    }

    @Override
    public void setHeaderText(int resourceId) {
        getHeaderView().setText(resourceId);
    }

    @Override
    public void invalidateBoardView() {
        getBoardView().invalidate();
    }

    public void onRestartClick(View view) {
        createModel(null);
        model.start();
    }

    public void onSettingsClick(View view) {
        Intent intent = new Intent(MainActivity.this, SettingsActivity.class);
        startActivity(intent);
    }

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);

        Log.d(TAG, "onCreate");

        // load UI
        setContentView(R.layout.activity_main);

        // set default preferences
        PreferenceManager.setDefaultValues(this, R.xml.preferences, false);

        // restore or create model
        createModel(savedInstanceState);

        // configure BoardView
        BoardView boardView = getBoardView();
        boardView.setOnTouchListener(boardTouchListener);
        boardView.setModel(model);

        // start game
        if (model.getState() == GameState.NotStarted) {
            model.start();
        } else {
            // when resuming after device orientation changes,
            // the text needs to be refreshed
            gameListener.updateHeaderText(model);
        }
    }

    @Override
    protected void onResume() {
        super.onResume();
        Log.d(TAG, "onResume");

        if (settingsHaveChanged()) {
            onRestartClick(null);
        }
    }

    private boolean settingsHaveChanged() {
        Settings settingsFromPreferences = getSettingsFromPreferences();
        Settings modelSettings = model.getSettings();
        return !settingsFromPreferences.equals(modelSettings);
    }

    private BoardView getBoardView() {
        return (BoardView) findViewById(R.id.board);
    }

    private TextView getHeaderView() {
        return (TextView) findViewById(R.id.header);
    }

    /**
     * Gets the preferences of this view.
     */
    private SharedPreferences getDefaultSharedPreferences() {
        return PreferenceManager.getDefaultSharedPreferences(this);
    }

    private Settings getSettingsFromPreferences() {
        SharedPreferences sharedPreferences = getDefaultSharedPreferences();
        PreferenceBackedSettings preferenceSettings = new PreferenceBackedSettings(sharedPreferences);
        return preferenceSettings.createSettings();
    }

    private void createModel(Bundle savedInstanceState) {
        playerFactory.destroyPlayers();

        if (savedInstanceState != null) {
            // resuming
            StateManager stateManager = new StateManager(savedInstanceState);
            model.setBackingModel(new ImmutableGameModelImpl(
                    stateManager.getSettings(),
                    stateManager.getBoardModel(),
                    stateManager.getGameState(),
                    stateManager.getTurn()));
        } else {

            // restarting game via button or first time run
            model.setBackingModel(new ImmutableGameModelImpl(getSettingsFromPreferences()));
        }

        playerFactory.createPlayers();
    }
}
