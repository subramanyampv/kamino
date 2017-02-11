package net.ngeor.t3;

import android.content.Intent;
import android.content.SharedPreferences;
import android.os.Bundle;
import android.preference.PreferenceManager;
import android.support.v7.app.AppCompatActivity;
import android.view.View;
import android.widget.TextView;
import net.ngeor.t3.ai.AIPlayer;
import net.ngeor.t3.models.*;
import net.ngeor.t3.settings.AIPlayerDefinition;
import net.ngeor.t3.settings.PlayerDefinition;
import net.ngeor.t3.settings.Settings;

public class MainActivity extends AppCompatActivity implements MainActivityView {
    // model
    private GameModel model;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);

        // load UI
        setContentView(R.layout.activity_main);

        // set default preferences
        PreferenceManager.setDefaultValues(this, R.xml.preferences, false);

        // restore model
        if (savedInstanceState != null) {
            StateManager stateManager = new StateManager(savedInstanceState);
            GameDto savedGameState = stateManager.getGame();
            model = new GameModel(savedGameState);
        } else {
            model = createGameModel();
        }

        // use the same settings the model has
        // if the model had been restored from a saved state,
        // it will be the same settings
        Settings settings = model.getSettings();

        getBoardView().setModel(model.getBoardModel());
        GameListener gameListener = new GameListener(this, settings);
        model.addGameModelListener(gameListener);

        for (PlayerDefinition playerDefinition : settings.getPlayerDefinitions()) {
            switch (playerDefinition.getPlayerType()) {
                case HUMAN:
                    // create touch listener
                    HumanPlayer humanPlayer = new HumanPlayer(model, playerDefinition.getPlayer());
                    getBoardView().setOnTouchListener(humanPlayer);
                    break;
                case CPU:
                    AIPlayerDefinition aiPlayerDefinition = (AIPlayerDefinition)playerDefinition;
                    AIPlayer aiPlayer = new AIPlayer(model, playerDefinition.getPlayer());
                    model.addGameModelListener(aiPlayer);
                    aiPlayer.setAILevel(aiPlayerDefinition.getAILevel());
                    break;
                default:
                    throw new IllegalArgumentException();
            }
        }

        if (model.getState() == GameState.NotStarted) {
            model.start();
        } else {
            // when resuming after device orientation changes,
            // the text needs to be refreshed
            gameListener.updateHeaderText(model);
        }

        findViewById(R.id.btn_restart).setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                model.restart(createSettings());
            }
        });

        findViewById(R.id.btn_settings).setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                Intent intent = new Intent(MainActivity.this, SettingsActivity.class);
                startActivity(intent);
            }
        });
    }


    @Override
    protected void onResume() {
        super.onResume();

        // TODO: if settings changed, do something
    }

    @Override
    public void onSaveInstanceState(Bundle outState) {
        super.onSaveInstanceState(outState);
        StateManager stateManager = new StateManager(outState);
        stateManager.setGame(new GameDto(model));
    }

    @Override
    public void setHeaderText(int resourceId) {
        getHeaderView().setText(resourceId);
    }

    @Override
    public void invalidateBoardView() {
        getBoardView().invalidate();
    }

    private BoardView getBoardView() {
        return (BoardView) findViewById(R.id.board);
    }

    private TextView getHeaderView() {
        return (TextView) findViewById(R.id.header);
    }

    private GameModel createGameModel() {
        Settings settings = createSettings();
        return new GameModel(settings);
    }

    private SharedPreferences createSharedPreferences() {
        return PreferenceManager.getDefaultSharedPreferences(this);
    }

    private Settings createSettings() {
        SharedPreferences sharedPreferences = createSharedPreferences();
        net.ngeor.t3.settings.preferences.SettingsImpl preferenceSettings = new net.ngeor.t3.settings.preferences.SettingsImpl(sharedPreferences);
        net.ngeor.t3.settings.serializable.SettingsImpl serializableSettings = new net.ngeor.t3.settings.serializable.SettingsImpl(preferenceSettings);
        return serializableSettings;
    }
}
